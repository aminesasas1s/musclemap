import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5175',
      '/uploads': 'http://localhost:5175',
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libs — cached long-term
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Charts — heavy, rarely changes
          'vendor-charts': ['recharts'],
          // Animations — separate so pages load without waiting for it
          'vendor-motion': ['framer-motion'],
          // Icons — large set, cache independently
          'vendor-icons': ['lucide-react'],
          // Body map SVG library — only needed on the body map page
          'vendor-bodymap': ['react-body-highlighter'],
        }
      }
    }
  }
})

