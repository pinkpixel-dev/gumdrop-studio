import ColorWheel from './ColorWheel';

export default function ToolPanel({
  tools,
  tool,
  setTool,
  setTempPreview,
  setCurveTemps,
  scale,
  setScale,
  showGrid,
  setShowGrid,
  fillShape,
  setFillShape,
  color,
  setColor,
  alpha,
  setAlpha,
  accentWidth,
  setAccentWidth,
  undo,
  redo,
  darkMode
}) {
  return (
    <aside className={`backdrop-blur rounded-2xl p-4 ring-1 transition-colors ${
      darkMode 
        ? 'bg-white/8 ring-white/10' 
        : 'bg-amber-50/90 ring-amber-200/60'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">🧁 Tools</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {tools.map(t => (
          <button
            key={t.id}
            onClick={() => {
              setTool(t.id);
              setTempPreview(null);
              setCurveTemps([]);
            }}
            className={`px-3 py-2 rounded-xl border text-left transition ${
              darkMode
                ? `hover:bg-white/10 ${tool === t.id ? 'bg-white/15 border-white/30' : 'border-white/10'}`
                : `hover:bg-amber-100/60 ${tool === t.id ? 'bg-amber-100/80 border-amber-300/60' : 'border-amber-200/40'}`
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <label className="block text-sm opacity-90">Zoom: {scale}x</label>
        <input
          type="range"
          min={4}
          max={40}
          value={scale}
          onChange={e => setScale(parseInt(e.target.value))}
          className="w-full"
        />

        <label className="flex items-center gap-2 text-sm opacity-90">
          <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} /> Show grid
        </label>

        <label className="flex items-center gap-2 text-sm opacity-90">
          <input type="checkbox" checked={fillShape} onChange={e => setFillShape(e.target.checked)} /> Fill rectangles
        </label>

        <div className={`pt-3 border-t ${darkMode ? 'border-white/10' : 'border-amber-200/50'}`}>
          <p className="text-sm mb-2">🎨 Color</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="h-10 w-12 rounded-lg bg-transparent"
            />
            <div className="text-sm opacity-90">Alpha: {alpha.toFixed(2)}</div>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={alpha}
            onChange={e => setAlpha(parseFloat(e.target.value))}
            className="w-full"
          />

          <ColorWheel setColor={setColor} />

          {tool === 'accent' && (
            <div className="mt-3">
              <p className="text-sm">Accent width: {accentWidth}px</p>
              <input
                type="range"
                min={1}
                max={6}
                value={accentWidth}
                onChange={e => setAccentWidth(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className={`pt-4 border-t space-y-2 ${darkMode ? 'border-white/10' : 'border-amber-200/50'}`}>
          <button onClick={undo} className={`w-full py-2 rounded-xl transition-colors ${
            darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-amber-100/60 hover:bg-amber-100/80'
          }`}>
            Undo ⎌
          </button>
          <button onClick={redo} className={`w-full py-2 rounded-xl transition-colors ${
            darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-amber-100/60 hover:bg-amber-100/80'
          }`}>
            Redo ↻
          </button>
        </div>
      </div>
    </aside>
  );
}
