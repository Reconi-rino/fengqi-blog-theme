# fengqi.（风栖）个人博客系统 — 系统详细说明文档

> **课程作业提交信息**
> - **姓名**：狄伟嘉
> - **学号**：`2024214322`
> - **学校**：华中师范大学（Central China Normal University）
> - **项目名称**：`fengqi-blog-theme`（风栖个人刊物式静态博客系统）
> - **作业展示路由**：`/student`（可在页面页脚「作业信息 · 狄伟嘉」或右上角 `+` 展开索引中直接进入）

---

## 一、系统运行环境

### 1.1 开发与构建环境

| 环境项 | 推荐版本 / 要求 | 说明 |
| --- | --- | --- |
| 操作系统 | Windows 10/11、macOS 12+ 或主流 Linux 发行版 | 跨平台运行，无平台原生二进制依赖 |
| Node.js | `>= 18.0.0`（推荐 20 LTS 或更高版本） | 用于运行 Vite 开发服务器、TypeScript 编译器及构建脚本 |
| 包管理器 | `npm >= 9.0.0`（或 pnpm / yarn） | 项目附带 `package-lock.json` 锁定依赖树 |
| 构建工具 | Vite `6.1.0` + TypeScript `~5.7.2` | 负责 ESM 开发热更新、类型检查与生产环境分包打包 |

### 1.2 客户端浏览器运行环境

- **桌面端**：Chrome `>= 100`、Edge `>= 100`、Firefox `>= 100`、Safari `>= 16`
- **移动端**：iOS Safari `>= 16`、Android Chrome `>= 100`（响应式布局，适配手机/平板/桌面视口）
- **浏览器核心能力依赖**：
  - ES2020 模块与标准 DOM API
  - HTML5 Canvas 2D（背景微生态粒子引擎）
  - CSS Custom Properties（纸境主题动态切换）与 `backdrop-filter`（磨砂玻璃质感）
  - Web Crypto API（`SubtleCrypto`，用于里世界私密空间 AES-GCM 端到端解密）
  - View Transitions API（渐进增强：支持时呈现水彩圆形晕染过渡，不支持的浏览器自动平滑降级）

### 1.3 核心技术栈与依赖清单

来自 [package.json](package.json) 的核心生产与开发依赖：

| 类别 | 依赖包 | 版本 | 作用 |
| --- | --- | --- | --- |
| UI 框架 | `react` / `react-dom` | `^19.0.0` | 组件化视图渲染与状态管理 |
| 类型系统 | `typescript` | `~5.7.2` | 全项目静态类型检查与接口约束 |
| 样式引擎 | `tailwindcss` / `@tailwindcss/vite` | `^4.0.6` | 原子化样式与自定义纸境 CSS 变量 |
| 路由管理 | `wouter` | `^3.10.0` | 轻量级前端客户端路由与子路径 `base` 适配 |
| 动效引擎 | `framer-motion` | `^12.4.7` | 页面切换、卡片展开、雾感浮现与弹簧交互 |
| Markdown 解析 | `react-markdown` / `remark-gfm` / `rehype-raw` | `^10.1.0` / `^4.0.1` / `^7.0.0` | GFM 表格/任务列表、HTML 嵌入与自定义渲染 |
| 图表渲染 | `mermaid` | `^11.16.1` | Markdown 内嵌流程图/时序图客户端渲染 |
| 内容与配置解析 | `gray-matter` / `js-yaml` | `^4.0.3` / `^5.3.0` | 解析文章 Frontmatter 与全站 YAML 配置文件 |
| 图标与工具 | `lucide-react` / `clsx` / `tailwind-merge` | `^0.475.0` / `^2.1.1` / `^3.0.1` | 矢量图标与条件类名合并 |

### 1.4 本地运行与部署方式

1. **安装依赖**
   ```bash
   npm install
   ```
2. **启动本地开发服务器（热更新预览）**
   ```bash
   npm run dev
   ```
   默认访问 `http://localhost:5173`（课程作业信息页路径为 `http://localhost:5173/student`）。
3. **执行完整生产构建**
   ```bash
   npm run build
   ```
   构建流水线依次执行：`tsc`（类型校验）→ `vite build`（打包至 `dist/`）→ `node scripts/generate-rss.js`（生成 `public/feed.xml`）→ `node scripts/generate-routes.js`（为所有一级路由与文章页生成物理 `index.html` 与 `404.html`）。
4. **预览生产构建产物**
   ```bash
   npm run preview
   ```
