export type ViewMode = 
  | 'landing' 
  | 'writing' 
  | 'article' 
  | 'photography' 
  | 'projects' 
  | 'notes' 
  | 'about' 
  | 'now' 
  | 'elsewhere';

export type ArticleCategory = 'essay' | 'tech' | 'note';

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // e.g. "2026.05.12"
  shortDate: string; // e.g. "05.12"
  year: string; // e.g. "2026"
  category: ArticleCategory;
  readTime: string; // e.g. "8 min read"
  excerpt: string;
  content: string[];
  coverImage?: string;
  likes: number;
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
