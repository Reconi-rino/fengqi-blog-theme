import { Article, Photo, Project, NoteItem } from '../types';

export const ARTICLES_DATA: Article[] = [
  {
    id: 'art-1',
    slug: 'writing-in-the-wind',
    title: '在风里记录练习',
    subtitle: '风不是答案，只是让我慢下来的理由。',
    date: '2026.05.12',
    shortDate: '05.12',
    year: '2026',
    category: 'essay',
    readTime: '8 min read',
    excerpt: '有时候我会在风很轻的傍晚，带着小本子去公园坐一会儿。不为记录什么重要的事，只是让思绪慢慢沉下来，把当天的感受写成几行字。',
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop',
    likes: 42,
    content: [
      '有时候我会在风很轻的傍晚，带着小本子去公园坐一会儿。不为记录什么重要的事，只是让思绪慢慢沉下来，把当天的感受写成几行字。',
      '风吹过树梢的声音，像是一场微型的海潮。远处有小狗在草坪上追逐，近处有落叶打着旋儿落在膝盖上。在这种时刻，时间似乎流逝得格外缓慢。',
      '我们习惯了在各种屏幕和即时通知之间切换，大脑总处在一触即发的戒备状态中。但当纸面摊开，墨水慢慢渗入纤维，那种踏实的重力感又回来了。',
      '写作于我而言，从来不是输出观点的武器，而是一扇向内观察的窗户。风不是答案，它只是适时掠过，提醒我呼吸，提醒我停留。'
    ]
  },
  {
    id: 'art-2',
    slug: 'static-site-from-idea-to-launch',
    title: '静态站点：从想法到上线',
    subtitle: '记录一次搭建个人网站的过程与思考。',
    date: '2026.05.06',
    shortDate: '05.06',
    year: '2026',
    category: 'tech',
    readTime: '12 min read',
    excerpt: '记录一次使用现代化工具搭建个人网站的过程与思考。去除冗余的卡片与商业化模板，回归文本与留白。',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
    likes: 29,
    content: [
      '建站最初的动力，来自对目前主流“模板化”博客的疲惫。满屏的浮夸阴影、居中的大号 Hero Banner、五颜六色的徽章，让阅读本身变得充满侵略性。',
      '我想要的很简单：一个安静的、左侧锚定的、有留白和微弱呼吸感的个人刊物空间。',
      '在这套主题的设计中，我将主要注意力放在以下三件事上：',
      '1. 雾青与黛青的低饱和调色板，模仿清晨带有露水与雾气的空气感；',
      '2. 原位自体展开的索引系统（Expanding Index），取代生硬的抽屉遮罩；',
      '3. 轻量级的背景生态微交互，让页面不是静态的死物，而是偶尔有微风吹拂的庭院。'
    ]
  },
  {
    id: 'art-3',
    slug: 'spring-collection-folder',
    title: '春日收集夹',
    subtitle: '一些当下的片段，像落在纸上的小光点。',
    date: '2026.04.28',
    shortDate: '04.28',
    year: '2026',
    category: 'note',
    readTime: '5 min read',
    excerpt: '一些当下的片段，像落在纸上的小光点。路边的野蔷薇、窗台上的光斑、新泡的乌龙茶香。',
    coverImage: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=800&auto=format&fit=crop',
    likes: 38,
    content: [
      '四月下旬的阳光已经有了初夏的温度，但风依旧带着微凉的薄荷味。',
      '把这几周收集到的几个瞬间记在这里：',
      '· 巷口拐角处盛开的野蔷薇，香气淡淡地弥漫了半条街；',
      '· 下午三点落在木地板上的斜斜光斑，猫咪追逐着浮动的微尘；',
      '· 重新拾起手冲咖啡的研磨仪，听着豆子碎裂清脆的声音，心神安定。'
    ]
  },
  {
    id: 'art-4',
    slug: 'gentle-training-for-focus',
    title: '关于专注力的温柔训练',
    subtitle: '不是对抗分心，而是和注意力做朋友。',
    date: '2026.04.12',
    shortDate: '04.12',
    year: '2026',
    category: 'essay',
    readTime: '10 min read',
    excerpt: '不是对抗分心，而是和注意力做朋友。当你不再把走神当作敌人，专注反而会像潮水一样自然涌来。',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    likes: 56,
    content: [
      '过去我总觉得，专注是一种必须紧绷神经才能维持的意志力搏斗。一旦被手机震动打断，就会陷入深深的自责。',
      '后来读到一行字：“水流经石头时，从不与石头争辩，只是绕过去。”',
      '我们对待自己的注意力也是如此。察觉到走神的时候，不需要责备自己，只要像对待一只好奇跑开的小猫一样，轻轻把它抱回当前的事情上就好。'
    ]
  },
  {
    id: 'art-5',
    slug: 'my-writing-environment-checklist',
    title: '我的写作环境配置清单',
    subtitle: '从输入法到编辑器，提升写作幸福感的 7 个小设置。',
    date: '2026.03.30',
    shortDate: '03.30',
    year: '2026',
    category: 'tech',
    readTime: '7 min read',
    excerpt: '从输入法到编辑器，提升写作幸福感的 7 个小设置。字体、行高、留白与无干扰模式。',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
    likes: 34,
    content: [
      '工欲善其事，必先利其器。但这里的“器”，重点不在功能多么繁复，而在是否能创造一个让人愿意静坐写字的“场”。',
      '1. 字体选用：正文思源宋体 / 霞鹜文楷，字号 17px，行高 1.95，字间距微微加宽 0.02em；',
      '2. 背景色调：使用低饱和度的浅雾青 `#F3F6F4` 配合黛青文字 `#2F4B4D`，柔和不刺眼；',
      '3. 编辑器全屏无状态栏，隐藏所有多余的边栏与统计徽章；',
      '4. 键盘选用轻压力克数的静音轴，敲击时宛如落雨。'
    ]
  },
  {
    id: 'art-6',
    slug: 'reunion-with-myself-in-quietness',
    title: '在安静处，与自己重逢',
    subtitle: '有些日子，外界的声音太多，我们便容易丢失自己。',
    date: '2026.02.15',
    shortDate: '02.15',
    year: '2026',
    category: 'essay',
    readTime: '8 min read',
    excerpt: '有些日子，外界的声音太多，我们便容易丢失自己。于是，我开始学会退后半步，把注意力放回到呼吸、到感受、到那些微小而真实的瞬间。',
    coverImage: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=800&auto=format&fit=crop',
    likes: 67,
    content: [
      '有些日子，外界的声音太多，我们便容易丢失自己。于是，我开始学会退后半步，把注意力放回到呼吸、到感受、到那些微小而真实的瞬间。',
      '早晨的光在窗帘边缘慢慢铺开，空气里有一丝凉意。煮一杯温水，翻开一本喜欢的书，让时间变得缓慢而柔软。',
      '写作对我而言，是一次次温柔的整理。把混乱的念头写下来，让它们在文字里落地、停留，也被理解。',
      '我们不必成为很厉害的大人，也不必一直向前冲刺。允许自己偶尔停下来，好好吃饭，好好睡觉，好好生活。',
      '在安静处，与自己重逢。'
    ]
  },
  {
    id: 'art-7',
    slug: 'weight-of-light-photography',
    title: '摄影手记：光线的重量',
    subtitle: '清晨六点半的雾气里，抓取一瞬消逝的温柔。',
    date: '2025.11.20',
    shortDate: '11.20',
    year: '2025',
    category: 'essay',
    readTime: '6 min read',
    excerpt: '拿起相机不是为了记录宏大的奇迹，而是为了捕捉光线如何在树叶边缘折射出一圈金色的茸毛。',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    likes: 45,
    content: [
      '光线是有重量的。清晨的光很轻，像丝绸一样拂过地面的雾气；正午的光很沉，把阴影牢牢压在建筑脚下；黄昏的光最醇厚，带着蜜糖一样的粘稠感。',
      '透过 35mm 定焦镜头的取景框，我常常觉得世界被裁剪成了一副副私人的画作。那些路人匆匆走过的街角，在特定角度的光线下，呈现出令人驻足的静谧。'
    ]
  },
  {
    id: 'art-8',
    slug: 'subtraction-in-design',
    title: '设计的减法与呼吸感',
    subtitle: '少，但是更好。每一颗像素都要有其存在的理由。',
    date: '2025.09.18',
    shortDate: '09.18',
    year: '2025',
    category: 'essay',
    readTime: '9 min read',
    excerpt: '留白不是空白，而是给信息留下流动的通道。当把所有可有可无的装饰拿掉之后，真正重要的文字才能被听见。',
    coverImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop',
    likes: 51,
    content: [
      '现代 UI 设计往往充斥着过载的视觉刺激：五彩斑斓的渐变边框、层层叠叠的阴影卡片、随处可见的强调色。',
      '但在真实的纸质刊物中，最高级的美感往往来自对空白的掌控。留白不是浪费空间，而是让视线得以停顿、让思维得以延展的呼吸阀门。',
      '少，但是更好。'
    ]
  }
];

