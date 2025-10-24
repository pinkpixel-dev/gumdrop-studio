import { useEffect, useRef, useState } from 'react';
import ToolPanel from './components/ToolPanel';
import Canvas from './components/Canvas';
import ProjectPanel from './components/ProjectPanel';
import { makeEmpty, deepCopyPixels, listProjects, uid, clamp, validXY } from './utils/helpers';
import { rasterLine, rasterCircle, rasterRect, fillRect, rasterQuad } from './utils/rasterizers';
import { hexToRGBA, rgbaToHex } from './utils/colors';

export default function App() {
  const [gridW, setGridW] = useState(32);
  const [gridH, setGridH] = useState(32);
  const [scale, setScale] = useState(16);
  const [showGrid, setShowGrid] = useState(true);
  const [fillShape, setFillShape] = useState(false);
  const [pixels, setPixels] = useState(() => makeEmpty(gridW, gridH));
  const [overlayPaths, setOverlayPaths] = useState([]);

  const tools = [
    { id: 'pencil', label: 'Pencil 🖊️' },
    { id: 'eraser', label: 'Eraser 🧽' },
    { id: 'line', label: 'Line 📏' },
    { id: 'rect', label: 'Rect ▭' },
    { id: 'circle', label: 'Circle ◯' },
    { id: 'curve', label: 'Curve ☾' },
    { id: 'accent', label: 'Accent Pen ✨' },
    { id: 'picker', label: 'Eyedropper 🎯' }
  ];
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#ff66cc');
  const [alpha, setAlpha] = useState(1);
  const [accentWidth, setAccentWidth] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [tempPreview, setTempPreview] = useState(null);
  const [curveTemps, setCurveTemps] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [projectName, setProjectName] = useState('My Pixel Pet');
  const [savedList, setSavedList] = useState(() => listProjects());

  const pixCanvasRef = useRef(null);

  useEffect(() => {
    setPixels(makeEmpty(gridW, gridH));
    setOverlayPaths([]);
    setHistory([]);
    setFuture([]);
  }, [gridW, gridH]);

  function getGridPos(e) {
    const host = pixCanvasRef.current;
    if (!host) return { x: 0, y: 0 };
    const rect = host.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);
    return { x: clamp(x, 0, gridW - 1), y: clamp(y, 0, gridH - 1) };
  }

  function pushHistory() {
    setHistory(h => [...h, { pixels: deepCopyPixels(pixels), overlay: JSON.parse(JSON.stringify(overlayPaths)) }]);
    setFuture([]);
  }

  function undo() {
    setHistory(h => {
      if (h.length === 0) return h;
      const last = h[h.length - 1];
      setFuture(f => [{ pixels: deepCopyPixels(pixels), overlay: JSON.parse(JSON.stringify(overlayPaths)) }, ...f]);
      setPixels(last.pixels);
      setOverlayPaths(last.overlay);
      return h.slice(0, -1);
    });
  }

  function redo() {
    setFuture(f => {
      if (f.length === 0) return f;
      const nxt = f[0];
      setHistory(h => [...h, { pixels: deepCopyPixels(pixels), overlay: JSON.parse(JSON.stringify(overlayPaths)) }]);
      setPixels(nxt.pixels);
      setOverlayPaths(nxt.overlay);
      return f.slice(1);
    });
  }

  function handlePointerDown(e) {
    e.preventDefault();
    const pos = getGridPos(e);
    setIsDrawing(true);
    setDragStart(pos);
    pushHistory();

    if (tool === 'pencil') {
      applyPixels([pos]);
    } else if (tool === 'eraser') {
      applyPixels([pos], true);
    } else if (tool === 'accent') {
      const newPath = { id: uid(), points: [pos], color: hexToRGBA(color, alpha), width: accentWidth };
      setOverlayPaths(p => [...p, newPath]);
    } else if (tool === 'picker') {
      const px = pixels[pos.y]?.[pos.x];
      if (px) setColor(rgbaToHex(px));
    }
  }

  function handlePointerMove(e) {
    if (!isDrawing) return;
    const pos = getGridPos(e);
    if (tool === 'pencil' || tool === 'eraser') {
      const last = dragStart;
      if (!last) {
        setDragStart(pos);
        return;
      }
      const pts = rasterLine(last.x, last.y, pos.x, pos.y);
      applyPixels(pts, tool === 'eraser');
      setDragStart(pos);
    } else if (tool === 'line' && dragStart) {
      setTempPreview(rasterLine(dragStart.x, dragStart.y, pos.x, pos.y));
    } else if (tool === 'rect' && dragStart) {
      setTempPreview(fillShape ? fillRect(dragStart.x, dragStart.y, pos.x, pos.y) : rasterRect(dragStart.x, dragStart.y, pos.x, pos.y));
    } else if (tool === 'circle' && dragStart) {
      const r = Math.round(Math.hypot(pos.x - dragStart.x, pos.y - dragStart.y));
      setTempPreview(rasterCircle(dragStart.x, dragStart.y, r));
    } else if (tool === 'curve') {
      if (curveTemps.length === 1) {
        const s = curveTemps[0];
        setTempPreview(rasterLine(s.x, s.y, pos.x, pos.y));
      } else if (curveTemps.length === 2) {
        const s = curveTemps[0];
        const c = curveTemps[1];
        setTempPreview(rasterQuad(s.x, s.y, c.x, c.y, pos.x, pos.y));
      }
    } else if (tool === 'accent') {
      setOverlayPaths(paths => {
        const copy = [...paths];
        if (copy.length === 0) return copy;
        copy[copy.length - 1].points.push(pos);
        return copy;
      });
    }
  }

  function handlePointerUp(e) {
    if (!isDrawing) return;
    setIsDrawing(false);
    const pos = getGridPos(e);
    if (tool === 'line' && dragStart) {
      applyPixels(rasterLine(dragStart.x, dragStart.y, pos.x, pos.y));
    } else if (tool === 'rect' && dragStart) {
      const pts = fillShape ? fillRect(dragStart.x, dragStart.y, pos.x, pos.y) : rasterRect(dragStart.x, dragStart.y, pos.x, pos.y);
      applyPixels(pts);
    } else if (tool === 'circle' && dragStart) {
      const r = Math.round(Math.hypot(pos.x - dragStart.x, pos.y - dragStart.y));
      applyPixels(rasterCircle(dragStart.x, dragStart.y, r));
    } else if (tool === 'curve') {
      if (curveTemps.length === 0) {
        setCurveTemps([{ x: pos.x, y: pos.y }]);
      } else if (curveTemps.length === 1) {
        setCurveTemps(ct => [ct[0], { x: pos.x, y: pos.y }]);
      } else if (curveTemps.length === 2) {
        const s = curveTemps[0];
        const c = curveTemps[1];
        applyPixels(rasterQuad(s.x, s.y, c.x, c.y, pos.x, pos.y));
        setCurveTemps([]);
      }
    }
    setTempPreview(null);
    setDragStart(null);
  }

  function applyPixels(pts, erase = false) {
    if (!Array.isArray(pts) || !pts.length) return;
    const rgba = hexToRGBA(color, alpha);
    setPixels(prev => {
      const copy = deepCopyPixels(prev);
      for (const pair of pts) {
        if (!Array.isArray(pair) || pair.length < 2) continue;
        const [x, y] = pair;
        if (!validXY(x, y)) continue;
        if (x < 0 || y < 0 || x >= gridW || y >= gridH) continue;
        copy[y][x] = erase ? null : { ...rgba };
      }
      return copy;
    });
  }

  function exportImage(type = 'image/png', bgTransparent = true) {
    const out = document.createElement('canvas');
    out.width = gridW;
    out.height = gridH;
    const ctx = out.getContext('2d');
    const px = ctx.createImageData(gridW, gridH);
    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        const idx = (y * gridW + x) * 4;
        const c = pixels[y][x];
        if (!c) {
          if (!bgTransparent) {
            px.data[idx + 3] = 255;
          }
          continue;
        }
        px.data[idx] = c.r;
        px.data[idx + 1] = c.g;
        px.data[idx + 2] = c.b;
        px.data[idx + 3] = Math.round(c.a * 255);
      }
    }
    ctx.putImageData(px, 0, 0);
    if (overlayPaths.length) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      for (const p of overlayPaths) {
        ctx.lineWidth = p.width || 1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.color.a})`;
        ctx.beginPath();
        ctx.moveTo(p.points[0].x + 0.5, p.points[0].y + 0.5);
        for (let i = 1; i < p.points.length; i++) ctx.lineTo(p.points[i].x + 0.5, p.points[i].y + 0.5);
        ctx.stroke();
      }
      ctx.restore();
    }
    const dataURL = out.toDataURL(type);
    downloadDataURL(dataURL, type === 'image/png' ? 'mygumdrop.png' : 'mygumdrop.jpg');
  }

  function exportSVG() {
    const rects = [];
    for (let y = 0; y < gridH; y++)
      for (let x = 0; x < gridW; x++) {
        const c = pixels[y][x];
        if (!c) continue;
        rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${rgbaToHex(c)}" fill-opacity="${c.a}" />`);
      }
    const paths = overlayPaths
      .map(p => {
        const d = p.points.map((pt, i) => `${i ? 'L' : 'M'} ${pt.x + 0.5} ${pt.y + 0.5}`).join(' ');
        const col = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.color.a})`;
        return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${p.width || 1}" stroke-linecap="round" stroke-linejoin="round" />`;
      })
      .join('\n');
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${gridW} ${gridH}" shape-rendering="crispEdges">\n${rects.join('\n')}\n${paths}\n</svg>`;
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'gumdrop.svg');
  }

  function exportJSON() {
    const payload = { w: gridW, h: gridH, pixels, overlayPaths };
    downloadBlob(new Blob([JSON.stringify(payload)], { type: 'application/json' }), 'gumdrop.json');
  }

  function exportHTMLSnippet() {
    const payload = { w: gridW, h: gridH, pixels, overlayPaths };
    const html = `<!DOCTYPE html>\n<html><head><meta charset="utf-8"/><title>Pixel Pet Snippet</title><style>body{background:#0b0b12;color:#eee;font-family:ui-sans-serif,system-ui;margin:0;display:grid;place-items:center;height:100svh}</style></head><body><canvas id="c" width="${gridW}" height="${gridH}" style="image-rendering:pixelated"></canvas><script>\nconst data=${JSON.stringify(payload)};\nconst c=document.getElementById('c');const ctx=c.getContext('2d');const img=ctx.createImageData(data.w,data.h);\nfor(let y=0;y<data.h;y++){for(let x=0;x<data.w;x++){const i=(y*data.w+x)*4;const p=data.pixels[y][x];if(!p){img.data[i+3]=0;continue;}img.data[i]=p.r;img.data[i+1]=p.g;img.data[i+2]=p.b;img.data[i+3]=Math.round(p.a*255);}}\nctx.putImageData(img,0,0);\nif(data.overlayPaths&&data.overlayPaths.length){ctx.imageSmoothingEnabled=true;for(const p of data.overlayPaths){ctx.beginPath();ctx.lineWidth=p.width||1;ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle='rgba('+p.color.r+','+p.color.g+','+p.color.b+','+p.color.a+')';const s=p.points[0];ctx.moveTo(s.x+0.5,s.y+0.5);for(let i=1;i<p.points.length;i++){const pt=p.points[i];ctx.lineTo(pt.x+0.5,pt.y+0.5);}ctx.stroke();}}\n</script></body></html>`;
    downloadBlob(new Blob([html], { type: 'text/html' }), 'gumdrop_snippet.html');
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadDataURL(dataURL, filename) {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    a.click();
  }

  function saveProject() {
    const payload = { id: uid(), name: projectName, updated: Date.now(), gridW, gridH, pixels, overlayPaths };
    const list = JSON.parse(localStorage.getItem('gumdrop:projects') || '[]');
    const idx = list.findIndex(p => p.name === projectName);
    if (idx >= 0) list[idx] = { ...payload, id: list[idx].id };
    else list.push(payload);
    localStorage.setItem('gumdrop:projects', JSON.stringify(list));
    setSavedList(list);
  }

  function loadProject(id) {
    const list = JSON.parse(localStorage.getItem('gumdrop:projects') || '[]');
    const p = list.find(p => p.id === id) || list.find(p => p.name === id);
    if (!p) return;
    setProjectName(p.name);
    setGridW(p.gridW);
    setGridH(p.gridH);
    setPixels(p.pixels);
    setOverlayPaths(p.overlayPaths || []);
    setHistory([]);
    setFuture([]);
  }

  function deleteProject(id) {
    const list = JSON.parse(localStorage.getItem('gumdrop:projects') || '[]').filter(p => p.id !== id);
    localStorage.setItem('gumdrop:projects', JSON.stringify(list));
    setSavedList(list);
  }

  function handleImportJSON(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        setGridW(d.w);
        setGridH(d.h);
        setPixels(d.pixels);
        setOverlayPaths(d.overlayPaths || []);
        setHistory([]);
        setFuture([]);
      } catch (err) {
        alert('Bad JSON');
      }
    };
    r.readAsText(f);
  }

  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-indigo-900/40 text-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-4">
        <ToolPanel
          tools={tools}
          tool={tool}
          setTool={setTool}
          setTempPreview={setTempPreview}
          setCurveTemps={setCurveTemps}
          scale={scale}
          setScale={setScale}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          fillShape={fillShape}
          setFillShape={setFillShape}
          color={color}
          setColor={setColor}
          alpha={alpha}
          setAlpha={setAlpha}
          accentWidth={accentWidth}
          setAccentWidth={setAccentWidth}
          undo={undo}
          redo={redo}
        />
        <Canvas
          ref={pixCanvasRef}
          gridW={gridW}
          gridH={gridH}
          scale={scale}
          showGrid={showGrid}
          pixels={pixels}
          overlayPaths={overlayPaths}
          tempPreview={tempPreview}
          tool={tool}
          color={color}
          isDrawing={isDrawing}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handlePointerMove}
          handlePointerUp={handlePointerUp}
          setIsDrawing={setIsDrawing}
        />
        <ProjectPanel
          projectName={projectName}
          setProjectName={setProjectName}
          gridW={gridW}
          setGridW={setGridW}
          gridH={gridH}
          setGridH={setGridH}
          saveProject={saveProject}
          savedList={savedList}
          loadProject={loadProject}
          deleteProject={deleteProject}
          exportImage={exportImage}
          exportSVG={exportSVG}
          exportJSON={exportJSON}
          exportHTMLSnippet={exportHTMLSnippet}
          handleImportJSON={handleImportJSON}
          makeEmpty={makeEmpty}
          setPixels={setPixels}
          setOverlayPaths={setOverlayPaths}
          setHistory={setHistory}
          setFuture={setFuture}
        />
      </div>
      <footer className="mt-6 text-center text-xs opacity-70">
        Gumdrop Studio — Made with 💗 by Pink Pixel. Go draw some pixelated kittens.
      </footer>
    </div>
  );
}
