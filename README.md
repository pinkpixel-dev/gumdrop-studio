# 🧁 Gumdrop Studio

<Insert centered logo here>

A cute pixel art creation app made in React.

## Features

- **Dual-layer canvas system**: Pixel layer (blocky) + overlay layer (thin vector accents)
- **Drawing tools**: Pencil, Eraser, Line, Rectangle, Circle, Quadratic Curve, Accent Pen, Eyedropper
- **Zoom & Grid**: Adjustable zoom (4x-40x) with optional grid overlay
- **Color picker**: Color wheel with HSV selection and alpha channel support
- **Undo/Redo**: Full history management
- **Project management**: Save/load projects to localStorage
- **Export formats**: PNG, JPG, SVG, JSON, and standalone HTML snippets

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at [http://localhost:1337](http://localhost:1337)

### Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
gumdrop-studio/
├── public/
│   ├── index.html
│   └── favicon.png
├── src/
│   ├── assets/
│   │   ├── icon.png
│   │   └── logo.png
│   ├── components/
│   │   ├── Canvas.jsx
│   │   ├── ColorWheel.jsx
│   │   ├── ProjectPanel.jsx
│   │   └── ToolPanel.jsx
│   ├── utils/
│   │   ├── canvas.js
│   │   ├── colors.js
│   │   ├── helpers.js
│   │   └── rasterizers.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Canvas API** - Rendering

---

Made with 💗 by Pink Pixel. Go draw some pixelated kittens!
