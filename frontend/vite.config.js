import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['datauri/parser.js', 'cloudinary', 'mongoose']
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
      }
    }
  }
})
