import React, { useEffect, useMemo, useRef } from 'react';
import { renderPixelsToCanvas, drawGrid, drawPath } from '../utils/canvas';
import { validXY } from '../utils/helpers';

const Canvas = React.forwardRef(({
  gridW,
  gridH,
  scale,
  showGrid,
  gridColor,
  pixels,
  overlayPaths,
  tempPreview,
  tool,
  color,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handlePointerCancel,
  handlePointerLeave
}, ref) => {
  const pixCanvasRef = ref || useRef(null);
  const overCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = pixCanvasRef.current;
    if (!canvas) return;
    canvas.width = gridW * scale;
    canvas.height = gridH * scale;
    const ctx = canvas.getContext('2d');
    renderPixelsToCanvas(ctx, pixels, gridW, gridH, scale);
    if (showGrid) drawGrid(ctx, gridW, gridH, scale, gridColor);
  }, [pixels, gridW, gridH, scale, showGrid, gridColor]);

  useEffect(() => {
    const canvas = overCanvasRef.current;
    if (!canvas) return;
    canvas.width = gridW * scale;
    canvas.height = gridH * scale;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of overlayPaths) drawPath(ctx, p, scale);

    if (Array.isArray(tempPreview) && tempPreview.length && tool !== 'accent') {
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = color;
      for (const pair of tempPreview) {
        if (!Array.isArray(pair) || pair.length < 2) continue;
        const [x, y] = pair;
        if (!validXY(x, y)) continue;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
      ctx.restore();
    }
  }, [overlayPaths, tempPreview, gridW, gridH, scale, tool, color]);

  const pixelBoardStyle = useMemo(
    () => ({
      width: gridW * scale,
      height: gridH * scale,
      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      borderRadius: '1rem'
    }),
    [gridW, gridH, scale]
  );

  return (
    <main className="flex flex-col items-center gap-3">
      <div
        className="relative select-none touch-none cursor-crosshair"
        style={pixelBoardStyle}
      >
        <canvas
          ref={pixCanvasRef}
          className="absolute inset-0 rounded-2xl touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerLeave}
        />
        <canvas ref={overCanvasRef} className="absolute inset-0 rounded-2xl pointer-events-none" />
      </div>
      <div className="text-xs opacity-70">
        Tip: Curve tool = three clicks (start → control → end). Accent pen draws thin lines for smiles and whiskers.
      </div>
    </main>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