5. **使用预编译归档包直接打开或部署**
   - 仓库根目录已提供离线预编译产物压缩包 `fengqi-blog-2024214322-diweijia-dist.zip`（由 `npm run build:offline` 生成）。
   - 该离线版采用相对路径、经典 IIFE 脚本包（无 `type="module"` CORS 限制）以及 `file://` 协议自动 Hash 路由回退，**解压后直接双击 `index.html` 即可在浏览器中完整浏览所有页面**；同时也可直接部署至 Nginx / Apache / `npx serve .` 等任意静态服务器。

---

## 二、系统总体架构与源代码目录

系统采用 **纯前端静态驱动 + 构建期内容编译 + SSG-Lite 路由预生成** 架构，无需独立后端数据库即可完成完整的内容展示、检索、订阅与加密私密空间功能。

```text
├── fengqi.config.yaml                 # 全局站点配置（站点标题、作者、板块、动效参数）
├── index.html                         # HTML 入口与字体引入
├── vite.config.ts                     # Vite 构建配置（含动态 BASE_PATH 适配）
├── tsconfig.json                      # TypeScript 编译配置
├── package.json                       # 依赖与构建脚本定义
├── content/                           # 内容数据层（纯 Markdown / YAML 文件）
│   ├── posts/*.md                     # 博客文章源文件（含 YAML Frontmatter）
│   ├── about.md / now.md              # 关于我 / 近况正文
│   ├── photos.yaml                    # 摄影画廊数据
│   ├── projects.yaml                  # 项目作品集数据
│   ├── notes.yaml                     # 随记时间线数据
│   └── elsewhere.yaml                 # 外部社交足迹数据
├── public/                            # 公共静态资源（含构建生成的 feed.xml 与加密数据）
├── scripts/                           # Node.js 构建辅助脚本
│   ├── generate-rss.js                # 静态 RSS 2.0 XML 自动生成脚本
│   ├── generate-routes.js             # SSG-Lite 实体路由目录与 404.html 生成脚本
│   └── encrypt.js                     # 里世界私密内容加密工具脚本（PBKDF2 + AES-GCM）
└── src/                               # 前端核心源代码
    ├── main.tsx                       # React 根挂载入口
    ├── App.tsx                        # 根组件、全局状态、路由表、纸境切换与快捷键监听
    ├── index.css                      # Tailwind v4 样式、纸境主题变量与宣纸肌理样式
    ├── types.ts                       # 全站共享 TypeScript 类型定义
    ├── utils/
    │   ├── contentLoader.ts           # 基于 import.meta.glob 的内容自动扫描与解析器
    │   ├── motion.ts                  # 缓动曲线、纸境预设、时段问候与 Markdown 标题提取
    │   ├── crypto.ts                  # 浏览器 Web Crypto API 加解密工具
    │   └── rssGenerator.ts            # 前端动态 RSS 2.0 XML 生成工具
    ├── data/
    │   └── mockData.ts                # 默认演示与兜底数据集
    └── components/
        ├── Header.tsx                 # 顶部导航栏、动态面包屑、纸境与微动效开关
        ├── ExpandingIndex.tsx         # 原位展开式悬浮索引纱幕导航
        ├── LandingView.tsx            # 首页展示视图（首屏、统计、精选文章、快捷入口）
        ├── WritingView.tsx            # 文章归档页（分类/标签/关键词搜索与多视图切换）
        ├── ArticleView.tsx            # 文章详情阅读页（目录大纲、进度条、禅意阅读模式）
        ├── MarkdownRenderer.tsx       # 增强型 Markdown 渲染器（代码高亮/Callout/Mermaid）
        ├── PhotographyView.tsx        # 影像画廊与灯箱预览视图
        ├── ProjectsView.tsx           # 项目作品集展示视图
        ├── NotesView.tsx              # 随记与碎片想法时间线视图
        ├── NowView.tsx                # 近况（/now）与外部足迹（/elsewhere）视图
        ├── StudentInfoView.tsx        # 课程作业与学生信息展示页（/student）
        ├── AboutModal.tsx             # 关于弹窗模态框
        ├── RssModal.tsx               # RSS 订阅源预览、复制与下载弹窗
        ├── AmbientCanvas.tsx          # Canvas 2D 背景微生态粒子物理引擎
        ├── WatercolorTransition.tsx   # 纸境切换水彩晕染过渡动画层
        ├── MistReveal.tsx             # 雾感渐现动效包装与标本角标组件
        ├── Motifs.tsx                 # 东方极简植物/几何矢量装饰图标集
        ├── ShadowWorld.tsx            # 里世界兼容包装组件
        └── inner/                     # 端到端加密「里世界 / 秘密基地」子系统
            ├── InnerWorld.tsx         # 里世界主容器与状态管理
            ├── PasswordGate.tsx       # 密语校验与解密入口
            ├── InnerAmbientCanvas.tsx # 暗色星尘背景 Canvas
            ├── InnerLanding.tsx       # 里世界首页
            ├── InnerWritingArchive.tsx / InnerWritingDetail.tsx # 私密文章列表与详情
            ├── InnerNotesArchive.tsx / InnerNoteDetail.tsx      # 私密随记列表与详情
            └── InnerStudio.tsx        # 浏览器端私密内容编辑器与加密导出工作台
```

