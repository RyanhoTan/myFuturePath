import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from /myFuturePath/.
  // Keep the default root path for local development.
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
})
