import React, { useEffect, useRef } from 'react';
import { drawColorWheel, hsvToRgb } from '../utils/colors';

export default function ColorWheel({ setColor }) {
  const wheelRef = useRef(null);

  useEffect(() => {
    const c = wheelRef.current;
    if (!c) return;
    drawColorWheel(c);
  }, []);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = e.currentTarget.width / 2;
    const cy = e.currentTarget.height / 2;
    const dx = x - cx, dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const r = e.currentTarget.width / 2 - 1;
    if (dist > r) return;
    const hue = (Math.atan2(dy, dx) / (2 * Math.PI) + 1) % 1;
    const sat = dist / r;
    const { r: R, g: G, b: B } = hsvToRgb(hue, sat, 1);
    setColor(`#${[R, G, B].map(v => v.toString(16).padStart(2, '0')).join('')}`);
  };

  return (
    <div className="mt-3">
      <p className="text-sm mb-2">Hue & Saturation</p>
      <canvas
        ref={wheelRef}
        width={160}
        height={160}
        className="rounded-full border border-white/10 cursor-crosshair"
        onClick={handleClick}
      />
    </div>
  );
}
