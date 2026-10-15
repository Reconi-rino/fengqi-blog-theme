import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. 读取配置文件
const configPath = path.resolve(rootDir, 'fengqi.config.yaml');
let config = {};
try {
  const configRaw = fs.readFileSync(configPath, 'utf8');
  config = yaml.load(configRaw) || {};
} catch (e) {
  console.warn('⚠️ 未找到或无法解析 fengqi.config.yaml，使用默认配置');
}

const siteTitle = config.site?.title || 'fengqi.';
const subtitleEn = config.site?.subtitle_en || 'somewhere, still awake.';
const siteAuthor = config.site?.author || '风栖';
const siteDesc = config.site?.description || '一个安静、柔和、带微互动的个人刊物式博客空间';

// 确定部署域名 / Base URL
let siteUrl = process.env.SITE_URL || config.site?.url || '';
if (!siteUrl && process.env.GITHUB_REPOSITORY) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  siteUrl = `https://${owner}.github.io/${repo}`;
}
siteUrl = siteUrl.replace(/\/$/, '');

// 2. 遍历 content/posts/ 或 content/articles/ 下的所有 Markdown 文件
const postsDir = fs.existsSync(path.resolve(rootDir, 'content/posts'))
  ? path.resolve(rootDir, 'content/posts')
  : path.resolve(rootDir, 'content/articles');
const articles = [];

if (fs.existsSync(postsDir)) {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const contentRaw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(contentRaw);
    const slug = file.replace(/\.md$/, '');
    articles.push({
      slug,
      title: parsed.data.title || slug,
      date: parsed.data.date || '2026.01.01',
      category: parsed.data.category || '随笔',
      excerpt: parsed.data.excerpt || parsed.data.subtitle || '',
      content: parsed.content,
    });
  }
}

// 按日期倒序排列
articles.sort((a, b) => new Date(b.date.replace(/\./g, '-')).getTime() - new Date(a.date.replace(/\./g, '-')).getTime());

const now = new Date().toUTCString();

const escapeXml = (unsafe) =>
  String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const itemsXml = articles
  .map((art) => {
    const articleUrl = siteUrl ? `${siteUrl}/writing/${art.slug}` : `/writing/${art.slug}`;
    const pubDate = new Date(art.date.replace(/\./g, '-')).toUTCString();
    return `    <item>
      <title>${escapeXml(art.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(art.category)}</category>
      <description>${escapeXml(art.excerpt)}</description>
      <content:encoded><![CDATA[${art.content}]]></content:encoded>
    </item>`;
  })
  .join('\n');

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)} — ${escapeXml(subtitleEn)}</title>
    <link>${siteUrl || '/'}</link>
    <description>${escapeXml(siteDesc)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl ? siteUrl + '/feed.xml' : '/feed.xml'}" rel="self" type="application/rss+xml"/>
    <managingEditor>${escapeXml(siteAuthor)}</managingEditor>
    <webMaster>${escapeXml(siteAuthor)}</webMaster>
${itemsXml}
  </channel>
</rss>
`;

// 写入 public/feed.xml
const publicFeedPath = path.resolve(rootDir, 'public/feed.xml');
fs.writeFileSync(publicFeedPath, rssXml, 'utf8');

// 如果 dist 目录存在，同时写入 dist/feed.xml
const distFeedPath = path.resolve(rootDir, 'dist/feed.xml');
if (fs.existsSync(path.resolve(rootDir, 'dist'))) {
  fs.writeFileSync(distFeedPath, rssXml, 'utf8');
}

console.log(`✓ 动态 RSS Feed 生成成功 -> public/feed.xml (共 ${articles.length} 篇文章)`);
