import React from 'react';

export default function ProjectPanel({
  projectName,
  setProjectName,
  gridW,
  setGridW,
  gridH,
  setGridH,
  saveProject,
  savedList,
  loadProject,
  deleteProject,
  exportImage,
  exportSVG,
  exportJSON,
  exportHTMLSnippet,
  handleImportJSON,
  makeEmpty,
  setPixels,
  setOverlayPaths,
  setHistory,
  setFuture
}) {
  return (
    <aside className="bg-white/8 backdrop-blur rounded-2xl p-4 ring-1 ring-white/10">
      <h2 className="text-xl font-bold mb-3">📁 Project</h2>
      <div className="space-y-3">
        <label className="block text-sm">Name</label>
        <input
          className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15"
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm">Width</label>
            <input
              type="number"
              value={gridW}
              min={4}
              max={256}
              onChange={e => setGridW(parseInt(e.target.value) || 16)}
              className="w-full px-2 py-1 rounded-lg bg-white/10"
            />
          </div>
          <div>
            <label className="block text-sm">Height</label>
            <input
              type="number"
              value={gridH}
              min={4}
              max={256}
              onChange={e => setGridH(parseInt(e.target.value) || 16)}
              className="w-full px-2 py-1 rounded-lg bg-white/10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={saveProject} className="flex-1 py-2 rounded-xl bg-pink-500/80 hover:bg-pink-500 text-white">
            Save
          </button>
          <button
            onClick={() => {
              setPixels(makeEmpty(gridW, gridH));
              setOverlayPaths([]);
              setHistory([]);
              setFuture([]);
            }}
            className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15"
          >
            New
          </button>
        </div>

        <div className="mt-2">
          <p className="text-sm font-medium mb-2">Saved projects</p>
          <div className="max-h-48 overflow-auto space-y-2 pr-1">
            {savedList.length === 0 && <div className="text-xs opacity-70">No projects yet.</div>}
            {savedList.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-lg px-2 py-1">
                <button className="text-left text-sm hover:underline" onClick={() => loadProject(p.id)}>
                  {p.name}
                </button>
                <button className="text-xs text-red-300 hover:text-red-200" onClick={() => deleteProject(p.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold mt-4 mb-2">📤 Export</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => exportImage('image/png', true)} className="py-2 rounded-xl bg-white/10 hover:bg-white/15">
            PNG
          </button>
          <button onClick={() => exportImage('image/jpeg', false)} className="py-2 rounded-xl bg-white/10 hover:bg-white/15">
            JPG
          </button>
          <button onClick={exportSVG} className="py-2 rounded-xl bg-white/10 hover:bg-white/15">
            SVG
          </button>
          <button onClick={exportJSON} className="py-2 rounded-xl bg-white/10 hover:bg-white/15">
            JSON
          </button>
          <button onClick={exportHTMLSnippet} className="col-span-2 py-2 rounded-xl bg-white/10 hover:bg-white/15">
            HTML snippet
          </button>
        </div>

        <h3 className="text-xl font-bold mt-4 mb-2">📥 Import</h3>
        <label className="block text-sm mb-1">Load JSON</label>
        <input type="file" accept="application/json" onChange={handleImportJSON} />

        <details className="mt-4">
          <summary className="cursor-pointer text-sm opacity-80">🔧 View console self-tests</summary>
          <p className="text-xs opacity-70 mt-2">Open your browser console to see pass/fail of built-in tests.</p>
        </details>
      </div>
    </aside>
  );
}
