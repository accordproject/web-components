import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [nodePolyfills(), react()],
  resolve: {
    alias: {
      // Point directly at source for hot-reload during development
      '@accordproject/ui-tiptap-template-editor': path.resolve(
        __dirname,
        '../ui-tiptap-template-editor/src/index.ts'
      ),
    },
  },
  optimizeDeps: {
    needsInterop: [
      '@accordproject/markdown-transform',
      '@accordproject/markdown-template',
      '@accordproject/concerto-core',
    ],
  },
  server: {
    port: 5174,
  },
});
