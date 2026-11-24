/**
 * 全站共享 TypeScript 类型定义
 * 涵盖视图路由枚举、文章/摄影/项目/随记内容实体以及背景微生态粒子数据结构。
 */

// 站点主视图路由标识
export type ViewMode = 
  | 'landing' 
  | 'writing' 
  | 'article' 
  | 'photography' 
  | 'projects' 
  | 'notes' 
  | 'about' 
  | 'now' 
  | 'elsewhere'
  | 'student';

// 文章分类枚举：随笔 / 技术 / 笔记
export type ArticleCategory = 'essay' | 'tech' | 'note';

// 文章数据结构（由 content/posts/*.md Frontmatter 与正文解析生成）
export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // e.g. "2026.05.12"
  shortDate: string; // e.g. "05.12"
  year: string; // e.g. "2026"
  category: ArticleCategory;
  tags?: string[]; // 标签体系，例如 ["C", "嵌入式", "学习笔记"]
  readTime: string; // e.g. "8 min read"
  excerpt: string;
  content: string[];
  coverImage?: string;
  likes?: number;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  year: string;
  camera: string;
  lens: string;
  imageUrl: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
  tags: string[];
  link?: string;
  github?: string;
  stars?: number;
}

export interface NoteItem {
  id: string;
  date: string;
  time: string;
  weather?: string;
  content: string;
  tag?: string;
}

export type ParticleKind = 'bubble' | 'leaf' | 'circle' | 'dot' | 'square' | 'heart';

export interface AmbientParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  kind: ParticleKind;
  color: string;
  alpha: number;
  maxAlpha: number;
  rotation: number;
  rotSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmplitude: number;
  life: number;
  maxLife: number;
}
