import React, { useRef, useState } from 'react';

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
  setFuture,
  darkMode
}) {
  const fileInputRef = useRef(null);
  const [importFilename, setImportFilename] = useState('');

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = e => {
    const file = e.target.files?.[0] || null;
    setImportFilename(file ? file.name : '');
    handleImportJSON(e);
    e.target.value = '';
  };

  const importLabel = importFilename || 'No file selected';

  return (
    <aside className={`backdrop-blur rounded-2xl p-4 ring-1 transition-colors ${
      darkMode 
        ? 'bg-white/8 ring-white/10' 
        : 'bg-slate-900/8 ring-slate-300/20'
    }`}>
      <h2 className="text-xl font-bold mb-3">📁 Project</h2>
      <div className="space-y-3">
        <label className="block text-sm">Name</label>
        <input
          className={`w-full px-3 py-2 rounded-xl border transition-colors ${
            darkMode 
              ? 'bg-white/10 border-white/15' 
              : 'bg-slate-900/10 border-slate-300/30'
          }`}
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
              className={`w-full px-2 py-1 rounded-lg transition-colors ${
                darkMode ? 'bg-white/10' : 'bg-slate-900/10'
              }`}
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
              className={`w-full px-2 py-1 rounded-lg transition-colors ${
                darkMode ? 'bg-white/10' : 'bg-slate-900/10'
              }`}
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
            className={`flex-1 py-2 rounded-xl transition-colors ${
              darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-900/10 hover:bg-slate-900/15'
            }`}
          >
            New
          </button>
        </div>

        <div className="mt-2">
          <p className="text-sm font-medium mb-2">Saved projects</p>
          <div className="max-h-48 overflow-auto space-y-2 pr-1">
            {savedList.length === 0 && <div className="text-xs opacity-70">No projects yet.</div>}
            {savedList.map(p => (
              <div key={p.id} className={`flex items-center justify-between rounded-lg px-2 py-1 transition-colors ${
                darkMode ? 'bg-white/5' : 'bg-slate-900/5'
              }`}>
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
          <button onClick={() => exportImage('image/png', true)} className={`py-2 rounded-xl transition-colors ${
            darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-900/10 hover:bg-slate-900/15'
          }`}>
            PNG
          </button>
          <button onClick={() => exportImage('image/jpeg', false)} className={`py-2 rounded-xl transition-colors ${
            darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-900/10 hover:bg-slate-900/15'
          }`}>
            JPG
          </button>
          <button onClick={exportSVG} className={`py-2 rounded-xl transition-colors ${
            darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-900/10 hover:bg-slate-900/15'
          }`}>
            SVG
          </button>
          <button onClick={exportJSON} className={`py-2 rounded-xl transition-colors ${
            darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-900/10 hover:bg-slate-900/15'
          }`}>
            JSON
          </button>
          <button onClick={exportHTMLSnippet} className={`col-span-2 py-2 rounded-xl transition-colors ${
            darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-900/10 hover:bg-slate-900/15'
          }`}>
            HTML snippet
          </button>
        </div>

        <h3 className="text-xl font-bold mt-4 mb-2">📥 Import</h3>
        <div className={`rounded-xl border px-3 py-3 space-y-2 transition-colors ${
          darkMode ? 'border-white/10 bg-white/5' : 'border-slate-300/30 bg-slate-900/5'
        }`}>
          <div>
            <p className="text-sm font-medium">Load JSON</p>
            <p className="text-xs opacity-70">Import a Gumdrop Studio export file to restore a project.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={triggerFilePicker}
              className={`px-3 py-2 rounded-xl transition-colors ${
                darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-900/10 hover:bg-slate-900/15'
              }`}
            >
              Choose file
            </button>
            <span className="text-xs opacity-70 truncate">{importLabel}</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportChange}
            className="hidden"
          />
        </div>
      </div>
    </aside>
  );
}
