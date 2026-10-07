# BLRivals HQ — Automated Edition

This version has a real automated updater workflow.

## How it works
1. GitHub Actions runs every 30 minutes.
2. `scripts.js` checks multiple Blue Lock: Rivals code pages.
3. It extracts code-like tokens and updates `data/codes.json`.
4. The mobile website reads that database automatically.
5. A manual GitHub Actions run is also available.

## Important
This is an automation-ready project, not a hosted website. GitHub Actions must be enabled after uploading the project to a GitHub repository. The source sites can change their HTML, so extraction may need maintenance. For production, use official developer announcements/API data whenever available and validate codes before publishing.

## Mobile
`index.html` is mobile-first and works on iPhone once hosted.
