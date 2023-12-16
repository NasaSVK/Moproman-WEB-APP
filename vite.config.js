import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  build: {
    chunkSizeWarningLimit: 1600,
    outDir: '../../../../../inetpub/wwwroot/wdMopromanWebAPP2'
  },
  publicDir: './public'
})
