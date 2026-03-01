# 🧁 Gumdrop Studio — Project Overview

**Last Updated:** March 1, 2026  
**Version:** 1.1.0  
**Status:** Production Ready ✨  
**Web App:** [gumdropstudio.app](https://gumdropstudio.app)  
**Docs:** [docs.gumdropstudio.app](https://docs.gumdropstudio.app)  
**npm:** [`@pinkpixel/gumdrop-studio`](https://www.npmjs.com/package/@pinkpixel/gumdrop-studio)  
**Releases:** [GitHub Releases](https://github.com/pinkpixel-dev/gumdrop-studio/releases/latest)  
**Deployment:** Cloudflare Pages (browser) + Tauri 2 (desktop)

---

## 📋 Project Summary

**Gumdrop Studio** is a modern, browser-based pixel art creation app built with React 19. It features a unique **dual-layer canvas system** that combines blocky pixel art with smooth vector overlay accents—perfect for creating cute pixelated characters, pets, icons, and more!

The app offers a complete set of drawing tools, flexible export options, and project management capabilities, all wrapped in a delightful Pink Pixel-branded UI with glassmorphism aesthetics and emoji-driven UX.

---

## 🎯 Core Purpose

Create adorable pixel art with ease! Gumdrop Studio is designed for:

- **Digital artists** who want a quick, browser-based pixel art tool
- **Game developers** needing sprite creation and editing
- **Hobbyists** looking to make cute pixel pets, icons, or avatars
- **Educators** teaching pixel art fundamentals

The dual-layer system is the killer feature: draw blocky pixel art on one layer, then add fine details like whiskers, smiles, or highlights on a smooth vector overlay layer.

---

## 🏗️ Architecture

### Tech Stack

| Technology               | Version | Purpose                      |
| ------------------------ | ------- | ---------------------------- |
| **React**                | 19.2.4  | UI framework                 |
| **Vite**                 | 7.3.1   | Build tool & dev server      |
| **Tailwind CSS**         | 4.1.18  | Styling framework            |
| **@tailwindcss/postcss** | 4.1.18  | PostCSS plugin               |
| **Tauri**                | 2.x     | Native desktop app framework |
| **Rust**                 | stable  | Tauri backend language       |
| **Autoprefixer**         | 10.4.24 | CSS vendor prefixing         |

All dependencies are **latest stable versions** as of March 2026.

### Project Structure

```
gumdrop-studio/
├── public/
│   ├── favicon.png         # 🧁 Favicon
│   ├── logo.png            # Brand logo
│   ├── _redirects          # Cloudflare Pages SPA routing
│   └── _routes.json        # Cloudflare routing config
├── src/
│   ├── components/
│   │   ├── Canvas.jsx      # Dual-canvas rendering + pointer events
│   │   ├── ColorWheel.jsx  # HSV color picker
│   │   ├── Footer.jsx      # Footer component
│   │   ├── Header.jsx      # Header with theme toggle
│   │   ├── ProjectPanel.jsx # Save/load/export UI
│   │   └── ToolPanel.jsx   # Tool selection + color controls
│   ├── utils/
│   │   ├── canvas.js       # Canvas rendering helpers
│   │   ├── colors.js       # Color space conversions
│   │   ├── desktop.js      # Tauri menu event listeners (noop in browser)
│   │   ├── helpers.js      # Generic utilities
│   │   ├── rasterizers.js  # Shape-to-pixel algorithms
│   │   └── storage.js      # Project persistence (localStorage / Tauri store)
│   ├── App.jsx             # Main app state + logic
│   ├── index.css           # Global styles
│   └── main.jsx            # React entry point
├── src-tauri/
│   ├── src/main.rs         # Tauri entry point + native menu
│   ├── Cargo.toml          # Rust dependencies
│   ├── tauri.conf.json     # Window size, bundle, permissions
│   └── icons/              # App icons (PNG, ICO, ICNS)
├── index.html              # Vite entry HTML
├── package.json            # Dependencies + scripts
├── vite.config.js          # Vite config (port 1234)
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
├── wrangler.toml           # Cloudflare Pages config
└── README.md
```

---

## 🎨 Key Features

### Drawing Tools

| Tool               | Description                                   | Implementation                                  |
| ------------------ | --------------------------------------------- | ----------------------------------------------- |
| **Pixel Stamp** ⬛ | Precise single-pixel placement (default tool) | Uses shape preview flow for single cell commits |
| **Pencil** 🖊️      | Freehand pixel drawing                        | Direct pixel modification                       |
| **Eraser** 🧽      | Remove pixels                                 | Sets pixels to `null`                           |
| **Line** 📏        | Straight lines                                | Bresenham's algorithm                           |
| **Rectangle** ▭    | Outline or filled boxes                       | Rasterization with fill toggle                  |
| **Circle** ◯       | Perfect circles                               | Midpoint circle algorithm                       |
| **Curve** ☾        | Smooth Bezier curves                          | 3-click quadratic Bezier (200 steps)            |
| **Accent Pen** ✨  | Thin vector lines                             | Overlay layer with anti-aliasing                |

### Color System

- **HSV Color Wheel:** Circular picker for hue + saturation
- **Alpha Channel:** Full transparency support (0.0–1.0)
- **Hex Input:** Direct color code entry
- **RGBA Export:** All export formats support transparency

### Canvas Features

- **Adjustable Zoom:** 4x to 40x scale (default 40x, auto-fits to viewport)
- **Grid Overlay:** Toggle-able pixel grid
- **Theme-Aware Grid:** Grid stroke color adapts to light/dark palettes for consistent visibility
- **Softer Light Theme:** Warm cream gradient tones reduce glare and keep panels legible
- **Dark/Light Mode Toggle:** User-selectable theme in header
- **Dual Layers:**
  - **Pixel Layer:** 2D array of RGBA values (blocky, crisp edges)
  - **Overlay Layer:** Vector paths for smooth thin lines (1-6px width)
- **Canvas Sizes:** 4×4 to 256×256 pixels (default 40×40)

### Project Management

- **Save/Load:** Projects stored in browser localStorage
- **Auto-Save:** Updates to `gumdrop:projects` namespace
- **Project List:** Browse and manage saved projects
- **New Project:** Quick canvas reset

### Export Formats

| Format           | Description                                               | Use Case                 |
| ---------------- | --------------------------------------------------------- | ------------------------ |
| **PNG**          | Transparent or opaque background                          | Web graphics, sprites    |
| **JPG**          | Opaque background, smaller file size                      | Photos, backgrounds      |
| **SVG**          | Vector format (pixels as `<rect>`, paths as `<polyline>`) | Scalable graphics        |
| **JSON**         | Complete state data                                       | Backup, sharing, editing |
| **HTML Snippet** | Self-contained canvas renderer                            | Embeddable demos         |

### History System

- **Undo/Redo:** Full state snapshots (pixels + overlay)
- **Deep Copies:** Immutable state updates prevent bugs
- **Unlimited History:** Limited only by browser memory

---

## 🧠 Technical Implementation

### State Management

All state lives in **`App.jsx`** with immutable updates:

```javascript
// State structure
gridW: 40                    // Canvas width (default)
gridH: 40                    // Canvas height (default)
scale: 40                    // User's preferred zoom (default)
renderScale: number          // Auto-fitted scale for display
pixels: Array[][]            // pixels[y][x] = { r, g, b, a } | null
overlayPaths: Array[]        // [{ id, points: [{x,y}], color, width }]
history: Array[]             // [{ pixels, overlay }]
future: Array[]              // Redo stack [{ pixels, overlay }]
tool: string                 // Current tool ID (default: 'stamp')
color: string                // Hex color (default: '#ff66cc')
alpha: number                // Transparency 0-1 (default: 1)
accentWidth: number          // Accent pen width (default: 1)
showGrid: boolean            // Grid visibility (default: true)
fillShape: boolean           // Rectangle fill toggle (default: false)
darkMode: boolean            // Theme preference (default: true)
tempPreview: Array[]         // Shape preview coordinates
curveTemps: Array[]          // Curve tool state (3-click)
```

**Deep Copying Pattern:**

```javascript
setPixels((prev) => {
  const copy = deepCopyPixels(prev);
  copy[y][x] = newValue;
  return copy;
});
```

Pointer tracking for tools such as Pixel Stamp and Pencil relies on `useRef` (`dragStartRef`) so cursor updates don't wait for React renders, eliminating streak artifacts when switching cells quickly.

### Rendering System

**Dual-Canvas Architecture:**

1. **Pixel Canvas:**
   - Renders pixel array to `ImageData`
   - `imageSmoothingEnabled = false` for crisp edges
   - Scales up using CSS transform (no blur)

2. **Overlay Canvas:**
   - Renders vector paths with `Canvas2D` API
   - `imageSmoothingEnabled = true` for anti-aliasing
   - Positioned absolutely on top of pixel canvas

**Drawing Flow:**

```
PointerDown → Push history → Begin drawing
PointerMove → Update tempPreview (shapes) or apply pixels (freehand)
PointerUp   → Commit final shape → Clear preview
```

### Rasterization Algorithms

All shapes convert to `[x, y]` coordinate arrays before applying:

- **Line:** Bresenham's line algorithm (`rasterLine`)
- **Circle:** Midpoint circle algorithm (`rasterCircle`)
- **Rectangle:** Outline via `rasterRect` or filled via `fillRect`
- **Curve:** 200-step parametric Bezier (`rasterQuad`)

Example from `rasterizers.js`:

```javascript
export function rasterLine(x0, y0, x1, y1) {
  const coords = [];
  // Bresenham's algorithm implementation
  // Returns array of [x, y] pairs
  return coords;
}
```

### Coordinate Systems

- **Grid Coordinates:** Integer positions `(x, y)` from `(0, 0)` to `(gridW-1, gridH-1)`
- **Screen Coordinates:** Converted via `getGridPos(e)` using `getBoundingClientRect()`
- **Display Scale:** Grid units × `renderScale` factor (auto-fits to viewport)
- **User Scale:** Separate `scale` state (4x-40x, default 40x) controlled by zoom slider
- **Auto-fit:** `renderScale` computed to fit canvas within viewport while respecting user's `scale` as maximum
- **Example:** 40×40 grid at 40x scale = 1600×1600px display (auto-scales down if viewport smaller)

### Color Management

**Utilities in `colors.js`:**

- `hexToRGBA(hex, alpha)` → `{ r, g, b, a }`
- `rgbaToHex({ r, g, b })` → `"#rrggbb"`
- `hsvToRgb(h, s, v)` → `{ r, g, b }`
- `drawColorWheel(canvas)` → Renders HSV picker

**Color Picker Algorithm:**

```javascript
// HSV picker: hue = angle, saturation = distance from center
const hue = (Math.atan2(dy, dx) / (2 * Math.PI) + 1) % 1;
const sat = distance / radius;
```

### Data Persistence

**LocalStorage Schema:**

```json
{
  "id": "abc123",
  "name": "My Pixel Pet",
  "updated": 1729800000000,
  "gridW": 32,
  "gridH": 32,
  "pixels": [[...]],
  "overlayPaths": [...]
}
```

**Namespace:** `gumdrop:projects`  
**Operations:** `listProjects()`, `saveProject()`, `loadProject()`, `deleteProject()`

---

## 🎨 UI/UX Design

### Design System

- **Color Palette:** Pink/purple/indigo gradients
- **Style:** Glassmorphism with `backdrop-blur`
- **Borders:** White with low opacity (`ring-white/10`)
- **Corners:** Rounded (`rounded-xl`, `rounded-2xl`)
- **Typography:** System UI sans-serif
- **Icons:** Emoji-based labels (🖊️, 🧽, 📏, etc.)

### Layout

**3-Column Responsive Grid:**

```
[ToolPanel] [Canvas] [ProjectPanel]
   300px      1fr        280px
```

On mobile/tablet: Stacks vertically

### Branding

- **Signature:** "Made with 💗 by Pink Pixel"
- **Tagline:** "Go draw some pixelated kittens!"
- **Color Theme:** Pink (`#ff66cc`) + Purple + Indigo

---

## 🚀 Usage

### Installation

```bash
npm install
```

### Development (Browser)

```bash
npm run dev
```

Opens at **http://localhost:1234** (auto-opens browser)

### Development (Desktop)

```bash
npm run tauri:dev
```

Launches the Tauri desktop window with hot reload.

### Build (Web)

```bash
npm run build
```

Output: `dist/` directory

### Build (Desktop Installers)

```bash
npm run tauri:build
```

Output: `src-tauri/target/release/bundle/`

- `appimage/` — portable AppImage
- `deb/` — Debian/Ubuntu package

### Preview Production Build

```bash
npm run preview
```

### Deploy to Cloudflare Pages

```bash
npm run deploy              # Deploy to preview
npm run deploy:production   # Deploy to production
```

Or deploy manually:

```bash
wrangler pages deploy dist
```

---

## 🔧 Configuration

### Vite Config (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 1234,
    open: true,
  },
});
```

### Tailwind Config (`tailwind.config.js`)

Uses default theme, scans:

- `./index.html`
- `./src/**/*.{js,ts,jsx,tsx}`

---

## 📚 Dependencies

### Core Dependencies

```json
{
  "@tauri-apps/api": "^2.10.1",
  "@tauri-apps/plugin-dialog": "^2.6.0",
  "@tauri-apps/plugin-fs": "^2.4.5",
  "@tauri-apps/plugin-shell": "^2.3.5",
  "@tauri-apps/plugin-store": "^2.4.2",
  "@tailwindcss/postcss": "^4.1.18",
  "react": "^19.2.4",
  "react-dom": "^19.2.4"
}
```

### Dev Dependencies

```json
{
  "@tauri-apps/cli": "^2.10.0",
  "@vitejs/plugin-react": "^5.1.4",
  "autoprefixer": "^10.4.24",
  "tailwindcss": "^4.1.18",
  "vite": "^7.3.1",
  "wrangler": "^4.65.0"
}
```

**All dependencies are latest stable versions** ✅

---

## 🧪 Performance Considerations

- **Canvas Size Limits:**
  - Practical limit: ~256×256 pixels
  - Deep copying pixel array is O(n) where n = gridW × gridH
  - Acceptable for small canvases (≤128×128)

- **Rendering Optimizations:**
  - OffscreenCanvas used when available
  - Clear before redraw (`clearRect`)
  - Image smoothing disabled for pixel layer

- **Memory:**
  - History limited only by browser memory
  - Each undo state stores complete pixel + overlay copy
  - Consider implementing dirty rectangle tracking for large canvases

---

## 🔒 Browser Compatibility

- **Requires:** ES2015+ features (arrow functions, destructuring)
- **LocalStorage:** Required for project persistence
- **Canvas API:** Required for rendering
- **OffscreenCanvas:** Optional (graceful fallback)

**Tested on:** Chrome, Firefox, Safari (modern versions)

---

## 📝 Code Conventions

### Component Structure

- **Functional components** with hooks throughout
- Props passed explicitly (no context providers)
- Canvas refs forwarded via `React.forwardRef`

### State Updates

Always immutable:

```javascript
// ✅ Correct
setPixels((prev) => {
  const copy = deepCopyPixels(prev);
  copy[y][x] = newValue;
  return copy;
});

// ❌ Wrong - mutates state
pixels[y][x] = newValue;
setPixels(pixels);
```

### Utility Functions

- Pure functions with defensive checks
- Validate inputs with `toInt()`, `validXY()`
- Return empty arrays on invalid input (never throw)
- Null-safe operators (`?.`, `??`)

---

## 🎯 Future Enhancement Ideas

- **More Tools:** Flood fill, spray paint, selection tools
- **Layers:** Multiple pixel layers with blend modes
- **Animation:** Frame-by-frame pixel animation
- **Palettes:** Save/load color palettes
- **Filters:** Blur, sharpen, color adjustments
- **Collaboration:** Real-time multi-user editing
- **Cloud Save:** Optional account + cloud storage

---

## 📄 License

**Apache 2.0** (see LICENSE file)

---

## 🔗 Links
- **Web App:** [gumdropstudio.app](https://gumdropstudio.app)
- **Docs:** [docs.gumdropstudio.app](https://docs.gumdropstudio.app)
- **Releases:** [github.com/pinkpixel-dev/gumdrop-studio/releases](https://github.com/pinkpixel-dev/gumdrop-studio/releases)
- **npm:** [npmjs.com/package/@pinkpixel/gumdrop-studio](https://www.npmjs.com/package/@pinkpixel/gumdrop-studio)- **Author:** Pink Pixel
- **Website:** [pinkpixel.dev](https://pinkpixel.dev)
- **GitHub:** [github.com/pinkpixel-dev](https://github.com/pinkpixel-dev)
- **Contact:** admin@pinkpixel.dev

---

Made with 💗 by Pink Pixel — Dream it, Pixel it ✨
