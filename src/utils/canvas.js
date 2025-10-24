export function renderPixelsToCanvas(ctx, pixels, w, h, scale) {
  if (!ctx || !pixels || !Array.isArray(pixels)) return;
  ctx.imageSmoothingEnabled = false;
  const img = ctx.createImageData(w, h);
  const data = img.data;
  for (let y = 0; y < h; y++) {
    const row = pixels[y];
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const c = row ? row[x] : null;
      if (!c) {
        data[idx + 3] = 0;
        continue;
      }
      const { r, g, b, a } = c;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = Math.round(a * 255);
    }
  }
  const off = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : document.createElement('canvas');
  off.width = w;
  off.height = h;
  const octx = off.getContext('2d');
  octx.putImageData(img, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(off, 0, 0, w, h, 0, 0, w * scale, h * scale);
}

export function drawGrid(ctx, w, h, s) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x++) {
    ctx.beginPath();
    ctx.moveTo(x * s + 0.5, 0);
    ctx.lineTo(x * s + 0.5, h * s);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * s + 0.5);
    ctx.lineTo(w * s, y * s + 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawPath(ctx, p, s) {
  if (!p || !Array.isArray(p.points) || p.points.length < 2) return;
  ctx.save();
  ctx.lineWidth = p.width || 1;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const col = p.color ? `rgba(${p.color.r},${p.color.g},${p.color.b},${p.color.a})` : '#ffffff';
  ctx.strokeStyle = col;
  ctx.beginPath();
  const start = p.points[0];
  ctx.moveTo((start.x + 0.5) * s, (start.y + 0.5) * s);
  for (let i = 1; i < p.points.length; i++) {
    const pt = p.points[i];
    ctx.lineTo((pt.x + 0.5) * s, (pt.y + 0.5) * s);
  }
  ctx.stroke();
  ctx.restore();
}
