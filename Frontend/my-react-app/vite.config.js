import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In development the frontend runs on the same origin as Vite
      // (http://localhost:5173) and Vite forwards these routes to the
      // backend. This avoids CORS entirely while developing locally.
      // When VITE_API_URL is set (e.g. in production), requests go
      // directly to the backend instead and this proxy is not used.
      '/user': 'http://localhost:4000',
      '/project': 'http://localhost:4000',
      '/task': 'http://localhost:4000',
    },
  },
})