export const PHOTOS_DATA: Photo[] = [
  {
    id: 'p-1',
    title: '晨雾中的林道',
    description: '京都岚山清晨，水汽与第一缕阳光在竹林间交织。',
    location: 'Kyoto, Japan',
    date: '2026.04.18',
    year: '2026',
    camera: 'Leica M10-R',
    lens: 'Summilux-M 35mm f/1.4',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'p-2',
    title: '山间静水',
    description: '湖面平静如镜，远山如黛，微风吹起细小的涟漪。',
    location: 'Lake Yamanaka',
    date: '2026.03.22',
    year: '2026',
    camera: 'Fujifilm X-T5',
    lens: 'XF 23mm f/1.4 R LM WR',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'p-3',
    title: '雨后屋檐',
    description: '屋檐滴落的水珠，倒映着青苔与瓦片的苍翠。',
    location: 'Hangzhou, China',
    date: '2025.10.15',
    year: '2025',
    camera: 'Sony A7R V',
    lens: 'FE 50mm f/1.2 GM',
    imageUrl: 'https://images.unsplash.com/photo-1515260268569-9271009adfdb?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'p-4',
    title: '窗边的一束光',
    description: '午后茶室，阳光斜切进木质榻榻米，茶烟袅袅。',
    location: 'Kamakura',
    date: '2025.07.09',
    year: '2025',
    camera: 'Leica Q2',
    lens: 'Summilux 28mm f/1.7',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1000&auto=format&fit=crop'
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj-1',
    title: 'fengqi Theme',
    description: '安静柔和、带微互动背景生态的个人刊物式博客主题系统。',
    year: '2026',
    category: 'Design & Code',
    tags: ['React', 'TypeScript', 'Tailwind', 'Canvas'],
    link: '#',
    github: 'https://github.com',
    stars: 128
  },
  {
    id: 'proj-2',
    title: 'Whisper Note',
    description: '极简无干扰的个人灵感闪念记录小工具，支持本地离线存储与 Markdown 导出。',
    year: '2025',
    category: 'Product',
    tags: ['Tauri', 'Rust', 'Svelte'],
    link: '#',
    github: 'https://github.com',
    stars: 86
  },
  {
    id: 'proj-3',
    title: 'Misty Palette',
    description: '低饱和东方色彩提取工具，专为静音与阅读场景优化的调色方案生成器。',
    year: '2025',
    category: 'Design Tool',
    tags: ['Web Canvas', 'Color Science'],
    link: '#',
    github: 'https://github.com',
    stars: 64
  }
];

