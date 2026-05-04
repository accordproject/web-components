import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  optimizeDeps: {
    include: ['@accordproject/concerto-cto', '@accordproject/concerto-core'],
  },
  server: {
    port: 3001,
  },
});
