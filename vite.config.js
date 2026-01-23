import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/windows_laptop/',
  plugins: [react()],
  server: {
    headers: {
      'Content-Type': 'application/wasm'
    }
  }
})
