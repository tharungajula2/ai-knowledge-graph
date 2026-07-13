# Block 14.1 — Deployment Strategies & Docker

## 1. Brutal Honesty: Three Free Hosting Options for VIZIER's Backend

When deploying VIZIER's backend, we must balance costs ($0) against technical constraints (Ollama local inference, Google OAuth credentials storage, cold starts, and database connection pooling).

| Option | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- |
| **A. Local-First + Cloudflare Tunnel** *(Recommended)* | Runs locally on your machine. Access to local GPU (Ollama) and local OAuth key files. Infinite compute, 100% free. | Laptop must remain on/awake to access backend from elsewhere. | **Winner** for personal agent systems with OAuth credentials. |
| **B. Hugging Face Spaces (Docker CPU)** | Free 24/7 web hosting, simple git deployment, handles environment variables securely. | Cold starts, CPU only (too slow for local models/Ollama), requires writing a Dockerfile. | Good backup option if you rely solely on cloud model APIs (Gemini/Groq). |
| **C. Render (Free Web Service)** | Standard hosting platform, auto-builds from GitHub. | Heavy cold starts (spins down after 15 mins of inactivity, taking 1-2 minutes to boot back up), very limited CPU. | Hard to recommend due to slow responsiveness for real-time SSE streams. |

---

## 2. Cloudflare Tunnel Setup Guide (Recommended Default)

A Cloudflare Tunnel securely exposes your local web server (running on `localhost:8000`) to the public internet under a custom domain (e.g. `api.yourdomain.com`) without opening any ports on your local router or exposing your home IP.

### Step-by-Step Setup:
1. **Install cloudflared**:
   Download the Cloudflare Tunnel client from [Cloudflare website](https://github.com/cloudflare/cloudflared/releases).
2. **Authenticate**:
   Run in your terminal:
   ```bash
   cloudflared tunnel login
   ```
   Select your Cloudflare domain in the browser window that opens.
3. **Create the Tunnel**:
   Run:
   ```bash
   cloudflared tunnel create vizier-backend
   ```
   This generates a tunnel configuration file and a unique Tunnel ID.
4. **Configure Routing**:
   Route the tunnel to your custom subdomain:
   ```bash
   cloudflared tunnel route dns vizier-backend api.yourdomain.com
   ```
5. **Start the Tunnel**:
   Run:
   ```bash
   cloudflared tunnel run --url http://localhost:8000 vizier-backend
   ```
   Now, any public request made to `https://api.yourdomain.com` will be securely routed straight to your local FastAPI server running on `localhost:8000`!

---

## 3. Docker Mini-Lesson

Docker packages your application code, dependencies, system libraries, and runtime environment into a single, standardized container.

### Key Concepts:
- **Image**: A read-only template containing instructions to build a container. Think of it as a blueprint or virtual machine snapshot.
- **Container**: A running, isolated instance of a Docker image.
- **Layers**: Docker builds images in steps (layers) corresponding to instructions in the Dockerfile. Layers are cached, speeding up subsequent builds.
- **`.dockerignore`**: A file specifying which local folders (like `.venv`, `.git`, `.cache`, `secrets`) should be excluded from the Docker build context.

---

## 4. Production Dockerfile for VIZIER Backend

Below is the production-ready `Dockerfile` to deploy VIZIER to any container platform (like Hugging Face Spaces, Render, or GCP Cloud Run).

```dockerfile
# Use official lightweight Python image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Set working directory
WORKDIR /app

# Install system dependencies (needed for compiling python dependencies or PostgreSQL drivers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Expose server port
EXPOSE 8000

# Command to run FastAPI server
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
```

### Corresponding `.dockerignore` file:
```text
.git
.venv
__pycache__
.cache
secrets/*.json
*.pyc
*.pyo
.env
```

---

## Key Terms Learned
- **Cloudflare Tunnel**: Secure utility that exposes a local port to a public DNS record without port forwarding.
- **Dockerfile**: Text file containing instructions to assemble a Docker image.
- **Containerization**: Standardizing applications to run consistently across any platform.
- **Cold Start**: The latency delay experienced when a serverless/free-tier app boots up from zero active containers.
