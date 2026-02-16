/**
 * Project Storage Abstraction Layer
 * 
 * Provides dual storage system:
 * - Auto-save: Internal project list (Tauri Store on desktop, localStorage on web)
 * - File-based: .gumdrop files that users can save/load/share
 */

import { isDesktop } from './desktop.js';

const STORAGE_KEY = 'gumdrop:projects';

// Lazy-load Tauri Store
let store = null;

async function getStore() {
  if (!isDesktop()) return null;
  
  if (!store) {
    const { Store } = await import('@tauri-apps/plugin-store');
    store = new Store('gumdrop-projects.json');
  }
  
  return store;
}

/**
 * List all auto-saved projects
 * 
 * @returns {Promise<Array>} Array of project metadata
 */
export async function listProjects() {
  if (isDesktop()) {
    try {
      const storeInstance = await getStore();
      const projects = await storeInstance.get(STORAGE_KEY);
      return projects || [];
    } catch (error) {
      console.error('Error listing projects:', error);
      return [];
    }
  } else {
    // Web: Use localStorage
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Error listing projects:', error);
      return [];
    }
  }
}

/**
 * Save/update a project in auto-save storage
 * 
 * @param {Object} project - Project data {id, name, updated, gridW, gridH, pixels, overlayPaths}
 * @returns {Promise<boolean>} True if saved successfully
 */
export async function saveProject(project) {
  try {
    const projects = await listProjects();
    
    // Find existing project by name or id
    const existingIndex = projects.findIndex(
      p => p.name === project.name || p.id === project.id
    );
    
    if (existingIndex >= 0) {
      // Update existing
      projects[existingIndex] = project;
    } else {
      // Add new
      projects.push(project);
    }
    
    if (isDesktop()) {
      const storeInstance = await getStore();
      await storeInstance.set(STORAGE_KEY, projects);
      await storeInstance.save();
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
    
    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    return false;
  }
}

/**
 * Load a project from auto-save storage
 * 
 * @param {string} idOrName - Project ID or name
 * @returns {Promise<Object|null>} Project data or null if not found
 */
export async function loadProject(idOrName) {
  try {
    const projects = await listProjects();
    return projects.find(p => p.id === idOrName || p.name === idOrName) || null;
  } catch (error) {
    console.error('Error loading project:', error);
    return null;
  }
}

/**
 * Delete a project from auto-save storage
 * 
 * @param {string} idOrName - Project ID or name
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteProject(idOrName) {
  try {
    const projects = await listProjects();
    const filtered = projects.filter(
      p => p.id !== idOrName && p.name !== idOrName
    );
    
    if (isDesktop()) {
      const storeInstance = await getStore();
      await storeInstance.set(STORAGE_KEY, filtered);
      await storeInstance.save();
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}

/**
 * Export project as JSON string (for .gumdrop files)
 * 
 * @param {Object} project - Project data
 * @returns {string} JSON string
 */
export function exportProjectJSON(project) {
  return JSON.stringify(project, null, 2);
}

/**
 * Import project from JSON string (from .gumdrop files)
 * 
 * @param {string} jsonString - JSON string
 * @returns {Object|null} Parsed project data or null if invalid
 */
export function importProjectJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate required fields
    if (!data.gridW || !data.gridH || !data.pixels) {
      throw new Error('Invalid project structure');
    }
    
    return data;
  } catch (error) {
    console.error('Error importing project:', error);
    return null;
  }
}

/**
 * Clear all auto-saved projects (for testing/reset)
 * 
 * @returns {Promise<boolean>} True if cleared successfully
 */
export async function clearAllProjects() {
  try {
    if (isDesktop()) {
      const storeInstance = await getStore();
      await storeInstance.set(STORAGE_KEY, []);
      await storeInstance.save();
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    return true;
  } catch (error) {
    console.error('Error clearing projects:', error);
    return false;
  }
}

export default {
  listProjects,
  saveProject,
  loadProject,
  deleteProject,
  exportProjectJSON,
  importProjectJSON,
  clearAllProjects
};