export const NOTES_DATA: NoteItem[] = [
  {
    id: 'note-1',
    date: '2026.05.18',
    time: '21:30',
    weather: '清爽微风 · 21°C',
    tag: '日常',
    content: '今天晚上散步的时候，听到草丛里有细细的虫鸣声。初夏的气息已经完全铺开了，风吹在脸上很舒服。'
  },
  {
    id: 'note-2',
    date: '2026.05.08',
    time: '14:20',
    weather: '阴天小雨 · 18°C',
    tag: '摘录',
    content: '“生活不在别处，就在每一个被温柔对待的片刻里。” —— 在旧书店里翻到的一句话，随手记在票据背面。'
  },
  {
    id: 'note-3',
    date: '2026.04.22',
    time: '08:45',
    weather: '晴朗 · 16°C',
    tag: '设计思考',
    content: '所谓留白，不是为了省事不画东西，而是克制住把所有东西塞满的欲望，让真正重要的事物能被看见。'
  },
  {
    id: 'note-4',
    date: '2026.04.05',
    time: '23:10',
    weather: '多云 · 14°C',
    tag: '随想',
    content: '写代码和写文章本质上很像：清晰的结构、干净的命名、恰到好处的修辞，都会让人感到身心舒畅。'
  }
];

export const BLOG_PROFILE = {
  name: '风栖',
  siteTitle: 'fengqi.',
  enSlogan: 'somewhere, still awake.',
  cnSlogan: '在字里行间，和世界轻轻相遇。',
  bio: [
    '这里记录一些关于生活、设计与思考的片段。',
    '喜欢安静地观察，也喜欢温柔地表达。'
  ],
  stats: {
    articles: 286,
    photos: 128,
    likes: 67,
    topics: 3
  },
  sections: [
    {
      id: 'writing',
      symbol: '○',
      enName: 'Writing',
      cnName: '书写与记录',
      desc: '文字记录、读书笔记、想法与感受',
      count: 28
    },
    {
      id: 'photography',
      symbol: '□',
      enName: 'Photography',
      cnName: '影像拾集',
      desc: '影像拾集、风景与生活碎片',
      count: 14
    },
    {
      id: 'projects',
      symbol: '+',
      enName: 'Projects',
      cnName: '项目与实验',
      desc: '一些小项目与实验性尝试',
      count: 7
    },
    {
      id: 'notes',
      symbol: '~',
      enName: 'Notes',
      cnName: '随记与想法',
      desc: '随记与摘录，未完成的思绪',
      count: 35
    }
  ]
};
