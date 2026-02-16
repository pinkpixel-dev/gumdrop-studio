/**
 * Desktop Platform Abstraction Layer
 * 
 * Provides platform-aware file I/O and dialog functions that work in both
 * web (browser download/upload) and desktop (Tauri native dialogs) contexts.
 */

// Detect if running in Tauri
export function isDesktop() {
  return typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;
}

// Lazy-load Tauri modules only when needed
let dialog = null;
let fs = null;

async function loadTauriModules() {
  if (!isDesktop()) return null;
  
  if (!dialog || !fs) {
    const { save, open, message } = await import('@tauri-apps/plugin-dialog');
    const { writeFile, readTextFile } = await import('@tauri-apps/plugin-fs');
    dialog = { save, open, message };
    fs = { writeFile, readTextFile };
  }
  
  return { dialog, fs };
}

/**
 * Save a file with native dialog (desktop) or browser download (web)
 * 
 * @param {Blob} blob - File content as Blob
 * @param {string} defaultName - Default filename
 * @param {Object} options - Platform-specific options
 * @param {Array} options.filters - File filters [{name: 'PNG', extensions: ['png']}]
 * @returns {Promise<boolean>} True if saved successfully
 */
export async function saveFile(blob, defaultName, options = {}) {
  if (isDesktop()) {
    try {
      const modules = await loadTauriModules();
      if (!modules) throw new Error('Tauri modules not available');
      
      const { dialog, fs } = modules;
      
      // Show native save dialog
      const filePath = await dialog.save({
        defaultPath: defaultName,
        filters: options.filters || []
      });
      
      if (!filePath) return false; // User cancelled
      
      // Convert Blob to Uint8Array
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Write file using Tauri fs plugin
      await fs.writeFile(filePath, uint8Array);
      
      return true;
    } catch (error) {
      console.error('Desktop save error:', error);
      await showMessage('Save Error', `Failed to save file: ${error.message}`);
      return false;
    }
  } else {
    // Web: Use traditional blob download
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = defaultName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
      return true;
    } catch (error) {
      console.error('Web save error:', error);
      return false;
    }
  }
}

/**
 * Save a data URL with native dialog (desktop) or browser download (web)
 * 
 * @param {string} dataURL - Data URL (e.g., from canvas.toDataURL())
 * @param {string} defaultName - Default filename
 * @param {Object} options - Platform-specific options
 * @returns {Promise<boolean>} True if saved successfully
 */
export async function saveDataURL(dataURL, defaultName, options = {}) {
  // Convert data URL to Blob
  const response = await fetch(dataURL);
  const blob = await response.blob();
  return saveFile(blob, defaultName, options);
}

/**
 * Open a file with native dialog (desktop) or file input (web)
 * 
 * @param {Object} options - Platform-specific options
 * @param {Array} options.filters - File filters [{name: 'JSON', extensions: ['json','gumdrop']}]
 * @param {boolean} options.multiple - Allow multiple file selection
 * @returns {Promise<{path: string, content: string}|null>} File data or null if cancelled
 */
export async function openFile(options = {}) {
  if (isDesktop()) {
    try {
      const modules = await loadTauriModules();
      if (!modules) throw new Error('Tauri modules not available');
      
      const { dialog, fs } = modules;
      
      // Show native open dialog
      const selected = await dialog.open({
        multiple: options.multiple || false,
        filters: options.filters || [],
        directory: false
      });
      
      if (!selected) return null; // User cancelled
      
      const filePath = Array.isArray(selected) ? selected[0] : selected;
      
      // Read file content
      const content = await fs.readTextFile(filePath);
      
      return { path: filePath, content };
    } catch (error) {
      console.error('Desktop open error:', error);
      await showMessage('Open Error', `Failed to open file: ${error.message}`);
      return null;
    }
  } else {
    // Web: Use file input
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = options.multiple || false;
      
      if (options.filters && options.filters.length > 0) {
        const extensions = options.filters.flatMap(f => f.extensions).map(e => `.${e}`);
        input.accept = extensions.join(',');
      }
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        
        const content = await file.text();
        resolve({ path: file.name, content });
      };
      
      input.click();
    });
  }
}

/**
 * Show a message dialog (native on desktop, alert on web)
 * 
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} kind - Dialog kind: 'info', 'warning', 'error' (desktop only)
 */
export async function showMessage(title, message, kind = 'info') {
  if (isDesktop()) {
    try {
      const modules = await loadTauriModules();
      if (!modules) throw new Error('Tauri modules not available');
      
      const { dialog } = modules;
      await dialog.message(message, { title, kind });
    } catch (error) {
      console.error('Desktop dialog error:', error);
      alert(`${title}\n\n${message}`);
    }
  } else {
    alert(`${title}\n\n${message}`);
  }
}

/**
 * Show a confirmation dialog
 * 
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @returns {Promise<boolean>} True if user confirmed
 */
export async function confirm(title, message) {
  if (isDesktop()) {
    try {
      const modules = await loadTauriModules();
      if (!modules) throw new Error('Tauri modules not available');
      
      const { dialog } = modules;
      const { confirm: tauriConfirm } = await import('@tauri-apps/plugin-dialog');
      return await tauriConfirm(message, { title, kind: 'warning' });
    } catch (error) {
      console.error('Desktop confirm error:', error);
      return window.confirm(`${title}\n\n${message}`);
    }
  } else {
    return window.confirm(`${title}\n\n${message}`);
  }
}

export default {
  isDesktop,
  saveFile,
  saveDataURL,
  openFile,
  showMessage,
  confirm
};
