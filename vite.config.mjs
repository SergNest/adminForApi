import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [vue()],
  base: './',
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  },
  resolve: {
    alias: [
      { find: '@/',
        replacement: `${path.resolve(__dirname, 'src')}/`,
      },
      { find: '@',
        replacement: path.resolve(__dirname, '/src'),
      },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.scss'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://skarbapi.skarb.com.ua',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log(`🛠 Проксую: ${path} → ${path.replace(/^\/api/, '')}`)
          return path.replace(/^\/api/, '');
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
          })
        },
      },
    },
  },
})
