---
title: Canvas & Zoom
description: Understanding the dual-layer canvas, grid overlay, zoom controls, and canvas sizes.
---

## The Dual-Layer Canvas

Gumdrop Studio uses two stacked canvas layers rendered on top of each other:

| Layer             | What's stored                                      | Rendering style                                   |
| ----------------- | -------------------------------------------------- | ------------------------------------------------- |
| **Pixel Layer**   | 2D array of RGBA values (`pixels[y][x]`)           | Crisp, no smoothing — every cell is a sharp block |
| **Overlay Layer** | Array of vector paths (`{ points, color, width }`) | Anti-aliased — smooth at all zoom levels          |

The overlay is always positioned exactly on top of the pixel canvas. When you **export**, both layers are composited together into the final image.

This separation is what makes Gumdrop Studio unique: you get the authentic snappy look of pixel art from the pixel layer, while the overlay lets you add details that would look terrible if pixelated — whiskers, thin curves, highlights, text.

---

## Canvas Sizes

Set the canvas width and height in the **Project Panel** when creating a new project. You can't resize a canvas after starting — plan ahead!

| Size      | Common use                         |
| --------- | ---------------------------------- |
| 8×8       | Tiny icons, favicons               |
| 16×16     | Small UI icons                     |
| 32×32     | Classic game sprites               |
| **40×40** | **Default — good general purpose** |
| 64×64     | Character sprites, detailed art    |
| 128×128   | Detailed scenes, tilesets          |
| 256×256   | Large detailed artwork             |

:::note[Performance]
Deep-copying the pixel array (used for undo/redo) is O(n) where n = width × height. Canvases up to 128×128 are fast on any hardware. 256×256 may be slightly slower on older machines.
:::

---

## Zoom

Use the **zoom slider** in the Tool Panel to adjust magnification from **4x to 40x**.

- The canvas auto-fits to your viewport when the app loads
- Zoom in for precise single-pixel editing
- Zoom out for an overview of your full composition

**On the desktop app**, use keyboard shortcuts:

- `+` — Zoom in
- `-` — Zoom out

---

## Grid Overlay

The pixel grid helps you see cell boundaries and align pixels with precision.

- Click the **grid icon** in the Tool Panel to toggle it on/off
- On desktop: `Ctrl+G`
- The grid color automatically adjusts for dark and light themes for consistent visibility

:::tip
The grid is display-only — it never appears in exported images.
:::
