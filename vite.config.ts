import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 智能适配：GitHub Actions 自动读取仓库子路径，Vercel / 自定义域名 / 本地开发默认为根路径 '/'
const getBasePath = (isOffline: boolean) => {
  if (isOffline) {
    return './';
  }
  if (process.env.BASE_PATH) {
    const bp = process.env.BASE_PATH;
    return bp.endsWith('/') ? bp : `${bp}/`;
  }
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
    return `/${repoName}/`;
  }
  return '/';
};

// 离线构建插件：移除 type="module" 与 crossorigin 属性，确保双击本地 index.html（file://）无 CORS 拦截
const offlineFileProtocolPlugin = (): Plugin => ({
  name: 'offline-file-protocol',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      return html
        .replace(/<script\s+type="module"\s+crossorigin\s+src="([^"]+)"><\/script>/g, '<script defer src="$1"></script>')
        .replace(/<link\s+rel="stylesheet"\s+crossorigin\s+href="([^"]+)">/g, '<link rel="stylesheet" href="$1">')
        .replace(/href="\/feed\.xml"/g, 'href="./feed.xml"');
    },
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isOffline = mode === 'offline' || process.env.OFFLINE_BUILD === 'true';

  return {
    base: getBasePath(isOffline),
    plugins: [
      react(),
      tailwindcss(),
      ...(isOffline ? [offlineFileProtocolPlugin()] : []),
    ],
    ...(isOffline
      ? {
          build: {
            cssCodeSplit: false,
            rollupOptions: {
              output: {
                format: 'iife',
                inlineDynamicImports: true,
                entryFileNames: 'assets/app.js',
                assetFileNames: 'assets/[name][extname]',
              },
            },
          },
        }
      : {}),
  };
})
