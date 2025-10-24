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
  darkMode,
  setDarkMode
}) {
  return (
    <aside className={`backdrop-blur rounded-2xl p-4 ring-1 transition-colors ${
      darkMode 
        ? 'bg-white/8 ring-white/10' 
        : 'bg-slate-900/8 ring-slate-300/20'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">🧁 Tools</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-white/10 hover:bg-white/15' 
              : 'bg-slate-900/10 hover:bg-slate-900/15'
          }`}
          title="Toggle dark/light mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
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
                : `hover:bg-slate-900/10 ${tool === t.id ? 'bg-slate-900/15 border-slate-900/30' : 'border-slate-300/30'}`
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

        <div className={`pt-3 border-t ${darkMode ? 'border-white/10' : 'border-slate-300/20'}`}>
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

        <div className={`pt-4 border-t space-y-2 ${darkMode ? 'border-white/10' : 'border-slate-300/20'}`}>
          <button onClick={undo} className={`w-full py-2 rounded-xl transition-colors ${
            darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-900/10 hover:bg-slate-900/15'
          }`}>
            Undo ⎌
          </button>
          <button onClick={redo} className={`w-full py-2 rounded-xl transition-colors ${
            darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-900/10 hover:bg-slate-900/15'
          }`}>
            Redo ↻
          </button>
        </div>
      </div>
    </aside>
  );
}
