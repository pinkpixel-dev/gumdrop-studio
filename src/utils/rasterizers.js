import { toInt } from './helpers';

export function rasterLine(x0, y0, x1, y1) {
  x0 = toInt(x0); y0 = toInt(y0); x1 = toInt(x1); y1 = toInt(y1);
  if (x0 === null || y0 === null || x1 === null || y1 === null) return [];
  const pts = [];
  let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    pts.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
  return pts;
}

export function rasterCircle(cx, cy, r) {
  cx = toInt(cx); cy = toInt(cy); r = toInt(r);
  if (cx === null || cy === null || r === null || r < 0) return [];
  const pts = new Set();
  let x = r, y = 0, err = 0;
  while (x >= y) {
    [[cx + x, cy + y], [cx + y, cy + x], [cx - y, cy + x], [cx - x, cy + y],
     [cx - x, cy - y], [cx - y, cy - x], [cx + y, cy - x], [cx + x, cy - y]].forEach(([px, py]) => {
      pts.add(`${px},${py}`);
    });
    y += 1;
    if (err <= 0) err += 2*y + 1;
    if (err > 0) { x -= 1; err -= 2*x + 1; }
  }
  return [...pts].map(s => s.split(',').map(Number));
}

export function rasterRect(x0, y0, x1, y1) {
  x0 = toInt(x0); y0 = toInt(y0); x1 = toInt(x1); y1 = toInt(y1);
  if (x0 === null || y0 === null || x1 === null || y1 === null) return [];
  const pts = [];
  const [minx, maxx] = [Math.min(x0,x1), Math.max(x0,x1)];
  const [miny, maxy] = [Math.min(y0,y1), Math.max(y0,y1)];
  for (let x=minx;x<=maxx;x++) { pts.push([x, miny]); pts.push([x, maxy]); }
  for (let y=miny;y<=maxy;y++) { pts.push([minx, y]); pts.push([maxx, y]); }
  return pts;
}

export function fillRect(x0, y0, x1, y1) {
  x0 = toInt(x0); y0 = toInt(y0); x1 = toInt(x1); y1 = toInt(y1);
  if (x0 === null || y0 === null || x1 === null || y1 === null) return [];
  const pts = [];
  const [minx, maxx] = [Math.min(x0,x1), Math.max(x0,x1)];
  const [miny, maxy] = [Math.min(y0,y1), Math.max(y0,y1)];
  for (let y=miny;y<=maxy;y++) for (let x=minx;x<=maxx;x++) pts.push([x,y]);
  return pts;
}

export function rasterQuad(x0, y0, cx, cy, x1, y1) {
  x0 = toInt(x0); y0 = toInt(y0); cx = toInt(cx); cy = toInt(cy); x1 = toInt(x1); y1 = toInt(y1);
  if ([x0,y0,cx,cy,x1,y1].some(v => v === null)) return [];
  const pts = [];
  const steps = 200;
  let last = null;
  for (let i=0;i<=steps;i++) {
    const t = i/steps;
    const xt = (1-t)*(1-t)*x0 + 2*(1-t)*t*cx + t*t*x1;
    const yt = (1-t)*(1-t)*y0 + 2*(1-t)*t*cy + t*t*y1;
    const ix = Math.round(xt);
    const iy = Math.round(yt);
    if (!last) { last = [ix,iy]; pts.push(last); }
    else if (ix !== last[0] || iy !== last[1]) { pts.push([ix,iy]); last = [ix,iy]; }
  }
  return pts;
}
