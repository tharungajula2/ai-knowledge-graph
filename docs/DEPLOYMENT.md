# VIZIER Deployment Guide

This guide outlines the steps to deploy the **VIZIER Living Brain** public site using Vercel. 

---

## 1. Architecture & Privacy Architecture
* **Private Source Repository**: The root repository containing raw notes, tools, and scripts remains private.
* **Public Static Deployment**: Vercel compiles the project on push, but **only serves the contents of the `site/` folder** as static output. 
* **Zero Secrets in Build**: All Gemini API keys, local secrets, and environment configurations are stored in local files (`_local-secrets/.env`) and are **not** committed to GitHub or Vercel.

---

## 2. Configuration Setup
* **Build Command**: `npm run build-brain`
* **Output Directory**: `site`

By pointing the output directory exclusively to `site`, Vercel completely ignores other source directories, guaranteeing they are never deployed or exposed.

---

## 3. One-Time Vercel Setup Steps

Follow these instructions to connect your private GitHub repository to Vercel:

1. **Log in to Vercel**:
   Go to [Vercel](https://vercel.com) and log in with your GitHub account.

2. **Add a New Project**:
   * Click **Add New** > **Project** on your dashboard.
   * Under **Import Git Repository**, find your private repository (e.g., `tharungajula2/vizier-ai`) and click **Import**.
   * *If the repository is not visible, click the dropdown to configure GitHub permissions and grant access to the `vizier-ai` repository.*

3. **Configure Project Settings**:
   * **Project Name**: `vizier-ai` (or your preferred URL slug).
   * **Framework Preset**: Choose **Other**.
   * **Root Directory**: Keep it as the workspace root (`./`). Do **not** set it to `site/` because the build commands need to run from the root where `package.json` resides.
   * **Build and Development Settings**:
     * Vercel will automatically read `vercel.json` and populate the **Build Command** as `npm run build-brain` and the **Output Directory** as `site`.
     * If they do not appear, expand the section and override them manually:
       * **Build Command**: `npm run build-brain`
       * **Output Directory**: `site`
       * **Install Command**: Leave empty or keep default `npm install`.

4. **Environment Variables**:
   * Leave this blank. No keys (`GEMINI_API_KEY`, etc.) are needed because the public site is fully static and zero keys are embedded in it.

5. **Click Deploy**:
   * Click **Deploy**. Vercel will clone the private repository, run the build pipeline (generating the static HTML notes, feed, about pages, and interactive JSON indexes), and deploy the output.

---

## 4. Automatic Rebuilds
Every time you push to the `main` branch:
1. Vercel automatically runs a new build.
2. It parses `curriculum/VIZIER_MASTERY_GRAPH.md` and your current notes inside `brain/knowledge/`.
3. It compiles the latest graph JSON files dynamically and updates the active universe statistics.
4. The live map is updated instantly.
5. Simply running the local `npm run sync` script (which auto-pushes to GitHub) will update the public website.
