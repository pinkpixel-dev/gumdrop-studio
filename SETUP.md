# 🚀 Quick Setup Guide

## Prerequisites

Make sure you have Node.js installed (v16 or higher recommended).

## Installation Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   The app will automatically open at `http://localhost:1234`

## Available Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## What Changed?

Your single-file app has been reorganized into a proper React project structure:

### 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Canvas.jsx      # Main drawing canvas
│   ├── ColorWheel.jsx  # Color picker wheel
│   ├── ProjectPanel.jsx # Save/load/export panel
│   └── ToolPanel.jsx   # Drawing tools panel
├── utils/              # Utility functions
│   ├── canvas.js       # Canvas rendering utilities
│   ├── colors.js       # Color conversion functions
│   ├── helpers.js      # General helper functions
│   └── rasterizers.js  # Drawing algorithms (line, circle, etc.)
├── assets/             # Images (logo, icon)
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

### ✨ Benefits

- **Better organization**: Code is split into logical modules
- **Easier maintenance**: Each component has a single responsibility
- **Reusability**: Utilities can be imported anywhere
- **Modern tooling**: Vite for fast development and optimized builds
- **Type safety ready**: Easy to add TypeScript later if needed

## Troubleshooting

If you encounter any issues:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear browser cache
4. Try `npm run dev` again

Enjoy creating pixel art! 🎨
