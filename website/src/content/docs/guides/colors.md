---
title: Colors & Alpha
description: How to use the HSV color wheel, hex input, and alpha transparency in Gumdrop Studio.
---

## The Color Wheel

The circular color picker in the Tool Panel uses the **HSV (Hue, Saturation, Value)** color model:

- **Hue**: The angle around the wheel (0°–360°) — this is the "base color" (red, orange, yellow, green, etc.)
- **Saturation**: The distance from the center — the center is white/desaturated, the edge is the purest version of the hue
- **Value/Brightness**: Controlled by the brightness slider beneath the wheel

**To pick a color:** Click anywhere on the wheel. The selected color appears in the preview swatch alongside the current hex code.

---

## Hex Input

For exact colors, type a hex code directly into the input field below the color wheel:

```
#ff66cc   ← hot pink
#7c3aed   ← purple
#22c55e   ← green
#000000   ← black
#ffffff   ← white
```

Press **Enter** or click away to apply the hex value. The color wheel will update to reflect your selection.

---

## Alpha (Transparency)

The **Alpha slider** controls the transparency of the color being applied:

| Alpha value | Effect                 |
| ----------- | ---------------------- |
| `1.0`       | Fully opaque (default) |
| `0.5`       | 50% transparent        |
| `0.0`       | Fully invisible        |

Alpha is stored **per pixel** — each cell in the pixel grid has its own RGBA value. This means you can mix fully opaque pixels, semi-transparent pixels, and transparent pixels freely in the same artwork.

:::tip
Use low alpha values (0.2–0.4) for soft shadows, glow effects, or blended transitions between colors.
:::

---

## Color Persistence

Your active color and alpha value are remembered for the duration of your session. If you switch tools, zoom in/out, or save/load a project, the active color stays selected.

Colors are **not** saved as a palette — only your currently active color is remembered. For workflow efficiency, use the hex input to quickly jump between frequently used colors.
