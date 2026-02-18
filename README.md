# AAMAS 2026 Tutorial Website (GitHub Pages)

This folder contains a ready-to-publish static website for the AAMAS 2026 tutorial:

**Don’t Trust Your Agents, Verify Them: Strategic Verification with VITAMIN**

## What’s inside
- `index.html` — the website
- `proposal.pdf` — your submitted proposal (optional download link on the site)
- `slides/` — **empty on purpose** (put your final slides here; keep `.gitkeep` so Git retains the folder)
- `materials/` — extra materials attendees may find useful
- `assets/` — CSS/JS/images

## Publish on GitHub Pages (quick steps)
1. Create a new GitHub repository (or reuse an existing one).
2. Upload the contents of this folder to the repository root.
3. In GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, select:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main` (or `master`) and `/ (root)`
5. Save. Your site will be available at the URL shown in the Pages settings.

## Updating slides
Put your slide deck in `slides/` (e.g., `slides/aamas2026-vitamin-tutorial.pdf`).
The website automatically lists files in that folder only if you add links to them in `index.html`.
For a simple approach, replace the placeholder link in the “Slides” section.

