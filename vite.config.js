import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isTauri = process.env.TAURI_ENV_PLATFORM !== undefined;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1234,
    open: !isTauri // Don't auto-open browser when running in Tauri
  },
  // Prevent Vite from clearing the terminal in Tauri dev mode
  clearScreen: !isTauri
});
