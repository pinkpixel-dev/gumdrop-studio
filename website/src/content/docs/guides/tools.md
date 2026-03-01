---
title: Drawing Tools
description: Reference for all 8 drawing tools in Gumdrop Studio.
---

Gumdrop Studio has 8 tools split across two canvas layers: the **Pixel Layer** (crisp, blocky art) and the **Overlay Layer** (smooth anti-aliased vector accents).

---

## Pixel Layer Tools

These tools draw on the main pixel canvas. Each pixel is a discrete RGBA cell on a grid.

### ⬛ Pixel Stamp

**The default tool.** Places a single pixel exactly at the cell you click.

- Single-click to place one pixel
- Shows a live preview before committing
- Best for precise, deliberate single-cell edits

### 🖊️ Pencil

Freehand pixel drawing — hold and drag to paint a trail of pixels.

- Draws continuously while you hold the mouse button
- Great for freehand outlines, fills, and free-form art
- Each pixel is placed at the nearest grid cell under the cursor

### 🧽 Eraser

Removes pixels from the canvas. Works identically to the Pencil but deletes instead of draws.

- Click or drag to erase one or more pixels
- Sets erased cells to transparent (`null`)
- Does **not** affect Overlay Layer paths

### 📏 Line

Draws a perfectly straight line between two points using **Bresenham's line algorithm** — giving crisp, pixel-perfect diagonal lines with no gaps.

- Click the start point, drag to the end, release to commit
- Shows a live preview while dragging
- Useful for grids, outlines, borders, and geometric art

### ▭ Rectangle

Draws a rectangular outline or solid filled box.

- Click and drag to define the rectangle
- Enable the **Fill** toggle in the Tool Panel before drawing to make it a filled rectangle
- Shows a live preview while dragging

### ◯ Circle

Draws a perfect circle using the **midpoint circle algorithm** — always pixel-symmetric, no gaps.

- Click the center point, then drag to set the radius
- Shows a live preview while dragging
- Produces clean, symmetric circles at any size

### ☾ Curve

Draws a smooth **quadratic Bezier curve** with three clicks.

1. **Click** the start point
2. **Click** the control point — the curve bends toward this point
3. **Click** the end point to commit

The curve uses 200 interpolation steps internally for smooth results, then converts to pixel coordinates.

:::tip
The control point acts like a magnet — place it off to the side to create a gentle arc, or further away for a sharper bend.
:::

---

## Overlay Layer Tools

The overlay layer sits on top of the pixel layer and renders **anti-aliased vector paths**. These lines are smooth at any zoom level because they're stored as path data, not pixels.

### ✨ Accent Pen

Draws smooth, anti-aliased strokes of 1–6px width.

- Set the **Accent Width** with the slider in the Tool Panel
- Click and drag to draw a continuous path
- Lines have **round caps and joins** for a polished, natural feel
- Rendered with Canvas 2D anti-aliasing for nice smooth edges

| Width | Best use case                                       |
| ----- | --------------------------------------------------- |
| 1–2px | Fine details (whiskers, eyelashes, thin highlights) |
| 3–4px | Medium accents (smiles, eye outlines, borders)      |
| 5–6px | Bold strokes, thick decorative lines                |

:::note
Overlay paths are independent of pixels. Undo and redo affect both layers separately. The Eraser tool does not remove overlay paths.
:::