---

## 三、系统功能说明

### 3.1 首页与微生态互动体验（`/`）
- **刊物式首屏与时段问候**：根据访问者本地时间自动切换「晨露微凉 / 日光初照 / 午风徐来 / 暮色温柔 / 夜深灯浅」双语问候。
- **背景微生态粒子系统**：页面底层低密度漂浮落叶、微气泡、细圆环与暖桃心形粒子；鼠标移动时会产生柔和排斥力场，点击页面空白处可轻触生成新粒子；按下键盘 `B` / `W` 键或点击页脚心形图标可触发全屏「起风了」微风彩蛋。
- **无障碍动效控制**：顶部导航栏提供「微动态 / 静息」一键开关，同时自动遵循系统 `prefers-reduced-motion` 偏好。

### 3.2 原位展开式索引与全局导航
- 点击右上角 `+` 按钮原地展开全屏雾感索引纱幕（`ExpandingIndex`），保留当前页面阅读进度不销毁上下文，按 `Esc` 键即可收起。
- 实时统计并展示四大核心板块（Writing、Photography、Projects、Notes）的实际内容数量，底部提供首页、关于、近况、足迹与课程作业信息页的快捷入口。
- 顶部导航栏根据当前所在路由动态切换轻面包屑指示，向下滚动后自动过渡为半透明磨砂顶栏。

### 3.3 三重纸境氛围切换
- 内置 **晨雾（Morning Mist）**、**暖宣（Warm Paper）**、**晴瓷（Pale Celadon）** 三套低饱和纸质色调预设。
- 点击右上角墨碟标牌或索引内纸境调色盘，从点击坐标向外触发水墨晕染扩散动画，并将偏好自动持久化至 `localStorage`。

### 3.4 文章归档与沉浸式阅读（`/writing`、`/writing/:slug`）
- **多维检索与浏览**：支持按分类（随笔/技术/笔记）、标签与关键词实时筛选文章，支持切换不同版式视图。
- **增强型 Markdown 排版**：支持 GFM 表格、任务列表、代码语言标识与一键复制、信息提示块（Callout）、图片说明及 Mermaid 流程图实时渲染。
- **阅读辅助体验**：自动解析文章 `h1~h3` 标题生成悬浮目录大纲并支持平滑跳转；顶部显示阅读进度条；支持一键切换「禅意阅读模式（Zen Mode）」，淡化导航与背景粒子以专注正文；文末提供上一篇/下一篇连续阅读导航。

### 3.5 影像画廊、项目作品集与随记（`/photography`、`/projects`、`/notes`）
- **影像画廊**：展示摄影作品与拍摄器材参数（相机、镜头、地点、日期），支持点击放大灯箱浏览。
- **项目作品集**：卡片化展示个人项目、年份、技术标签与外链/GitHub 入口。
- **随记时间线**：记录短句、天气与灵感碎片，按时间流呈现。

### 3.6 个人信息与课程作业展示页（`/student`）
- 专为 Web 课程作业提交设计，集中展示作者姓名（**狄伟嘉**）、学号（**2024214322**）、学校（**华中师范大学**）以及系统技术栈说明与站内快捷导航。
- 在全站页脚及展开式索引中均设置了直达入口，并已纳入静态路由预生成清单（`dist/student/index.html`）。

### 3.7 关于、近况、外部足迹与 RSS 2.0 订阅
- `/about`（弹窗/路由）、`/now`（近况页面）与 `/elsewhere`（外部社交足迹）全部由 `content/` 下的 Markdown 与 YAML 文件驱动。
- 提供标准 RSS 2.0 订阅支持：构建期自动生成静态 `/feed.xml`，前端 `RssModal` 亦支持实时预览、复制订阅地址与下载 XML 文件。

### 3.8 端到端加密「里世界 / 秘密基地」
- 通过连续点击站点 Logo 末尾的句点 `.` 三次，或在非输入状态下键入暗号 `secret` / `base` 唤起。
- 采用客户端零知识加密架构，输入正确密语后在浏览器本地解密展示私密文章与私密随记，并内置 `InnerStudio` 工作台支持本地编辑后重新加密导出。

---

## 四、核心技术实现

