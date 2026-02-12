# DEVELOPMENT

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Gumdrop Studio is a React-based pixel art creation app featuring a dual-layer canvas system (pixel layer + vector overlay layer) with various drawing tools, export capabilities, and project management.

## Common Commands

### Development
```bash
npm run dev          # Start dev server at http://localhost:1234 (auto-opens)
npm run build        # Build production bundle to dist/
npm run preview      # Preview production build
```

### Installation
```bash
npm install          # Install dependencies
```

## Architecture & Key Concepts

### Dual-Layer Rendering System
The app maintains **two separate canvas layers**:

1. **Pixel Layer** (`pixels` state): A 2D array representing blocky pixel art
   - Format: `pixels[y][x] = { r, g, b, a } | null`
   - Rendered via `renderPixelsToCanvas()` in `utils/canvas.js`
   - Scales up without smoothing for crisp pixel art

2. **Overlay Layer** (`overlayPaths` state): Vector paths for thin accents
   - Format: Array of `{ id, points: [{x, y}, ...], color, width }`
   - Drawn using Canvas API strokes with round caps/joins
   - Used for fine details like whiskers, smiles, highlights

### State Management Pattern
All state lives in `App.jsx` with immutable updates:
- **History/Undo**: Deep copies of pixel + overlay state stored in `history` array with separate `future` array for redo
- **Tool state**: Current tool, color (hex), alpha, drawing flags
- **Theme state**: Dark/light mode preference stored in state
- **Transient preview**: `tempPreview` shows shape outline before committing
- **Auto-fit scale**: `renderScale` automatically adjusts to fit viewport while preserving user's `scale` preference
- **Project data**: Stored in `localStorage` with namespace `gumdrop:projects`

### Coordinate System
- Grid coordinates: Integer pixel positions `(x, y)` from `(0, 0)` to `(gridW-1, gridH-1)`
- Screen coordinates: Converted via `getGridPos(e)` using canvas bounding rect
- Display scale: Grid units multiplied by `scale` factor (4x-40x zoom)

### Drawing Flow
1. **PointerDown**: Captures start position, pushes history, begins drawing
2. **PointerMove**: Updates `tempPreview` for shapes or directly modifies state for freehand
3. **PointerUp**: Commits final shape, clears preview, resets drag state

### Rasterization
All shapes are converted to discrete `[x, y]` coordinate arrays before pixel application:
- **Line**: Bresenham's algorithm (`rasterLine`)
- **Circle**: Midpoint circle algorithm (`rasterCircle`)
- **Rectangle**: Outline or filled variants (`rasterRect`, `fillRect`)
- **Quadratic Curve**: 200-step Bezier sampling (`rasterQuad`)

Functions in `utils/rasterizers.js` return arrays of `[x, y]` pairs, validated by `toInt()`.

### Tool Specifics

#### Curve Tool (3-click Bezier)
State progression in `curveTemps`:
1. First click: Store start point
2. Second click: Store control point, show line preview
3. Third click: Apply quadratic curve, reset state

#### Accent Pen (Overlay Layer)
Creates vector paths instead of modifying pixels:
- Each stroke is a new path object with `id`, `points`, `color`, `width`
- Rendered in separate overlay canvas with anti-aliasing enabled
- Useful for details that need smooth, thin lines (1-3px width)

### Export System
Multiple format support in `App.jsx`:
- **PNG/JPG**: Converts pixel array to ImageData, creates temp canvas
- **SVG**: Serializes pixels as `<rect>` elements + paths as `<polyline>`
- **JSON**: Saves complete state (pixels, overlay, metadata)
- **HTML Snippet**: Self-contained canvas rendering code

### Color Management
Color utilities in `utils/colors.js`:
- **Hex ↔ RGBA**: Bidirectional conversion with alpha support
- **HSV → RGB**: Color wheel rendering (`drawColorWheel`)
- **Color picker**: Circular HSV picker with saturation as distance from center

### Project Persistence
LocalStorage schema:
```javascript
{
  id: string,           // Unique project ID
  name: string,         // Display name
  gridW: number,        // Canvas width
  gridH: number,        // Canvas height
  pixels: Array[][],    // Pixel data
  overlayPaths: Array[] // Vector paths
}
```

