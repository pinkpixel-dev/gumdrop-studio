# Changelog

All notable changes to **Gumdrop Studio** are documented here.

## 2026-03-01 — v1.1.0

### 🌐 Links

- **Web App:** https://gumdropstudio.app
- **Docs:** https://docs.gumdropstudio.app
- **GitHub Release:** https://github.com/pinkpixel-dev/gumdrop-studio/releases/tag/v1.1.0
- **npm:** `npm i -g @pinkpixel/gumdrop-studio@latest`

### Changes

- Added **Tauri 2 desktop app** — Gumdrop Studio now ships as a native desktop application
- Native app menu (File, Edit, View, Help) with keyboard shortcuts (Ctrl+N, Ctrl+S, Ctrl+Z, Ctrl+G, etc.)
- Export submenu in desktop menu bar for all five formats (PNG, JPG, SVG, JSON, HTML)
- Added `src-tauri/` with `main.rs`, `Cargo.toml`, `tauri.conf.json`, and app icons
- Added `src/utils/desktop.js` for Tauri menu event bridge
- Added `src/utils/storage.js` for unified project persistence (localStorage / Tauri store)
- Added `npm run tauri:dev` and `npm run tauri:build` scripts
- Desktop build outputs AppImage + .deb installers to `src-tauri/target/release/bundle/`
- Published Linux installers to [GitHub Releases](https://github.com/pinkpixel-dev/gumdrop-studio/releases/tag/v1.1.0)
- Published npm package as [`@pinkpixel/gumdrop-studio`](https://www.npmjs.com/package/@pinkpixel/gumdrop-studio)
- Fixed invalid JSON and stray code blocks in `tauri.conf.json` and `Cargo.toml`
- Fixed `split-debuginfo` placeholder values in `Cargo.toml`
- Fixed AppImage bundling on modern systems with `NO_STRIP=YES` (old linuxdeploy strip incompatibility)
- Updated bundle category to `Graphics and Design`
- Set desktop window to 1800×1400 (default)
- Bumped all dependencies to latest: React 19.2.4, Vite 7.3.1, Tailwind 4.1.18, Wrangler 4.65.0
- Updated all documentation to reflect Tauri desktop architecture

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
