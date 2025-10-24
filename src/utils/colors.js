export function hexToRGBA(hex, alpha = 1) {
  if (!hex) return { r: 255, g: 0, b: 255, a: alpha };
  const s = String(hex).replace('#', '');
  const full = s.length === 3 ? s.split('').map(ch => ch + ch).join('') : s.padStart(6, '0').slice(0, 6);
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return { r, g, b, a: alpha };
}

export function rgbaToHex({ r, g, b }) {
  const toHex = (v) => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hsvToRgb(h, s, v) {
  let r, g, b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
    default: r = g = b = 0;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function drawColorWheel(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const img = ctx.createImageData(w, h);
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * w + x) * 4;
      if (dist > r) {
        img.data[idx + 3] = 0;
        continue;
      }
      const hue = (Math.atan2(dy, dx) / (2 * Math.PI) + 1) % 1;
      const sat = dist / r;
      const val = 1;
      const { r: R, g: G, b: B } = hsvToRgb(hue, sat, val);
      img.data[idx] = R;
      img.data[idx + 1] = G;
      img.data[idx + 2] = B;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}
