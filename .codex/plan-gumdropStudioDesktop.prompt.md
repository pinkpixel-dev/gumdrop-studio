# Plan: Gumdrop Studio Desktop — Tauri v2

**TL;DR:** Wrap the existing Gumdrop Studio React app in Tauri v2 to create a native desktop application with native menu bar, system file dialogs, keyboard shortcuts, and dual storage (auto-save + file-based). The existing web build stays untouched — desktop is additive. AppImage for Linux, .dmg for macOS, .msi/.exe for Windows. ~90% of the codebase works as-is; changes are limited to file I/O abstraction, font bundling, and adding the Tauri scaffold.

---

## Phase 1: Tauri Scaffold & Build Setup

1. **Install Rust toolchain** — Tauri v2 requires `rustc` + `cargo`. On Arch: `sudo pacman -S rust` (or use `rustup`). Also need system deps: `webkit2gtk-4.1`, `gtk3`, `libayatana-appindicator`
2. **Install Tauri CLI** — `npm install -D @tauri-apps/cli@latest` + `npx tauri init` to scaffold `src-tauri/` directory
3. **Configure `src-tauri/tauri.conf.json`** — set window title ("Gumdrop Studio"), default size (~1280x800), min size (~900x600), icon paths, bundle identifiers, AppImage/dmg/msi targets
4. **Install Tauri plugins** — `@tauri-apps/plugin-dialog` (file open/save), `@tauri-apps/plugin-fs` (read/write files), `@tauri-apps/plugin-store` (auto-save), `@tauri-apps/plugin-shell` (optional, for opening URLs)
5. **Update `vite.config.js`** — conditionally disable `server.open` when running in Tauri dev mode
6. **Add npm scripts** — `tauri:dev` (development), `tauri:build` (production build with AppImage)
7. **Update `.gitignore`** — add `src-tauri/target/` (Rust build artifacts)

## Phase 2: Native Menu Bar & Keyboard Shortcuts

