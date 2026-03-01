# Gumdrop Studio — GitHub Copilot Instructions

Gumdrop Studio is a React 19 pixel art creation app with a dual-layer canvas system (pixel + vector overlay). It ships both as a browser app (Cloudflare Pages) and a native desktop app (Tauri 2 / Linux AppImage + .deb).

---

## Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:1234 (auto-opens browser)
npm run build        # Production bundle → dist/
npm run preview      # Preview production build locally

# Desktop (Tauri — requires Rust + webkit2gtk-4.1)
npm run tauri:dev    # Launch Tauri desktop window with hot reload
npm run tauri:build  # Build AppImage + .deb → src-tauri/target/release/bundle/

# Deploy (Cloudflare Pages)
npm run deploy              # Preview deployment
npm run deploy:production   # Production deployment
```

No test runner is configured. Verify changes manually with `npm run dev`.

---

## Architecture

### Dual-Layer Canvas

Two overlapping `<canvas>` elements rendered in `Canvas.jsx`:

1. **Pixel layer** — 2D array `pixels[y][x] = { r, g, b, a } | null`
   - Rendered to `ImageData` via `renderPixelsToCanvas()` in `utils/canvas.js`
   - `imageSmoothingEnabled = false` — never enable smoothing here
2. **Overlay layer** — vector paths `[{ id, points:[{x,y}], color, width }]`
   - Anti-aliased Canvas2D strokes; round caps/joins
   - Used for Accent Pen fine details (whiskers, highlights)

### State lives in `App.jsx` only

No context providers. All state is passed as explicit props. Key state:

```js
pixels: Array[][]        // pixel data
overlayPaths: Array[]    // vector paths
history / future         // undo/redo stacks (deep copies)
tool / color / alpha     // drawing controls
tempPreview              // shape preview before commit
curveTemps               // 3-click Bezier state
renderScale              // auto-fit scale (read-only, derived)
scale                    // user zoom preference (4–40, default 40)
darkMode                 // theme toggle
```

### Drawing flow

```
PointerDown  → push history snapshot → begin stroke
PointerMove  → update tempPreview (shapes) OR apply pixels (freehand)
PointerUp    → commit final shape → clear preview / reset drag ref
```

Pointer tracking uses `useRef` (`dragStartRef`) — **do not switch to useState** for drag state; this avoids stale closure issues.

### Rasterizers (`utils/rasterizers.js`)

All shapes return `[x, y][]` coordinate arrays before pixel application:

- `rasterLine` — Bresenham's algorithm
- `rasterCircle` — midpoint circle algorithm
- `rasterRect` / `fillRect` — outline or filled
- `rasterQuad` — 200-step quadratic Bezier

Always validate coords with `toInt()` and `validXY()` before writing pixels.

### Coordinate systems

- **Grid coords**: integers `(0,0)` → `(gridW-1, gridH-1)`
- **Screen → grid**: `getGridPos(e)` via `getBoundingClientRect()`
- **Display scale**: `renderScale` auto-fits to viewport; `scale` is user preference

---

## Conventions

### Immutable state updates — always deep-copy pixels

```js
// ✅ Correct
setPixels((prev) => {
  const copy = deepCopyPixels(prev);
  copy[y][x] = { r, g, b, a };
  return copy;
});

// ❌ Wrong — mutates state in place
pixels[y][x] = { r, g, b, a };
setPixels(pixels);
```

### Component patterns

- Functional components with hooks throughout
- `Canvas.jsx` uses `React.forwardRef` — maintain that pattern for canvas refs
- No external state management libs (no Redux, Zustand, etc.)

### Tauri / browser compatibility

`utils/desktop.js` provides no-op stubs for browser. Always guard Tauri APIs:

```js
if (typeof window !== "undefined" && window.__TAURI_INTERNALS__) {
  // Tauri-specific code
}
```

### Adding new tools

1. Add `{ id, label }` entry to `tools` array in `App.jsx`
2. Handle `tool === 'yourTool'` in `handlePointerDown/Move/Up`
3. Add rasterization logic to `utils/rasterizers.js` if needed
4. Display controls in `ToolPanel.jsx`

### Export formats

Export logic lives in `App.jsx`. All exports share `buildFlatCanvas()` which merges pixel + overlay layers into a single canvas for PNG/JPG output.

---

## Key Files

| File                              | Responsibility                                           |
| --------------------------------- | -------------------------------------------------------- |
| `src/App.jsx`                     | All state, event handlers, history, export/import        |
| `src/components/Canvas.jsx`       | Dual-canvas rendering + pointer events                   |
| `src/components/ToolPanel.jsx`    | Tool selection, color wheel, zoom/grid controls          |
| `src/components/ProjectPanel.jsx` | Save/load/export UI                                      |
| `src/components/ColorWheel.jsx`   | HSV circular color picker                                |
| `src/utils/rasterizers.js`        | Shape-to-pixel algorithms                                |
| `src/utils/canvas.js`             | Canvas rendering helpers                                 |
| `src/utils/colors.js`             | Hex ↔ RGBA ↔ HSV conversions                             |
| `src/utils/helpers.js`            | `makeEmpty`, `deepCopyPixels`, `uid`, `clamp`, `validXY` |
| `src/utils/storage.js`            | LocalStorage + Tauri store persistence                   |
| `src/utils/desktop.js`            | Tauri menu event bridge (no-ops in browser)              |
| `src-tauri/src/main.rs`           | Tauri entry point + native app menu                      |

---

## Pitfalls

- **Never enable `imageSmoothingEnabled`** on the pixel canvas — it blurs pixel art
- **Always deep-copy** `pixels` before mutation — shallow copies cause undo bugs
- **`renderScale` is derived, not set directly** — it auto-computes to fit viewport
- **Curve tool needs 3 clicks** — `curveTemps` must reach length 2 before committing
- **Tauri `NO_STRIP=YES`** is required in `tauri:build` to avoid AppImage bundling failures on modern Linux (linuxdeploy strip incompatibility)
- **Port 1234** — Vite dev server is hardcoded to 1234 (not 5173)
- **LocalStorage namespace**: `gumdrop:projects` — don't change without migrating existing data

---

## Branding & Style

- **Owner**: Pink Pixel — pinkpixel.dev / @pinkpixel-dev
- **Default color**: `#ff66cc`
- **UI style**: Glassmorphism — `backdrop-blur`, `ring-white/10`, `rounded-xl`
- **Theme**: Pink/purple/indigo gradients; emoji-driven labels
- **Signature**: "Made with 💗 by Pink Pixel"
- Tailwind CSS 4 utility-first — no custom CSS unless necessary