Accessed via `listProjects()`, `saveProject()`, `loadProject()` in `App.jsx`.

## Code Conventions

### Component Structure
- **Functional components** with hooks throughout
- Props passed explicitly (no context providers)
- Canvas refs forwarded via `React.forwardRef`

### State Updates
Always use immutable patterns:
```javascript
// Correct
setPixels(prev => {
  const copy = deepCopyPixels(prev);
  copy[y][x] = newValue;
  return copy;
});

// Wrong - mutates state
pixels[y][x] = newValue;
setPixels(pixels);
```

### Utility Functions
Pure functions with defensive checks:
- Validate inputs with `toInt()`, `validXY()`
- Return empty arrays on invalid input (never throw)
- Use null-safe operators (`?.`, `??`) for optional chains

### Canvas Rendering
- Disable image smoothing for pixel layer: `ctx.imageSmoothingEnabled = false`
- Use OffscreenCanvas when available for better performance
- Clear before redraw: `ctx.clearRect(0, 0, w, h)`

## Key Files & Responsibilities

### `src/App.jsx`
- Main application state container
- Event handlers for all pointer interactions
- History management (undo/redo)
- Export/import logic

### `src/components/Canvas.jsx`
- Dual-canvas rendering (pixels + overlay)
- Grid overlay rendering
- Temp preview visualization
- Pointer event delegation

### `src/components/ToolPanel.jsx`
- Tool selection UI
- Color picker integration
- Zoom/grid controls

### `src/components/Header.jsx`
- App branding and logo display
- Dark/light mode toggle button
- Theme-aware styling

### `src/components/Footer.jsx`
- Pink Pixel branding footer
- Attribution text

### `src/components/ColorWheel.jsx`
- HSV color picker component
- Click-to-select color interaction

### `src/components/ProjectPanel.jsx`
- Save/load project interface
- Project list management
- Canvas size configuration

### `src/utils/rasterizers.js`
- Shape-to-pixel algorithms
- Returns coordinate arrays for all shapes

### `src/utils/canvas.js`
- Low-level canvas rendering helpers
- Grid and path drawing functions

### `src/utils/colors.js`
- Color space conversions
- Color wheel rendering

### `src/utils/helpers.js`
- Generic utilities (clamp, uid, validation)
- Deep copy functions for state

## Development Notes

### Adding New Tools
1. Add tool definition to `tools` array in `App.jsx`
2. Handle in `handlePointerDown/Move/Up` switch statements
3. If needed, create rasterization function in `utils/rasterizers.js`
4. Update temp preview logic in `Canvas.jsx` if shape uses preview

### Performance Considerations
- Pixel operations are O(n) where n = gridW × gridH
- Deep copying entire pixel array on every draw is acceptable for small canvases (≤128×128)
- For larger canvases, consider dirty rectangle tracking
- Overlay paths are rendered independently—no pixel overhead

### Canvas Size Limits
- Practical limit: ~256×256 pixels before performance degrades
- Browser canvas size limit: Usually 32767×32767 px, but performance varies
- Scale multiplier affects only display, not memory usage
- Default canvas: 40×40 pixels at 40x scale (auto-fits to viewport)
- Auto-fit scale: Canvas automatically scales down to fit available viewport space

### Browser Compatibility
- Requires ES2015+ features (arrow functions, destructuring)
- OffscreenCanvas used where available (fallback to createElement)
- localStorage required for project persistence

## Styling & UI

- **Tailwind CSS 4.x** for all styling
- Custom config uses default theme with Vite's port set to 1234
- **Dark/Light Mode**: User-selectable theme with smooth transitions
- **Theme-aware colors**: Grid, backgrounds, and UI adapt to selected theme
- **Light theme**: Warm cream gradient (`#f6f1e5` to `#f1ebe0`) reduces glare
- **Dark theme**: Slate gradient (`slate-900` to `slate-800`) for comfortable viewing
- Emoji used extensively in button labels for visual clarity
- Glassmorphism with backdrop-blur effects
- Rounded corners and shadows for modern aesthetic

---

Made with 💗 by Pink Pixel