8. **Create native application menu** in Tauri Rust backend (`src-tauri/src/main.rs` or via Tauri's menu API) — *depends on step 2*
   - **File:** New (Ctrl+N), Open (Ctrl+O), Save (Ctrl+S), Save As (Ctrl+Shift+S), Export submenu (PNG/JPG/SVG/JSON/HTML), Quit (Ctrl+Q)
   - **Edit:** Undo (Ctrl+Z), Redo (Ctrl+Shift+Z)
   - **View:** Zoom In (+), Zoom Out (-), Toggle Grid (Ctrl+G), Toggle Dark Mode (Ctrl+D)
   - **Help:** About, Website link
9. **Wire menu events to React** — use Tauri's `listen()` API in React to respond to menu item clicks and trigger existing state handlers in `App.jsx`

## Phase 3: File I/O Abstraction Layer

10. **Create `src/utils/desktop.js`** — a platform abstraction module that detects if running in Tauri (`window.__TAURI__`) and exports platform-aware I/O functions — *parallel with step 8*
    - `saveFile(blob, filename, filters)` → native save dialog or browser download
    - `openFile(filters)` → native open dialog or `<input type="file">`
    - `showMessage(title, msg)` → native message box or `alert()`
    - `isDesktop()` → boolean check
11. **Refactor `downloadBlob()` / `downloadDataURL()` in `App.jsx`** — replace with the abstraction from step 10. On desktop: shows native save dialog with format-specific file filters (e.g., `*.png`). On web: falls back to current anchor-click trick — *depends on step 10*
12. **Refactor JSON import in `App.jsx` + `ProjectPanel.jsx`** — replace `<input type="file">` + `FileReader` with the `openFile()` abstraction. On desktop: native open dialog filtered to `*.gumdrop` / `*.json`. On web: falls back to current flow — *depends on step 10*
13. **Replace `alert()` call** in `App.jsx` import error handler with `showMessage()` — *depends on step 10*

## Phase 4: Dual Storage System

14. **Create `src/utils/storage.js`** — project storage abstraction — *depends on step 10*
    - **Auto-save store** (`@tauri-apps/plugin-store`): replaces `localStorage` for internal project list. On web: falls back to `localStorage`
    - **File-based storage**: `.gumdrop` files (JSON format) that users can browse, share, double-click to open
15. **Refactor `saveProject()` / `loadProject()` / `deleteProject()` / `listProjects()`** — use the storage abstraction. Auto-save writes to the Tauri store; "Save As" opens native save dialog to write `.gumdrop` file — *depends on step 14*
16. **Register `.gumdrop` file association** in `tauri.conf.json` — double-clicking a `.gumdrop` file opens it in Gumdrop Studio — *depends on step 3*

## Phase 5: Font Bundling & Offline Assets

17. **Download Workbench font** and place in `public/fonts/` — *parallel with any phase*
18. **Update `index.html`** — replace Google Fonts CDN link with local `@font-face` declaration. Keep CDN as fallback for web version using a `<link>` with `media="print" onload` pattern, or just go fully local
19. **Add app icons** — create icon set for all platforms (`.ico`, `.icns`, `.png` at 32/128/256/512px) in `src-tauri/icons/` from existing `public/logo.png` — *parallel with any phase*

## Phase 6: Window & Title Bar Polish

20. **Set window title dynamically** — show project name in title bar: "Gumdrop Studio — MyProject.gumdrop" via Tauri's window title API — *depends on step 14*
21. **Set minimum window size** — prevent the app from being resized too small for the 3-column layout (min ~900x600) — *depends on step 3*
22. **Add close confirmation** — if unsaved changes exist, prompt before closing via Tauri's `on_close_requested` event — *depends on step 14*

## Phase 7: Build & Distribution

23. **Configure AppImage build** in `tauri.conf.json` bundle config — set categories, description, icon — *depends on step 19*
24. **Test `npx tauri build`** — produces AppImage in `src-tauri/target/release/bundle/appimage/`
25. **Optionally configure** `.deb` and `.rpm` bundles for other Linux distros, `.dmg` for macOS, `.msi`/`.nsis` for Windows — *parallel with step 24*
26. **Add CI/CD** — GitHub Actions workflow for multi-platform builds (tauri-action) — *after step 24*

---

## Relevant Files

- `src/App.jsx` — main refactor target: `downloadBlob()`, `downloadDataURL()`, `saveProject()`, `loadProject()`, `deleteProject()`, `exportImage()`, `exportSVG()`, `exportJSON()`, `exportHTMLSnippet()`, `handleImport()`
- `src/components/ProjectPanel.jsx` — replace `<input type="file">` with native open dialog
- `src/utils/helpers.js` — `listProjects()` uses localStorage, needs storage abstraction
- `vite.config.js` — add conditional `server.open` + potentially Tauri-specific config
- `index.html` — replace Google Fonts CDN with local font
- `package.json` — add Tauri dev dependencies and scripts
- `src-tauri/` — **new** Tauri scaffold directory (Cargo.toml, tauri.conf.json, src/main.rs, icons/)
- `src/utils/desktop.js` — **new** platform abstraction layer for file I/O + dialogs
- `src/utils/storage.js` — **new** dual storage abstraction (Tauri store + filesystem)

## Verification

1. **`npx tauri dev`** — app launches in native window with correct title, icon, menu bar
2. **Native menu bar** — File > New/Open/Save/Save As/Export all functional; Edit > Undo/Redo work; keyboard shortcuts trigger correct actions
3. **Save dialog** — exporting PNG/SVG/etc opens native save dialog with correct file filters
4. **Open dialog** — importing `.gumdrop`/`.json` opens native file picker
5. **Auto-save** — creating/editing a project persists to Tauri store; closing and reopening preserves project list
6. **File-based save** — Save As creates a `.gumdrop` file; double-clicking that file launches the app and loads it
7. **Offline** — app works fully offline (no Google Fonts CDN dependency)
8. **AppImage** — `npx tauri build` produces working AppImage; test on Arch Linux
9. **Canvas rendering** — dual-layer canvas, all drawing tools, and all export formats work identically to web version
10. **Web version** — `npm run dev` and `npm run build` still work as before (no regressions)
11. **Window resize** — canvas auto-fits correctly when resizing the native window

## Decisions

- **Tauri v2 over Electron** — 95% smaller bundle, Arch-native, built-in AppImage support, and this app has zero Node.js dependencies
- **Same repo** — `src-tauri/` added alongside existing structure; web and desktop coexist
- **Full native UX** — native menu bar, system file dialogs, keyboard shortcuts, window title management
- **Dual storage** — auto-save to Tauri store for seamless UX + explicit Save As for `.gumdrop` files
- **Platform abstraction** — all desktop-specific code behind `isDesktop()` checks so the web version stays fully functional
- **No changes to core drawing engine** — Canvas2D, rasterizers, color system, and dual-layer rendering work as-is in Tauri's WebKitGTK webview
- **Scope exclusion** — no TypeScript migration, no state management refactor, no new drawing features in this effort
