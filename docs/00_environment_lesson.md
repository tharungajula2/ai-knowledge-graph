# Lesson 0.0: Environments, Hygiene, and Monorepos

Welcome to your first mini-lesson! Before we write any code, we must understand the environment we are building in. Professional engineering is built on discipline, security, and reproducibility. Let's break down the core concepts you'll use daily.

---

## 1. What is a Virtual Environment?

### The Analogy: The Shared Kitchen
Imagine your computer is a massive kitchen. 
* **Global Installation:** If you install all Python packages globally, it is like every chef throwing their ingredients, spice jars, and utensils into one giant cupboard. Eventually, chef A needs a specific brand of salt (e.g., `package version 1.0`), but chef B overwrites it with a different version (`package version 2.0`) for their recipe. The kitchen becomes a chaotic mess, recipes break, and dinners are ruined.
* **Virtual Environment (venv):** Creating a virtual environment is like giving each project its own private, isolated cooking station with its own set of ingredients, spices, and utensils. Nothing you install at this station will leak out or affect other cooking stations on your computer.

### Why Global Pip Installs are Bad
If you run `pip install <package>` globally (outside a virtual environment):
1. **Version Conflicts:** Different projects will require different versions of the same package, leading to errors.
2. **System Instability:** You might accidentally update or overwrite packages that your operating system or other tools depend on.
3. **Hard to Reproduce:** It becomes impossible to know exactly which packages your project actually needs to run when deploying it to the cloud.

---

## 2. How to Create and Activate a Virtual Environment

A virtual environment is just a folder (usually named `.venv`) containing a copy of the Python interpreter and a private `site-packages/` directory where your installations go.

### On Windows (PowerShell)
To create and activate a virtual environment:
```powershell
# 1. Create the environment
python -m venv .venv

# 2. Activate it
.venv\Scripts\Activate.ps1
```
*When activated, you will see `(.venv)` prepended to your command prompt.*

### On macOS / Linux (Terminal)
```bash
# 1. Create the environment
python3 -m venv .venv

# 2. Activate it
source .venv/bin/activate
```

---

## 3. What is `requirements.txt`?

### The Recipe Card
A `requirements.txt` file is your project's list of ingredients. Instead of passing around massive folders containing installed packages (which can be gigabytes in size), we write down the exact names and version numbers of the packages our project needs.

When a new developer (or a server in the cloud) wants to run your project, they simply run one command to install all the dependencies:
```powershell
pip install -r requirements.txt
```

---

## 4. What are `.env` Files and Secret Hygiene?

### The Analogy: The Security Passphrase
Imagine your API keys (Gemini, Supabase, Telegram) are physical keys to your house. 
* You would never draw a picture of your house key and print it in a public newspaper (Git/GitHub).
* Instead, you keep the key in your pocket (`.env` file) and tell your family (the code) to look in your pocket when they need to unlock the door (`os.getenv()`).

### The `.gitignore` Guardrail
A `.env` file is a plain-text file containing your real secret keys. We create a special file called `.gitignore` which lists files Git must **never** track. This ensures that even if you run `git add .` and push your code to GitHub, your secrets remain safe on your local machine.

---

## 5. What is a Monorepo?

### The Analogy: The Department Store
A **Monorepo** (monolithic repository) is a single Git repository that contains multiple distinct projects or components. 
In VIZIER, we have:
1. A **frontend** application (`web/`) built with React and Next.js.
2. A **backend** API service (`backend/`) built with Python and FastAPI.

Instead of creating two separate Git repositories (which makes it hard to coordinate code changes and deployments), we house them under one roof while keeping their folder structures completely separate.
