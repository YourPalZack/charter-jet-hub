import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/charter-jet-hub/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  }
}) 