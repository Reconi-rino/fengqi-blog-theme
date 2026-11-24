/**
 * 动效曲线、纸境氛围预设与文章目录解析工具模块
 * 统一管理全站 Framer Motion 缓动参数、三大纸境配色主题、时段问候语及 Markdown 标题提取。
 */

// 全站默认柔和缓出贝塞尔曲线（雾感渐入）
export const MIST_EASE = [0.22, 1, 0.36, 1] as const;

// 柔和弹簧物理参数（用于图标旋转与微交互）
export const GENTLE_SPRING = {
  type: 'spring' as const,
  stiffness: 220,
  damping: 28,
  mass: 0.9,
};

// 紧凑型胶囊切换弹簧参数
export const PILL_SPRING = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 32,
};

// 纸境色调模式：晨雾 / 暖宣 / 晴瓷
export type AtmosphereMode = 'mist' | 'warm' | 'celadon';

// 纸境色调元数据定义
export interface AtmospherePreset {
  id: AtmosphereMode;
  name: string;
  enName: string;
  desc: string;
  swatchPrimary: string;
  swatchAccent: string;
}

// 三套内置纸境主题预设（与 src/index.css 中的 data-atmosphere CSS 变量对应）
export const ATMOSPHERE_PRESETS: AtmospherePreset[] = [
  {
    id: 'mist',
    name: '晨雾',
    enName: 'Morning Mist',
    desc: '经典雾白与浅雾青，保持最初的清晨呼吸感',
    swatchPrimary: '#F3F6F4',
    swatchAccent: '#A7CFC3',
  },
  {
    id: 'warm',
    name: '暖宣',
    enName: 'Warm Paper',
    desc: '温润米白宣纸质感，搭配柔和杏桃微光',
    swatchPrimary: '#F7F3EB',
    swatchAccent: '#E8B48C',
  },
  {
    id: 'celadon',
    name: '晴瓷',
    enName: 'Pale Celadon',
    desc: '雨后天青般的浅青瓷底色，清透澄明',
    swatchPrimary: '#EDF4F2',
    swatchAccent: '#8AB8AD',
  },
];

// 根据用户本地时间段返回对应的中英文氛围问候语
export function getTimeGreeting(): { cn: string; en: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) {
    return { cn: '晨露微凉', en: 'early morning mist' };
  }
  if (hour >= 9 && hour < 12) {
    return { cn: '日光初照', en: 'morning light' };
  }
  if (hour >= 12 && hour < 17) {
    return { cn: '午风徐来', en: 'afternoon breeze' };
  }
  if (hour >= 17 && hour < 20) {
    return { cn: '暮色温柔', en: 'dusk horizon' };
  }
  return { cn: '夜深灯浅', en: 'still awake' };
}

// 文章目录条目结构
export interface HeadingItem {
  id: string;
  level: 1 | 2 | 3;
  text: string;
}

// 将标题文本规范化为 URL 安全的锚点 slug（保留中文字符与字母数字）
export function slugifyHeadingText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_~[\]()]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
}

// 从 Markdown 正文安全解析 h1/h2/h3 标题（自动跳过围栏代码块）
export function extractHeadings(markdown: string): HeadingItem[] {
  const lines = markdown.split(/\r?\n/);
  const headings: HeadingItem[] = [];
  const counts = new Map<string, number>();
  let inCodeFence = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(`{3,}|~{3,})/.test(trimmed)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{1,3})\s+(.+?)\s*#*$/.exec(trimmed);
    if (match) {
      const level = match[1].length as 1 | 2 | 3;
      const rawText = match[2]
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[`*_~]/g, '')
        .trim();

      if (!rawText) continue;

      const baseSlug = slugifyHeadingText(rawText);
      const seen = counts.get(baseSlug) || 0;
      counts.set(baseSlug, seen + 1);
      const id = seen === 0 ? `h-${baseSlug}` : `h-${baseSlug}-${seen}`;

      headings.push({ id, level, text: rawText });
    }
  }

  return headings;
}
