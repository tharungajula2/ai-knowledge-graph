from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    """
    Type-safe settings management using Pydantic Settings.
    This class automatically loads environment variables from a .env file.
    By using Pydantic, we guarantee:
    1. Validation: Fail-fast if critical environment variables are missing.
    2. Type safety: Converts string representations (e.g. ports, numbers) to correct types.
    3. Auto-documentation: Provides a structured view of expected variables.
    """
    # LLM Settings
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-2.5-flash-lite"
    
    # LLM Fallbacks
    GROQ_API_KEY: str
    OPENROUTER_API_KEY: str
    
    # Supabase Settings
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_DB_URL: str
    
    # Langfuse Settings
    LANGFUSE_PUBLIC_KEY: str
    LANGFUSE_SECRET_KEY: str
    LANGFUSE_HOST: str = "https://cloud.langfuse.com"
    
    # Telegram Settings
    TELEGRAM_BOT_TOKEN: str
    TELEGRAM_CHAT_ID: str

    # Proactive Services / Weather Geolocation
    WEATHER_LAT: float = 28.6139
    WEATHER_LON: float = 77.2090
    USER_CITY: str = "Delhi"

    # Deployment / Demo Mode Settings
    DEMO_MODE: bool = False
    GROUNDED_RESEARCH_MODE: bool = False

    # Pydantic Settings configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  # Ignore other environment variables not listed here
    )

# Instantiate settings singleton to be imported across backend
settings = Settings()
