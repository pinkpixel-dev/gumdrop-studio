# 🚀 Quick Setup Guide

## Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**

> **For the desktop app (Tauri):** Rust is also required.
>
> ```bash
> curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
> ```
>
> On Linux, also install: `webkit2gtk-4.1`, `libappindicator3-dev`, `librsvg2-dev`  
> (Arch: `sudo pacman -S webkit2gtk-4.1 libappindicator-gtk3 librsvg`)

## Installation Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. **Open your browser**
   The app will automatically open at `http://localhost:1234`

## Available Commands

### Browser / Web

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to Cloudflare Pages (preview)
- `npm run deploy:production` - Deploy to Cloudflare Pages (production)

### Desktop (Tauri)

- `npm run tauri:dev` - Start Tauri desktop app in dev mode
- `npm run tauri:build` - Build native desktop installers (AppImage + .deb)

> Built installers are output to `src-tauri/target/release/bundle/`

## Project Structure

```
src/
├── components/          # React components
│   ├── Canvas.jsx      # Main drawing canvas (dual-layer)
│   ├── ColorWheel.jsx  # Color picker wheel
│   ├── Footer.jsx      # Footer component
│   ├── Header.jsx      # Header with theme toggle
│   ├── ProjectPanel.jsx # Save/load/export panel
│   └── ToolPanel.jsx   # Drawing tools panel
├── utils/              # Utility functions
│   ├── canvas.js       # Canvas rendering utilities
│   ├── colors.js       # Color conversion functions
│   ├── desktop.js      # Tauri menu event listeners
│   ├── helpers.js      # General helper functions
│   ├── rasterizers.js  # Drawing algorithms (line, circle, etc.)
│   └── storage.js      # Project persistence
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles

src-tauri/
├── src/main.rs         # Tauri entry + native menu
├── Cargo.toml          # Rust dependencies
├── tauri.conf.json     # Window & bundle configuration
└── icons/              # App icons

public/
├── favicon.png         # App favicon
├── logo.png            # Brand logo
├── _redirects          # Cloudflare Pages SPA routing
└── _routes.json        # Cloudflare routing config
```

## Troubleshooting

If you encounter any issues:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear browser cache
4. Try `npm run dev` again

For Tauri-specific issues, check that Rust and all system libraries are installed. On Linux, the `linuxdeploy` tool used for AppImage bundling is downloaded automatically to `~/.cache/tauri/` on first build.

Enjoy creating pixel art! 🎨
