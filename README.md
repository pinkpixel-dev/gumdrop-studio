<div align="center">

<p align="center">
    <img src="./logo.png" alt="Gumdrop Studio" width="300">
</p>

# 🍬 Gumdrop Studio 🍭

**An easy to use pixel art creation app**

[![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-06b6d4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Tauri](https://img.shields.io/badge/Tauri-2.x-ffc131?style=flat&logo=tauri)](https://tauri.app/)
[![npm](https://img.shields.io/badge/npm-@pinkpixel%2Fgumdrop--studio-cb3837?style=flat&logo=npm)](https://www.npmjs.com/package/@pinkpixel/gumdrop-studio)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

_Create adorable pixel art with a unique dual-layer canvas system!_

[🌐 Web App](https://gumdropstudio.app) • [📚 Docs](https://docs.gumdropstudio.app) • [⬇️ Download](#-download) • [Features](#-features) • [Getting Started](#-getting-started) • [Desktop App](#%EF%B8%8F-desktop-app-tauri) • [Usage](#-usage) • [Export](#-export-options)

</div>

---

## ⬇️ Download

### 🌐 Web App (No Install)

Use Gumdrop Studio instantly in your browser — no download required:

**➡️ [gumdropstudio.app](https://gumdropstudio.app)**

### 📦 npm (CLI / Embed)

```bash
npm i -g @pinkpixel/gumdrop-studio@latest
```

### 🖥️ Desktop Installers (Linux)

Download the latest release from [GitHub Releases](https://github.com/pinkpixel-dev/gumdrop-studio/releases/latest):

| Package                                                                                                                         | Description                         | Size    |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------- |
| [**AppImage** 📦](https://github.com/pinkpixel-dev/gumdrop-studio/releases/download/v1.1.0/Gumdrop.Studio_1.1.0_amd64.AppImage) | Portable — runs on any Linux distro | ~108 MB |
| [**.deb** 📥](https://github.com/pinkpixel-dev/gumdrop-studio/releases/download/v1.1.0/Gumdrop.Studio_1.1.0_amd64.deb)          | Debian / Ubuntu installer           | ~8.5 MB |

```bash
# AppImage — make executable and run
chmod +x "Gumdrop Studio_1.1.0_amd64.AppImage"
./"Gumdrop Studio_1.1.0_amd64.AppImage"

# .deb — install system-wide
sudo dpkg -i "Gumdrop Studio_1.1.0_amd64.deb"
```

---

## ✨ Features

### 🎨 Dual-Layer Canvas System

The **best feature** of Gumdrop Studio! Draw blocky pixel art on one layer, then add fine details like whiskers, smiles, or highlights on a smooth vector overlay layer.

- **Pixel Layer**: Crisp, blocky RGBA pixel array (perfect for sprites)
- **Overlay Layer**: Anti-aliased vector paths for thin accent lines (1-6px)

### 🛠️ Drawing Tools

| Tool               | Description                                      |
| ------------------ | ------------------------------------------------ |
| ⬛ **Pixel Stamp** | Place a single pixel with live preview (default) |
| 🖊️ **Pencil**      | Freehand pixel drawing                           |
| 🧽 **Eraser**      | Remove pixels                                    |
| 📏 **Line**        | Straight lines with Bresenham algorithm          |
| ▭ **Rectangle**    | Outline or filled boxes                          |
| ◯ **Circle**       | Perfect circles with midpoint algorithm          |
| ☾ **Curve**        | Smooth quadratic Bezier curves (3-click)         |
| ✨ **Accent Pen**  | Thin vector lines for fine details               |

### 🌈 Advanced Color System

- **HSV Color Wheel**: Circular picker for intuitive color selection
- **Alpha Channel**: Full transparency support (0.0–1.0)
- **Hex Input**: Direct color code entry
- **Color Persistence**: Colors maintained across sessions

### 🔧 Canvas Features

- **Adjustable Zoom**: 4x to 40x magnification (default 16x)
- **Grid Overlay**: Toggle-able pixel grid for precise alignment
- **Flexible Sizes**: Create canvases from 4×4 to 256×256 pixels
- **Theme-Aware Grid**: Grid lines automatically adjust for visibility in light and dark mode
- **Softer Light Theme**: Warm cream gradient replaces bright white to reduce glare
- **Undo/Redo**: Full history management with unlimited steps

### 💾 Project Management

- **Save/Load**: Projects stored in browser localStorage
- **Auto-Save**: Automatic persistence with project list
- **Quick Actions**: New project, duplicate, delete

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**

> **For the desktop app (Tauri):** also requires Rust. See [Desktop App](#-desktop-app-tauri) below.

### Installation

```bash
# Clone the repository (or download)
git clone https://github.com/pinkpixel-dev/gumdrop-studio
cd gumdrop-studio

# Install dependencies
npm install
```

### Development (Browser)

```bash
npm run dev
```

🎉 Opens automatically at **http://localhost:1234**

### Build for Production

```bash
npm run build
```

Outputs optimized bundle to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 🖥️ Desktop App (Tauri)

Gumdrop Studio ships as a full **native desktop app** powered by [Tauri 2](https://tauri.app/). The desktop build adds:

- **Native window** with full app menu (File, Edit, View, Help)
- **Keyboard shortcuts** wired through the OS menu (Ctrl+N, Ctrl+S, Ctrl+Z, etc.)
- **AppImage & .deb installers** for Linux
- **File system & dialog access** via Tauri plugins

### Desktop Prerequisites

Install Rust:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

On Linux, also install the required system libraries:

```bash
# Arch Linux
sudo pacman -S webkit2gtk-4.1 libappindicator-gtk3 librsvg

# Ubuntu / Debian
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

### Run Desktop Dev Build

```bash
npm run tauri:dev
```

### Build Desktop Installers

```bash
npm run tauri:build
```

Builds both an **AppImage** and a **.deb** package to:

```
src-tauri/target/release/bundle/
  appimage/  Gumdrop Studio_1.1.0_amd64.AppImage
  deb/       Gumdrop Studio_1.1.0_amd64.deb
```

- **AppImage** — portable, runs on any Linux without installing. Just `chmod +x` and run.
- **.deb** — install with `sudo dpkg -i "Gumdrop Studio_1.1.0_amd64.deb"`

---

## 🎯 Usage

1. **Select a tool** from the left panel (Pixel Stamp is selected by default, switch to Pencil, Line, Circle, etc. as needed)
2. **Choose a color** using the color wheel or hex input
3. **Draw on the canvas** with mouse or touch
4. **Use Accent Pen** for fine details like whiskers or highlights
5. **Undo/Redo** as needed with history buttons
6. **Save your project** with the Save button
7. **Export** in your preferred format when done!

### 🎨 Pro Tips

- **Curve Tool**: Click 3 times (start → control point → end)
- **Fill Toggle**: Enable for filled rectangles
- **Grid Overlay**: Helpful for precise pixel placement
- **Accent Pen**: Use 1-2px width for whiskers, 3-4px for thicker accents
- **Zoom**: Increase for fine detail work, decrease for overview

---

## 📤 Export Options

| Format      | Description                          | Use Case                     |
| ----------- | ------------------------------------ | ---------------------------- |
| **PNG** 🖼️  | Transparent or opaque background     | Web graphics, game sprites   |
| **JPG** 📷  | Opaque background, smaller file size | Backgrounds, photos          |
| **SVG** 🎨  | Vector format (scalable)             | Logos, scalable graphics     |
| **JSON** 📦 | Complete state data                  | Backup, sharing, re-editing  |
| **HTML** 🌐 | Self-contained renderer              | Embeddable demos, portfolios |

---

## 🏗️ Project Structure

```
gumdrop-studio/
├── public/
│   ├── favicon.png         # 🧁 Favicon
│   ├── logo.png            # Brand logo
│   ├── _redirects          # Cloudflare Pages SPA routing
│   └── _routes.json        # Cloudflare routing config
├── src/
│   ├── components/
│   │   ├── Canvas.jsx      # Dual-canvas rendering
│   │   ├── ColorWheel.jsx  # HSV color picker
│   │   ├── Footer.jsx      # Footer component
│   │   ├── Header.jsx      # Header with theme toggle
│   │   ├── ProjectPanel.jsx # Save/load/export UI
│   │   └── ToolPanel.jsx   # Tool selection + controls
│   ├── utils/
│   │   ├── canvas.js       # Canvas rendering helpers
│   │   ├── colors.js       # Color conversions
│   │   ├── desktop.js      # Tauri menu event listeners
│   │   ├── helpers.js      # Generic utilities
│   │   ├── rasterizers.js  # Shape algorithms
│   │   └── storage.js      # Project persistence (localStorage + Tauri store)
│   ├── App.jsx             # Main app logic
│   ├── index.css           # Global styles
│   └── main.jsx            # React entry
├── src-tauri/
│   ├── src/main.rs         # Tauri app + native menu
│   ├── Cargo.toml          # Rust dependencies
│   ├── tauri.conf.json     # Tauri window + bundle config
│   └── icons/              # App icons (PNG, ICO, ICNS)
├── OVERVIEW.md             # Comprehensive docs
├── CHANGELOG.md            # Version history
├── SETUP.md                # Quick setup guide
├── LICENSE                 # Apache 2.0
├── wrangler.toml           # Cloudflare Pages config
└── package.json
```

---

## 🛠️ Tech Stack

- **React 19.2.4** - Modern UI framework with latest features
- **Vite 7.3.1** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.18** - Utility-first styling with latest improvements
- **Tauri 2.x** - Native desktop app framework (Rust-powered)
- **Canvas API** - Native HTML5 rendering (pixel-perfect + anti-aliased)
- **Wrangler 4.65.0** - Cloudflare Pages deployment tool

_All dependencies are **latest stable versions** as of March 2026._

---

## 📚 Documentation

- **[docs.gumdropstudio.app](https://docs.gumdropstudio.app)** - Full online documentation
- **[OVERVIEW.md](OVERVIEW.md)** - Comprehensive technical documentation
- **[SETUP.md](SETUP.md)** - Quick setup guide
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and updates
- **README.md** (this file) - Quick start guide

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests
- 📖 Improve documentation

Please ensure code follows existing patterns and conventions.

---

## 📄 License

**Apache License 2.0** - See [LICENSE](LICENSE) for details.

Copyright © 2026 Pink Pixel

---

## 💗 Credits

**Created by [Pink Pixel](https://pinkpixel.dev)**

- 🌐 Website: [pinkpixel.dev](https://pinkpixel.dev)
- 💻 GitHub: [@pinkpixel-dev](https://github.com/pinkpixel-dev)
- ☕ Support: [Buy me a coffee](https://www.buymeacoffee.com/pinkpixel)
- 📧 Contact: admin@pinkpixel.dev

---

<div align="center">

### ✨ Dream it, Pixel it ✨

_Made with 💗 by Pink Pixel_

**Now go draw some pixelated kittens!** 🐱

</div>
