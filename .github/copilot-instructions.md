# Copilot Instructions for Gumdrop Studio

## Project Overview

Gumdrop Studio is a React-based browser pixel art creation app featuring a **dual-layer canvas system**:

- **Pixel Layer**: Blocky RGBA pixel array for crisp pixel art
- **Overlay Layer**: Anti-aliased vector paths for thin accent lines (1-6px)

**Tech Stack**: React 19.2.0, Vite 7.1.12, Tailwind CSS 4.1.16

## Architecture & Key Concepts

### State Management

- All state lives in `App.jsx` with **immutable updates**
- Use deep copying for state changes: `setPixels(prev => { const copy = deepCopyPixels(prev); /* modify copy */ return copy; })`
- Never mutate state directly
- History/Undo uses separate `history` and `future` arrays storing complete state snapshots

### Dual-Layer System

1. **Pixel Layer** (`pixels` state): 2D array `pixels[y][x] = { r, g, b, a } | null`
   - Rendered via `renderPixelsToCanvas()` in `utils/canvas.js`
   - Disable image smoothing: `ctx.imageSmoothingEnabled = false`
2. **Overlay Layer** (`overlayPaths` state): Array of `{ id, points: [{x, y}], color, width }`
   - Rendered with Canvas API strokes with round caps/joins
   - Keep image smoothing enabled for anti-aliasing

### Coordinate Systems

- **Grid coordinates**: Integer positions `(x, y)` from `(0, 0)` to `(gridW-1, gridH-1)`
- **Screen coordinates**: Convert via `getGridPos(e)` using `getBoundingClientRect()`
- **Display scale**: `renderScale` auto-fits canvas to viewport, `scale` is user preference (4x-40x)

### Drawing Flow

```
PointerDown → Push history → Begin drawing
PointerMove → Update tempPreview (shapes) or apply pixels (freehand)
PointerUp   → Commit final shape → Clear preview
```

## Code Conventions

### Component Structure

- Use **functional components** with hooks throughout
- Pass props explicitly (no context providers)
- Forward canvas refs via `React.forwardRef`

### State Updates Pattern

```javascript
// ✅ Correct - immutable update
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

- Write pure functions with defensive checks
- Validate inputs with `toInt()`, `validXY()` from `utils/helpers.js`
- Return empty arrays on invalid input (never throw exceptions)
- Use null-safe operators (`?.`, `??`) for optional chains

### Styling

- Use **Tailwind CSS 4.x** for all styling (utility-first approach)
- Follow existing glassmorphism patterns with `backdrop-blur`
- Use emoji in button labels for visual clarity
- Support dark/light mode with theme-aware colors
- Light theme uses warm cream gradient (`#f6f1e5` to `#f1ebe0`)
- Dark theme uses slate gradient (`slate-900` to `slate-800`)

### Canvas Rendering

- Always clear before redraw: `ctx.clearRect(0, 0, w, h)`
- Use OffscreenCanvas when available for better performance

## Development Workflow

### Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:1234 (auto-opens)
npm run build        # Build production bundle to dist/
npm run preview      # Preview production build
```

### Adding New Tools

1. Add tool definition to `tools` array in `App.jsx`
2. Handle in `handlePointerDown/Move/Up` switch statements
3. Create rasterization function in `utils/rasterizers.js` if needed
4. Update temp preview logic in `Canvas.jsx` for shapes using preview

### Rasterization

All shapes convert to `[x, y]` coordinate arrays in `utils/rasterizers.js`:

- **Line**: Bresenham's algorithm (`rasterLine`)
- **Circle**: Midpoint circle algorithm (`rasterCircle`)
- **Rectangle**: `rasterRect` (outline) or `fillRect` (filled)
- **Curve**: 200-step parametric Bezier (`rasterQuad`)

## File Structure & Responsibilities

- **`src/App.jsx`**: Main state container, event handlers, history, export logic
- **`src/components/Canvas.jsx`**: Dual-canvas rendering, grid overlay, pointer events
- **`src/components/ToolPanel.jsx`**: Tool selection UI, color picker, zoom/grid controls
- **`src/components/ColorWheel.jsx`**: HSV color picker with click-to-select
- **`src/components/ProjectPanel.jsx`**: Save/load/export interface
- **`src/components/Header.jsx`**: App branding, dark/light mode toggle
- **`src/components/Footer.jsx`**: Pink Pixel branding footer
- **`src/utils/rasterizers.js`**: Shape-to-pixel algorithms
- **`src/utils/canvas.js`**: Low-level canvas rendering helpers
- **`src/utils/colors.js`**: Color space conversions, color wheel rendering
- **`src/utils/helpers.js`**: Generic utilities, validation, deep copy

## Important Patterns

### Color Management

- Use utilities from `utils/colors.js`:
  - `hexToRGBA(hex, alpha)` → `{ r, g, b, a }`
  - `rgbaToHex({ r, g, b })` → `"#rrggbb"`
  - `hsvToRgb(h, s, v)` → `{ r, g, b }`

### Project Persistence

- LocalStorage namespace: `gumdrop:projects`
- Schema: `{ id, name, updated, gridW, gridH, pixels, overlayPaths }`
- Use `listProjects()`, `saveProject()`, `loadProject()`, `deleteProject()`

### Performance

- Pixel operations are O(n) where n = gridW × gridH
- Deep copying entire pixel array is acceptable for small canvases (≤128×128)
- Practical canvas limit: ~256×256 pixels
- Consider dirty rectangle tracking for larger canvases
- Overlay paths render independently—no pixel overhead

## Export Formats

- **PNG**: Transparent/opaque background for web graphics, sprites
- **JPG**: Opaque background, smaller file size for photos
- **SVG**: Pixels as `<rect>`, paths as `<polyline>` for scalable graphics
- **JSON**: Complete state data for backup/sharing/re-editing
- **HTML**: Self-contained canvas renderer for embeddable demos

## Testing & Quality

- Ensure all changes maintain immutable state patterns
- Test tool interactions with pointer events
- Verify canvas rendering for both pixel and overlay layers
- Test export functionality across all formats
- Validate color conversions and transparency handling
- Check dark/light mode appearance for all UI changes

## Branding

- **Signature**: "Made with 💗 by Pink Pixel"
- **Color theme**: Pink (`#ff66cc`) + Purple + Indigo
- **Tagline**: "Dream it, Pixel it ✨"
- Maintain friendly, delightful tone in UI text
