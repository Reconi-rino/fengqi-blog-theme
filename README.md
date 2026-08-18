# 🍃 fengqi. (风栖) — 个人博客主题系统

> **"在记录中，慢慢呼吸。"**  
> 一套含蓄、自然、有呼吸感的高质感个人独立博客主题系统。专为写作者、摄影爱好者、独立思考者设计。

[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-a7cfc3.svg?style=flat-square)](./LICENSE)

---

## ✨ 设计理念与美学特色

1. **水彩雾感低饱和色系**：
   - 雾白（`#F3F6F4`）、浅雾青（`#E6EDEB`）、黛青（`#2F4B4D`）、薄荷绿（`#A7CFC3`）与暖桃（`#F6DCCB`）。
2. **东方文气排版体系**：
   - 中文正文采用思源宋体（Source Han Serif）与霞鹜文楷（LXGW WenKai），行距定格在 `1.95` 的舒适慢阅读区间；
   - 英文与元信息采用无衬线 `Inter`。
3. **微生态粒子微交互**：
   - 背景低密度自然悬浮粒子（落叶、小气泡、几何环与暖桃心形），支持鼠标避让斥力物理、空白处点触生成与「起风了」全屏微风彩蛋。
4. **原位自体展开式索引**：
   - 摒弃突兀的侧边抽屉与浮层弹窗，点击右上角 `+` 按钮原地丝滑变形为呼吸感卡片。
5. **高度可分发配置架构**：
   - **零代码门槛**：全站所有作者信息、分类、语录、外链、动效偏好均通过根目录 `fengqi.config.yaml` 驱动；
   - **Markdown 原生支持**：支持 YAML Frontmatter、浅色代码块高亮、半透明磨砂 Callout、Mermaid 流程图、HTML 嵌入与数学公式。

---

## 🗂️ 目录结构

```text
├── fengqi.config.yaml       # 🛠️ 站点总配置文件（个人信息、板块映射、动效偏好）
├── DEPLOYMENT.md            # 🚀 完整多平台部署教程 (Vercel / GitHub Pages / Cloudflare)
├── content/                 # 📝 内容数据目录（开箱即用，纯 Markdown / YAML）
│   ├── posts/               # 文章目录 (*.md)
│   ├── about.md             # 关于我正文 (Markdown)
│   ├── now.md               # 近况页面正文 (Markdown)
│   ├── photos.yaml          # 摄影作品列表
│   ├── projects.yaml        # 项目作品集
│   ├── notes.yaml           # 短随记与碎片想法
│   └── elsewhere.yaml       # 外部社交足迹
├── public/                  # 🌐 静态资源
│   ├── feed.xml             # 预渲染静态 RSS Feed
│   └── favicon.svg          # 站点图标
├── src/                     # 💻 主题核心源码 (React 19 + TypeScript + Tailwind v4)
├── .github/workflows/       # 🤖 GitHub Actions 自动化部署工作流
├── package.json
└── README.md
```

---

## 🚀 快速上手 (Quick Start)

### 1. 安装依赖

```bash
git clone https://github.com/your-username/fengqi-blog.git
cd fengqi-blog
npm install
```

### 2. 本地开发预览

```bash
npm run dev
```
打开浏览器访问 `http://localhost:5173` 即可实时热更新预览。

### 3. 构建生产版本

```bash
npm run build
```
构建产物输出至 `dist/` 目录，可直接部署至任何静态托管平台。

---

## ⚙️ 配置与写作说明

### 1. 站点全局配置 (`fengqi.config.yaml`)

编辑根目录下的 `fengqi.config.yaml` 即可完成全站个性化定制：

```yaml
site:
  title: "fengqi."
  author: "风栖"
  subtitle_en: "somewhere, still awake."
  subtitle_cn: "有些光芒，来自清晨林间的薄雾。"
  footer_text: "quiet personal editorial space"
  copyright_year: 2026

profile:
  bio:
    - "在纷繁的世界里，保留一处属于自己的自留地。"
  quote: "“保持安静，保持敏感，保持对这个世界的一点点好奇。”"
  stats:
    articles: 7
    photos: 6
    likes: 342
    topics: 4

motion:
  default_reduced: false # 是否默认开启减弱动效
```

### 2. 撰写文章 (`content/posts/*.md`)

在 `content/posts/` 目录下新建 `.md` 文件，头部添加 Frontmatter：

```markdown
---
title: 晨雾、胶片与微风
date: 2026-03-15
category: essay
readTime: 4 min
excerpt: 在高饱和的世界里，找回低声量的文字与呼吸感。
coverImage: /images/cover.jpg
---

正文内容...
```

#### 支持的高级 Markdown 语法：
- **Callout 提示框**：
  ```markdown
  > [!NOTE]
  > 这是 Note 随记提示框内容。

  > [!TIP] 灵感记录
  > 这是带标题的 Tip 提示框。
  ```
- **Mermaid 架构/流程图**：
  ````markdown
  ```mermaid
  graph LR
    A[灵感] --> B[构思] --> C[成文]
  ```
  ````

---

## 🚢 一键部署指南

本主题已内置 **GitHub Actions 自动化部署工作流**，支持 0 配置部署到各大平台：

- **Vercel**（推荐，零配置导入即可）
- **GitHub Pages**（已内置 `.github/workflows/deploy.yml`，推送代码自动构建上线）
- **Cloudflare Pages**（全球 Edge 加速，无限流量）
- **个人服务器 Nginx / Docker**

👉 **详细部署步骤请查看：[DEPLOYMENT.md (完整部署指南)](./DEPLOYMENT.md)**

---

## 🍃 隐藏彩蛋

- **键盘 B / W 键**：按下触发一次“微风拂过”事件，叶片随风飘散。
- **点击波浪线**：点击首页大标题旁的 `〰` 唤起微风。
- **水面波纹**：在页面空白区域单机鼠标，生成微小上升气泡或落叶。
- **控制台寄语**：按 `F12` 查看专属控制台寄语。

---

## 📄 开源许可

本项目基于 [MIT License](./LICENSE) 开源。欢迎自由使用、分发与二次创作。
