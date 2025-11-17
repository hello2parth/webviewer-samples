import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3010,
    open: true,
    headers: {
      // Required for WebAssembly Threads (WebComponent mode)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    proxy: {
      '/egnyte-api': {
        target: 'https://sandboxserver.qa-egnyte.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/egnyte-api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // TODO: Update these cookies with fresh session cookies from your browser
            proxyReq.setHeader('Cookie', 'bid=b4641ed0-38f9-46ba-a7e4-b3a9cd153eeb; ext_name=ojplmecpdpgccookcobabopnaifgidhf; JSESSIONID=6FA430356C64A0D354CAE3B4219587FD; egnyteSubdomain=sandboxserver; logGALoginEventForSimpleUI=true; recentWg=sandboxserver');
          });
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: '/setupTests.js',
  },
  build: {
    outDir: 'build',
  }
});
