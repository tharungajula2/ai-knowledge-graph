import os
import json
import time
import random
import hashlib
from typing import List, Dict, Any, Optional
import litellm
from app.settings import settings

# Disable telemetry data collection for litellm
litellm.telemetry = False

class ModelGateway:
    """
    ModelGateway manages LLM communication with fallback routing, retry backoffs,
    cooldown management, and development response caching.
    """
    def __init__(self):
        self.cache_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".cache")
        os.makedirs(self.cache_dir, exist_ok=True)
        
        # Track cooldown end timestamps for each provider
        # Format: { provider_name: timestamp }
        self.cooldowns: Dict[str, float] = {}

        # Enable LiteLLM Langfuse callbacks if credentials are set
        if settings.LANGFUSE_PUBLIC_KEY and settings.LANGFUSE_SECRET_KEY:
            os.environ["LANGFUSE_PUBLIC_KEY"] = settings.LANGFUSE_PUBLIC_KEY
            os.environ["LANGFUSE_SECRET_KEY"] = settings.LANGFUSE_SECRET_KEY
            os.environ["LANGFUSE_HOST"] = settings.LANGFUSE_HOST
            
            litellm.success_callback = ["langfuse"]
            litellm.failure_callback = ["langfuse"]
            print("[Gateway] LiteLLM Langfuse global integration enabled.")
        
        # Define priority chain configuration
        self.providers = [
            {
                "name": "gemini",
                "model": f"gemini/{settings.GEMINI_MODEL}",
                "api_key": settings.GEMINI_API_KEY,
                "api_base": None
            },
            {
                "name": "groq",
                "model": "groq/llama-3.3-70b-versatile",
                "api_key": settings.GROQ_API_KEY,
                "api_base": None
            },
            {
                "name": "openrouter",
                "model": "openrouter/google/gemini-2.5-flash-lite:free",
                "api_key": settings.OPENROUTER_API_KEY,
                "api_base": "https://openrouter.ai/api/v1"
            },
            {
                "name": "ollama",
                "model": "ollama/qwen2.5:7b",
                "api_key": "ollama",
                "api_base": "http://localhost:11434"
            }
        ]

        # Define reasoning chain configuration (stronger models)
        self.reasoning_providers = [
            {
                "name": "gemini-pro",
                "model": "gemini/gemini-1.5-pro",
                "api_key": settings.GEMINI_API_KEY,
                "api_base": None
            },
            {
                "name": "groq-70b",
                "model": "groq/llama-3.3-70b-versatile",
                "api_key": settings.GROQ_API_KEY,
                "api_base": None
            },
            {
                "name": "openrouter-pro",
                "model": "openrouter/meta-llama/llama-3.3-70b-instruct",
                "api_key": settings.OPENROUTER_API_KEY,
                "api_base": "https://openrouter.ai/api/v1"
            }
        ]

    def _get_cache_key(self, messages: List[Dict[str, str]], model: str, tools: Optional[List[Dict[str, Any]]] = None, **kwargs) -> str:
        """
        Generate a unique MD5 hash for the request payload.
        """
        payload = {
            "messages": messages,
            "model": model,
            "tools": tools,
            "kwargs": kwargs
        }
        payload_str = json.dumps(payload, sort_keys=True)
        return hashlib.md5(payload_str.encode("utf-8")).hexdigest()

    def _lookup_cache(self, key: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve response from the local disk cache.
        """
        cache_path = os.path.join(self.cache_dir, f"{key}.json")
        if os.path.exists(cache_path):
            try:
                with open(cache_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"[Gateway Cache] Error reading cache file: {e}")
        return None

    def _write_cache(self, key: str, response_data: Dict[str, Any]):
        """
        Write response data to the local disk cache.
        """
        cache_path = os.path.join(self.cache_dir, f"{key}.json")
        try:
            os.makedirs(self.cache_dir, exist_ok=True)
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(response_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[Gateway Cache] Error writing cache file: {e}")

    def _is_cooling(self, provider_name: str) -> bool:
        """
        Check if a provider is currently cooling down after a failure.
        """
        cooldown_end = self.cooldowns.get(provider_name, 0.0)
        if time.time() < cooldown_end:
            return True
        return False

    def _apply_cooldown(self, provider_name: str, duration: float = 60.0):
        """
        Cool down a provider, skipping it for subsequent requests.
        """
        self.cooldowns[provider_name] = time.time() + duration
        print(f"\n[Gateway Cooldown] Cooldown applied to '{provider_name}' for {duration} seconds.")

    def complete(self, messages: List[Dict[str, str]], tools: Optional[List[Dict[str, Any]]] = None, reasoning: bool = False, **kwargs) -> Dict[str, Any]:
        """
        Execute completions using the priority chain, retrying with backoff/jitter 
        and falling back on failures.
        """
        chain = self.providers
        if reasoning:
            chain = self.reasoning_providers + self.providers

        cache_key = self._get_cache_key(messages, chain[0]["model"], tools, **kwargs)
        
        # 1. Lookup cache
        cached_res = self._lookup_cache(cache_key)
        if cached_res:
            print("\n[Gateway Cache] Cache HIT! Returning stored response.")
            cached_res["cached"] = True
            return cached_res

        # 2. Iterate priority chain
        for provider in chain:
            name = provider["name"]
            model = provider["model"]
            api_key = provider["api_key"]
            api_base = provider["api_base"]

            # Skip if credentials are missing
            if not api_key and name != "ollama":
                print(f"[Gateway Chain] Skipping '{name}': Credentials not configured.")
                continue

            # Skip if provider is cooling down
            if self._is_cooling(name):
                time_left = round(self.cooldowns[name] - time.time())
                print(f"[Gateway Chain] Skipping '{name}': Cooldown active ({time_left}s left).")
                continue

            print(f"\n[Gateway Chain] Attempting query on '{name}' using model '{model}'...")

            # 3. Try request with retries (backoff + jitter)
            max_attempts = 3
            base_backoff = 2.0
            
            for attempt in range(max_attempts):
                try:
                    # Configure litellm key & base settings dynamically
                    litellm.api_key = api_key
                    if api_base:
                        litellm.api_base = api_base
                    else:
                        litellm.api_base = None

                    start_time = time.time()
                    
                    # Call LiteLLM completion
                    response = litellm.completion(
                        model=model,
                        messages=messages,
                        tools=tools,
                        temperature=0.2,
                        **kwargs
                    )
                    
                    elapsed = time.time() - start_time
                    
                    # Log tokens & cost
                    usage = getattr(response, "usage", None)
                    prompt_tokens = usage.prompt_tokens if usage else 0
                    completion_tokens = usage.completion_tokens if usage else 0
                    total_tokens = usage.total_tokens if usage else 0
                    
                    print(f"[Gateway Metrics] Success on '{name}' ({elapsed:.2f}s). Tokens: prompt={prompt_tokens}, completion={completion_tokens}, total={total_tokens}")

                    # Compose output
                    choice = response.choices[0]
                    reply = choice.message.content or ""
                    tool_calls = getattr(choice.message, "tool_calls", None)
                    
                    # Parse tool calls to JSON if present
                    parsed_tools = None
                    if tool_calls:
                        parsed_tools = [
                            {
                                "id": tc.id,
                                "type": tc.type,
                                "function": {
                                    "name": tc.function.name,
                                    "arguments": tc.function.arguments
                                }
                            } for tc in tool_calls
                        ]

                    result = {
                        "reply": reply,
                        "tool_calls": parsed_tools,
                        "provider_used": name,
                        "model_used": model,
                        "cached": False
                    }

                    # Write cache for future reference
                    self._write_cache(cache_key, result)
                    return result

                except Exception as e:
                    error_msg = str(e).lower()
                    is_rate_limit = "429" in error_msg or "rate_limit" in error_msg
                    
                    print(f"[Gateway Attempt] Attempt {attempt + 1}/{max_attempts} on '{name}' failed: {e}")

                    if is_rate_limit and attempt < max_attempts - 1:
                        # Exponential Backoff + Jitter
                        sleep_time = min(10.0, base_backoff * (2 ** attempt)) + random.uniform(0, 1.0)
                        print(f"[Gateway Backoff] Rate limited. Retrying in {sleep_time:.2f} seconds...")
                        time.sleep(sleep_time)
                    else:
                        # Serious failure or rate limits exhausted: trigger fallback cooldown
                        self._apply_cooldown(name)
                        break  # Break out of attempts, proceed to next provider in fallback list

        raise RuntimeError("VIZIER Model Gateway Error: All providers in fallback chain failed.")

    def embed(self, texts: List[str]) -> List[List[float]]:
        """
        Generate 768-dimensional embeddings for a list of texts.
        Prioritizes the Gemini embedding API (text-embedding-004) and falls back 
        to local sentence-transformers (all-mpnet-base-v2) if offline.
        """
        primary_key = self.providers[0]["api_key"]
        
        # 1. Attempt Gemini Embedding
        if primary_key:
            try:
                import litellm
                litellm.api_key = primary_key
                response = litellm.embedding(
                    model="gemini/text-embedding-004",
                    input=texts
                )
                embeddings = [data["embedding"] for data in response["data"]]
                print(f"[Gateway Embed] Successfully embedded {len(texts)} chunks via Gemini API.")
                return embeddings
            except Exception as e:
                print(f"[Gateway Embed Warning] Gemini embedding failed: {e}. Falling back to local SentenceTransformers...")
        
        # 2. Local Fallback
        try:
            global _local_embed_model
            if "_local_embed_model" not in globals() or _local_embed_model is None:
                from sentence_transformers import SentenceTransformer
                print("[Gateway Embed] Loading local SentenceTransformer model 'all-mpnet-base-v2' (Dimension: 768) into memory cache...")
                _local_embed_model = SentenceTransformer("all-mpnet-base-v2")
            
            embeddings = _local_embed_model.encode(texts)
            print(f"[Gateway Embed] Successfully embedded {len(texts)} chunks via local model.")
            return [e.tolist() for e in embeddings]
        except Exception as local_err:
            print(f"[Gateway Embed Error] Local SentenceTransformer fallback failed: {local_err}")
            raise RuntimeError(f"Failed to generate embeddings: {local_err}")

# Initialize global cache variable
_local_embed_model = None

# Initialize global gateway instance
gateway = ModelGateway()
