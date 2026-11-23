import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const postsDir = path.join(rootDir, 'content/posts');

function generateRoutes() {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ dist/index.html not found. Please run vite build first.');
    process.exit(1);
  }

  const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

  // 1. 核心一级板块路由
  const staticRoutes = [
    'writing',
    'photography',
    'projects',
    'notes',
    'about',
    'now',
    'elsewhere',
    'student',
  ];

  // 2. 动态扫描所有 Markdown 文章 Slug
  const articleSlugs = [];
  if (fs.existsSync(postsDir)) {
    const postFiles = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
    for (const file of postFiles) {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const slugMatch = raw.match(/^slug:\s*["']?([^"'\n\r]+)["']?/m);
      const slug = slugMatch ? slugMatch[1].trim() : file.replace('.md', '');
      articleSlugs.push(slug);
    }
  }

  const allRoutePaths = [
    ...staticRoutes.map((r) => [r]),
    ...articleSlugs.map((slug) => ['writing', slug]),
  ];

  let createdCount = 0;

  for (const segments of allRoutePaths) {
    const targetDir = path.join(distDir, ...segments);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtmlContent, 'utf8');
    createdCount++;
  }

  // 3. 兜底生成 dist/404.html
  fs.writeFileSync(path.join(distDir, '404.html'), indexHtmlContent, 'utf8');

  console.log(`✓ SSG-Lite 实体路由目录生成成功: 共生成 ${createdCount} 个物理页面与 404.html 兜底`);
}

generateRoutes();
