import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // 支持 GitHub Pages 子路径部署（通过环境变量或相对路径）
  base: process.env.BASE_PATH || './',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
