import * as yaml from 'js-yaml';
import { Article, Photo, Project, NoteItem, ArticleCategory } from '../types';

export interface SiteConfig {
  site: {
    title: string;
    author: string;
    subtitle_en: string;
    subtitle_cn: string;
    description: string;
    footer_text: string;
    copyright_year: string;
  };
  profile: {
    bio: string[];
    quote: string;
    stats: {
      articles: number;
      photos: number;
      likes: number;
      topics: number;
    };
  };
  sections: Array<{
    id: string;
    symbol: string;
    enName: string;
    cnName: string;
    desc: string;
    count: number;
  }>;
  motion: {
    default_reduced: boolean;
    repulsion_radius: number;
    max_ambient_particles: number;
  };
}

export interface ElsewhereItem {
  name: string;
  desc: string;
  link: string;
  tag: string;
}

// 解析 Markdown Frontmatter
export function parseFrontmatter(rawContent: string) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (match) {
    try {
      const frontmatter = (yaml.load(match[1]) as Record<string, any>) || {};
      const content = match[2];
      return { frontmatter, content };
    } catch (e) {
      console.error('Error parsing frontmatter:', e);
      return { frontmatter: {}, content: rawContent };
    }
  }
  return { frontmatter: {}, content: rawContent };
}

// 1. 加载全局配置文件 fengqi.config.yaml
const configFiles = import.meta.glob<string>('/fengqi.config.yaml', { query: '?raw', eager: true, import: 'default' });
let loadedConfig: SiteConfig;

try {
  const rawConfig = Object.values(configFiles)[0];
  loadedConfig = yaml.load(rawConfig) as SiteConfig;
} catch (e) {
  console.warn('Could not load fengqi.config.yaml, using defaults', e);
  loadedConfig = {
    site: {
      title: 'fengqi.',
      author: '风栖',
      subtitle_en: 'somewhere, still awake.',
      subtitle_cn: '在字里行间，和世界轻轻相遇。',
      description: '一个安静、柔和、带微互动的个人刊物式博客空间',
      footer_text: 'quiet personal editorial space',
      copyright_year: '2026',
    },
    profile: {
      bio: ['这里记录一些关于生活、设计与思考的片段。', '喜欢安静地观察，也喜欢温柔地表达。'],
      quote: '“清风徐来，水波不兴。记录一些想法与日常。愿你在此，停留片刻。”',
      stats: { articles: 286, photos: 128, likes: 67, topics: 3 },
    },
    sections: [
      { id: 'writing', symbol: '○', enName: 'Writing', cnName: '书写与记录', desc: '文字记录、读书笔记、想法与感受', count: 28 },
      { id: 'photography', symbol: '□', enName: 'Photography', cnName: '影像拾集', desc: '影像拾集、风景与生活碎片', count: 14 },
      { id: 'projects', symbol: '+', enName: 'Projects', cnName: '项目与实验', desc: '一些小项目与实验性尝试', count: 7 },
      { id: 'notes', symbol: '~', enName: 'Notes', cnName: '随记与想法', desc: '随记与摘录，未完成的思绪', count: 35 },
    ],
    motion: { default_reduced: false, repulsion_radius: 110, max_ambient_particles: 8 },
  };
}

export const siteConfig = loadedConfig;

// 2. 动态加载 content/posts/*.md 文章
const postFiles = import.meta.glob<string>('/content/posts/*.md', { query: '?raw', eager: true, import: 'default' });
const loadedArticles: Article[] = [];

for (const [path, raw] of Object.entries(postFiles)) {
  const { frontmatter, content } = parseFrontmatter(raw);
  const slug = path.split('/').pop()?.replace('.md', '') || 'article';
  
  // 提取首个摘要段落
  const firstParagraph = content
    .split('\n')
    .map(s => s.trim())
    .find(s => s && !s.startsWith('#') && !s.startsWith('>') && !s.startsWith('-') && !s.startsWith('```')) || '';

  loadedArticles.push({
    id: frontmatter.id || slug,
    slug: frontmatter.slug || slug,
    title: frontmatter.title || '未命名文章',
    subtitle: frontmatter.subtitle || '',
    date: frontmatter.date || '2026.01.01',
    shortDate: frontmatter.shortDate || (frontmatter.date ? String(frontmatter.date).slice(5) : '01.01'),
    year: frontmatter.year || (frontmatter.date ? String(frontmatter.date).slice(0, 4) : '2026'),
    category: (frontmatter.category as ArticleCategory) || 'essay',
    readTime: frontmatter.readTime || '5 min read',
    excerpt: frontmatter.excerpt || firstParagraph || '暂无摘要',
    content: [content], // 保存完整 Markdown 内容
    coverImage: frontmatter.coverImage,
    likes: frontmatter.likes || 12,
  });
}

// 按日期倒序排列
loadedArticles.sort((a, b) => (b.date > a.date ? 1 : -1));

export const allArticles = loadedArticles;

// 3. 动态加载 content/photos.yaml
const photoFiles = import.meta.glob<string>('/content/photos.yaml', { query: '?raw', eager: true, import: 'default' });
export const allPhotos: Photo[] = Object.values(photoFiles).length > 0
  ? ((yaml.load(Object.values(photoFiles)[0]) as Photo[]) || [])
  : [];

// 4. 动态加载 content/projects.yaml
const projectFiles = import.meta.glob<string>('/content/projects.yaml', { query: '?raw', eager: true, import: 'default' });
export const allProjects: Project[] = Object.values(projectFiles).length > 0
  ? ((yaml.load(Object.values(projectFiles)[0]) as Project[]) || [])
  : [];

// 5. 动态加载 content/notes.yaml
const noteFiles = import.meta.glob<string>('/content/notes.yaml', { query: '?raw', eager: true, import: 'default' });
export const allNotes: NoteItem[] = Object.values(noteFiles).length > 0
  ? ((yaml.load(Object.values(noteFiles)[0]) as NoteItem[]) || [])
  : [];

// 6. 动态加载 content/about.md 与 content/now.md
const aboutFiles = import.meta.glob<string>('/content/about.md', { query: '?raw', eager: true, import: 'default' });
export const rawAboutMarkdown = Object.values(aboutFiles).length > 0
  ? parseFrontmatter(Object.values(aboutFiles)[0]).content
  : '';

const nowFiles = import.meta.glob<string>('/content/now.md', { query: '?raw', eager: true, import: 'default' });
export const rawNowMarkdown = Object.values(nowFiles).length > 0
  ? parseFrontmatter(Object.values(nowFiles)[0]).content
  : '';

// 7. 动态加载 content/elsewhere.yaml
const elsewhereFiles = import.meta.glob<string>('/content/elsewhere.yaml', { query: '?raw', eager: true, import: 'default' });
export const allElsewhere: ElsewhereItem[] = Object.values(elsewhereFiles).length > 0
  ? ((yaml.load(Object.values(elsewhereFiles)[0]) as ElsewhereItem[]) || [])
  : [];
