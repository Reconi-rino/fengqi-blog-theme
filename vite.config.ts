import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 智能适配：GitHub Actions 自动读取仓库子路径，Vercel / 自定义域名 / 本地开发默认为根路径 '/'
const getBasePath = () => {
  if (process.env.BASE_PATH) return process.env.BASE_PATH;
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
    return `/${repoName}/`;
  }
  return '/';
};

// https://vite.dev/config/
export default defineConfig({
  base: getBasePath(),
  plugins: [
    react(),
    tailwindcss(),
  ],
})