### 4.1 零后端内容驱动管线（Vite Glob + Frontmatter/YAML）
在 [src/utils/contentLoader.ts](src/utils/contentLoader.ts) 中，利用 Vite 构建期的 `import.meta.glob` 静态分析能力，在打包阶段将 `fengqi.config.yaml` 以及 `content/` 目录下的所有 `.md`、`.yaml` 文件直接编译内联为前端模块：
- 使用 `gray-matter` 解析每篇 Markdown 文章头部的元数据（标题、日期、分类、标签、摘要、阅读时长、自定义 `slug`）与正文内容；
- 使用 `js-yaml` 解析站点配置、摄影、项目、随记与外部足迹列表；
- 当某类内容为空时，自动回退至 [src/data/mockData.ts](src/data/mockData.ts) 中的示例数据，保证系统稳定可用。

### 4.2 前端路由与 SSG-Lite 物理路由预生成
- **动态根路径适配**：[vite.config.ts](vite.config.ts) 中的 `getBasePath()` 根据环境变量 `BASE_PATH` 或 `GITHUB_REPOSITORY` 自动计算构建前缀（本地与自定义域名默认为 `/`），[src/App.tsx](src/App.tsx) 将 `import.meta.env.BASE_URL` 透传给 `wouter` 的 `<Router base={...}>`。
- **解决静态托管刷新 404 问题**：构建脚本 [scripts/generate-routes.js](scripts/generate-routes.js) 在 `vite build` 之后自动扫描所有静态一级路由（`writing`、`photography`、`projects`、`notes`、`about`、`now`、`elsewhere`、`student`）及 `content/posts/*.md` 中的文章 `slug`，在 `dist/` 下逐一生成对应的物理目录与 `index.html`，并生成 `dist/404.html` 兜底，确保直接访问或刷新任意深层 URL 均可正常返回 HTTP 200 并由前端路由接管。

### 4.3 Canvas 2D 背景微生态粒子物理引擎
[src/components/AmbientCanvas.tsx](src/components/AmbientCanvas.tsx) 基于 HTML5 Canvas 2D 与 `requestAnimationFrame` 实现轻量级粒子模拟：
- 按设备 `devicePixelRatio` 缩放画布像素尺寸，保证高分屏下图形边缘清晰锐利；
- 每个粒子维护位置、速度、旋转角、正弦摆动相位与生命周期（淡入→稳态→淡出），并在 `repulsion_radius` 范围内对鼠标坐标施加平滑径向斥力；
- 通过 `useImperativeHandle` 向父组件暴露 `triggerBreeze()`（全屏风场冲量）与 `spawnPigmentBloom()`（纸境切换水墨晕染粒子爆发）方法，兼顾渲染性能与交互解耦。

### 4.4 纸境主题与 View Transitions API 水彩晕染过渡
- 在 [src/index.css](src/index.css) 中通过根节点 `[data-atmosphere="mist" | "warm" | "celadon"]` 定义多套语义化 CSS 变量（背景渐变、卡片底色、顶栏磨砂色、纱幕遮罩色）。
- 切换主题时，[src/App.tsx](src/App.tsx) 记录点击事件坐标 `(x, y)`，计算到视口最远顶点的欧氏距离作为扩散半径 `endRadius`，调用 `document.startViewTransition` 配合 `flushSync` 同步更新 DOM 属性，再对 `::view-transition-new(root)` 伪元素施加 `clipPath: circle(0px -> endRadius)` 关键帧动画，并叠加 [src/components/WatercolorTransition.tsx](src/components/WatercolorTransition.tsx) 的湿边晕染层，实现自然的水彩渗化效果。

### 4.5 Web Crypto API 客户端零知识加密
[src/utils/crypto.ts](src/utils/crypto.ts) 与 [scripts/encrypt.js](scripts/encrypt.js) 共同实现前后端一致的对称加密协议：
- **密钥派生**：基于用户输入的明文密语与随机盐值（Salt），使用 `PBKDF2-SHA256` 高迭代次数派生 256 位 AES 密钥；
- **认证加密**：采用 `AES-256-GCM` 算法配合随机初始化向量（IV）对 JSON 数据进行加密与完整性校验；
- 密文与 Salt/IV 打包为静态 JSON 文件存放于 `public/`，密钥永不落盘、永不上传，全部解密计算均在浏览器内存中完成。

### 4.6 自动化构建与持续部署
- 本地通过 `npm run build` 一键串联类型检查、代码压缩分包、RSS 生成与静态路由目录生成。
- 仓库内置 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)，推送代码至 `main` 分支后可由 GitHub Actions 自动完成安装、构建并部署至 GitHub Pages。
