import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    // Add this line below to ignore Playwright files
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/tests/**'],
  },
});