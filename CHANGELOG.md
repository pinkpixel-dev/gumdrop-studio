# Changelog

All notable changes to **Gumdrop Studio** are documented here.

## 2026-02-11

- Configured project for **Cloudflare Pages** deployment with Wrangler
- Added `npm run deploy` and `npm run deploy:production` scripts
- Created `_redirects` and `_routes.json` for proper SPA routing on Cloudflare
- Installed wrangler as dev dependency (^4.64.0)
- Fixed duplicate `index.html` in public folder that was breaking builds
- Updated all documentation to reflect deployment setup and accurate project structure

## 2025-10-24

- Added the `Pixel Stamp ⬛` tool for precise single-cell placement and made it the default selection on startup
- Smoothed out pointer handling so single-pixel strokes no longer streak across the canvas
- Tuned the light theme palette to a softer cream gradient and ensured the pixel grid retains contrast in both themes
- Added Header and Footer components for better structure
- Implemented dark/light mode toggle in header
- Updated documentation to reflect the new tool and interface adjustments
