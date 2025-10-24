# 🧁 Gumdrop Studio — Project Overview

**Last Updated:** October 24, 2025 at 3:33 PM ET  
**Version:** 1.0.0  
**Status:** Production Ready ✨

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

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **Vite** | 7.1.12 | Build tool & dev server |
| **Tailwind CSS** | 4.1.16 | Styling framework |
| **@tailwindcss/postcss** | 4.1.16 | PostCSS plugin |
| **Autoprefixer** | 10.4.21 | CSS vendor prefixing |

All dependencies are **latest stable versions** as of October 2025.

### Project Structure

```
gumdrop-studio/
├── public/
│   ├── index.html          # HTML entry point
│   └── favicon.png         # 🧁 Favicon
├── src/
│   ├── assets/
│   │   ├── icon.png        # App icon
│   │   └── logo.png        # Brand logo
│   ├── components/
│   │   ├── Canvas.jsx      # Dual-canvas rendering + pointer events
│   │   ├── ColorWheel.jsx  # HSV color picker
│   │   ├── ProjectPanel.jsx # Save/load/export UI
│   │   └── ToolPanel.jsx   # Tool selection + color controls
│   ├── utils/
│   │   ├── canvas.js       # Canvas rendering helpers
│   │   ├── colors.js       # Color space conversions
│   │   ├── helpers.js      # Generic utilities
│   │   └── rasterizers.js  # Shape-to-pixel algorithms
│   ├── App.jsx             # Main app state + logic
│   ├── index.css           # Global styles
│   └── main.jsx            # React entry point
├── index.html              # Vite entry HTML
├── package.json
├── vite.config.js          # Vite config (port 1337)
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
└── README.md
```

---

## 🎨 Key Features

### Drawing Tools

| Tool | Description | Implementation |
|------|-------------|----------------|
| **Pencil** 🖊️ | Freehand pixel drawing | Direct pixel modification |
| **Eraser** 🧽 | Remove pixels | Sets pixels to `null` |
| **Line** 📏 | Straight lines | Bresenham's algorithm |
| **Rectangle** ▭ | Outline or filled boxes | Rasterization with fill toggle |
| **Circle** ◯ | Perfect circles | Midpoint circle algorithm |
| **Curve** ☾ | Smooth Bezier curves | 3-click quadratic Bezier (200 steps) |
| **Accent Pen** ✨ | Thin vector lines | Overlay layer with anti-aliasing |
| **Eyedropper** 🎯 | Pick colors from canvas | Direct pixel color read |

### Color System

- **HSV Color Wheel:** Circular picker for hue + saturation
- **Alpha Channel:** Full transparency support (0.0–1.0)
- **Hex Input:** Direct color code entry
- **RGBA Export:** All export formats support transparency

### Canvas Features

- **Adjustable Zoom:** 4x to 40x scale (default 16x)
- **Grid Overlay:** Toggle-able pixel grid
- **Dual Layers:**
  - **Pixel Layer:** 2D array of RGBA values (blocky, crisp edges)
  - **Overlay Layer:** Vector paths for smooth thin lines (1-6px width)
- **Canvas Sizes:** 4×4 to 256×256 pixels (default 32×32)

### Project Management

- **Save/Load:** Projects stored in browser localStorage
- **Auto-Save:** Updates to `gumdrop:projects` namespace
- **Project List:** Browse and manage saved projects
- **New Project:** Quick canvas reset

### Export Formats

| Format | Description | Use Case |
|--------|-------------|----------|
| **PNG** | Transparent or opaque background | Web graphics, sprites |
| **JPG** | Opaque background, smaller file size | Photos, backgrounds |
| **SVG** | Vector format (pixels as `<rect>`, paths as `<polyline>`) | Scalable graphics |
| **JSON** | Complete state data | Backup, sharing, editing |
| **HTML Snippet** | Self-contained canvas renderer | Embeddable demos |

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
pixels: Array[][]        // pixels[y][x] = { r, g, b, a } | null
overlayPaths: Array[]    // [{ id, points: [{x,y}], color, width }]
history: Array[]         // [{ pixels, overlay }]
future: Array[]          // Redo stack
```

**Deep Copying Pattern:**
```javascript
setPixels(prev => {
  const copy = deepCopyPixels(prev);
  copy[y][x] = newValue;
  return copy;
});
```

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
- **Display Scale:** Grid units × scale factor (e.g., 32×32 grid at 16x scale = 512×512px display)

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

### Development

```bash
npm run dev
```

Opens at **http://localhost:1337** (auto-opens browser)

### Build

```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build

```bash
npm run preview
```

---

## 🔧 Configuration

### Vite Config (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 1337,
    open: true
  }
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
  "@tailwindcss/postcss": "^4.1.16",
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

### Dev Dependencies

```json
{
  "@vitejs/plugin-react": "^5.1.0",
  "autoprefixer": "^10.4.21",
  "tailwindcss": "^4.1.16",
  "vite": "^7.1.12"
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
setPixels(prev => {
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

- **Author:** Pink Pixel
- **Website:** [pinkpixel.dev](https://pinkpixel.dev)
- **GitHub:** [github.com/pinkpixel-dev](https://github.com/pinkpixel-dev)
- **Contact:** admin@pinkpixel.dev

---

Made with 💗 by Pink Pixel — Dream it, Pixel it ✨
