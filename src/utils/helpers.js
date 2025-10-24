export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const uid = () => Math.random().toString(36).slice(2, 9);
export const toInt = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.round(v) : null;
};
export const validXY = (...vals) => vals.every((v) => Number.isFinite(v));

export function makeEmpty(w, h) {
  w = toInt(w) ?? 16;
  h = toInt(h) ?? 16;
  return Array.from({ length: h }, () => Array.from({ length: w }, () => null));
}

export function deepCopyPixels(p) {
  return p.map((row) => row.map((px) => (px ? { ...px } : null)));
}

export function listProjects() {
  try {
    return JSON.parse(localStorage.getItem('gumdrop:projects') || '[]');
  } catch (e) {
    return [];
  }
}
