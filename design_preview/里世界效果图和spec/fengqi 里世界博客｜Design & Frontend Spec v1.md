# fengqi 里世界博客｜Design & Frontend Spec v1

## 0. 文档用途

本文件用于将“fengqi 里世界博客”交付给另一位具备较强 **UI/UX + 前端实现能力** 的模型或开发者。

目标不是重新探索视觉方向，而是基于已经确定的设计口径，直接完成：

- UI 设计
- 响应式适配
- 页面实现
- 动效实现
- 密码入口
- Writing / Notes 两套内容系统
- Markdown 内容渲染
- 主题细节与交互打磨

除非出现明显实现冲突，否则应优先遵循本 Spec，不应主动将其改造成常规博客模板、Dashboard、商业 Portfolio 或赛博风格页面。

---

# 1. 项目定义

## 1.1 项目名称

**fengqi. — Inner World**

中文可称：

- 内在世界
- 里世界

UI 中优先采用：

> 内在世界  
> inside world

“里世界”更多是项目概念描述，不要求作为正式页面标题反复出现。

---

## 1.2 项目定位

这是主博客之外的一个**密码保护深色私人博客空间**。

与公开站相比，里世界：

- 更私密
- 更暗
- 更安静
- 更克制
- 更接近日记、思考和碎片保存
- 视觉上像公开主题进入夜晚后的另一层状态

它不是完全独立的新品牌，而应该明显能够看出：

> 这是 fengqi. 原主题的“另一面”。

---

## 1.3 核心内容

只实现两个主要内容板块：

### `○ Writing`
相对完整、经过整理的文章。

内容包括：

- 长文
- Essay
- 思考
- 随笔
- 比较完整的私人记录
- 有明确标题和正文结构的内容

### `~ Notes`
更短、更碎、更即时的记录。

内容包括：

- 短句
- 临时想法
- 日常观察
- 梦境
- 灵感
- 情绪片段
- 未形成完整文章的内容

不实现：

- Photography 独立板块
- Projects 独立板块
- 复杂分类门户
- 商业化 Portfolio
- 评论社区系统
- 用户系统
- 多账户权限系统

---

# 2. 整体设计哲学

核心定义：

> **一个需要轻声进入的、深色的、柔软的私人写作空间。**

应具有：

- 深夜感
- 安静
- 低饱和
- 稍微柔软
- 微弱可爱感
- 很轻的文学气质
- 留白
- 左锚定
- 慢阅读
- 微交互
- 私密感

但要避免：

- 过度 emo
- 哥特
- 恐怖
- Cyberpunk
- 黑客终端
- HUD
- Neon
- 紫色霓虹
- 强玻璃拟态
- 大量粒子星空
- “秘密基地”幼态化设计

---

# 3. 与公开主题的关系

里世界应继承公开主题的以下 DNA：

- `fengqi.` 品牌文字
- 左锚定
- 大面积留白
- 稀疏 Motif
- 中文柔和字体
- 英文/UI 现代 Sans
- 信息默认低密度
- 交互后逐渐展开
- 背景有轻微生态行为
- 不堆卡片

但进行以下反转：

| 公开站 | 里世界 |
|---|---|
| 雾白 / 蓝绿浅色 | 墨夜 / 深蓝绿色 |
| 白天感 | 夜晚感 |
| 通透 | 安静沉入 |
| 薄荷 / 水色 | 苔绿 / 静水青 |
| 小叶、小花 | 小叶、气泡、弯月 |
| 开放空间 | 私人空间 |
| 首屏直接进入 | Password Gate |

整体应该是“同一套设计语言的日夜模式”，而不是完全不同的产品。

---

# 4. 页面地图

```text
/password
   ↓ 成功
/inner
├── /writing
│    └── /writing/:slug
│
└── /notes
     └── /notes/:slug
```

可额外提供：

```text
/inner?index=open
```

用于展示 Expanding Index 状态。

---

# 5. Password Gate

## 5.1 页面目标

密码页不仅是认证页面，也是进入里世界的**仪式性入口**。

不能做成：

```text
Password:
[________]
Login
```

的普通后台登录页。

它应该仍然是一张完整的 fengqi 页面。

---

## 5.2 布局

Desktop：

- `fengqi.` 左上
- 主内容区域位于左侧约 10%～42% 页面宽度
- 右侧大量空白
- 底部或右下存在极淡背景生态
- 不居中

推荐结构：

```text
fengqi.


        内在世界
        inside world

        只为书写与思考保留的一方安静之地。

        🔒 输入密码后进入

        [ • • • • • • •          → ]

        这是你的空间，轻声进入。


        ○ Writing
        ~ Notes
```

Writing / Notes 在密码页只能作为极低优先级提示。

---

## 5.3 密码输入

推荐：

- Height: `48px`
- Width: `280–340px`
- Border Radius: `10–12px`
- Border: `1px solid rgba(...)`
- 背景透明或略深于页面
- 密码字符使用圆点
- Enter button 内嵌右侧

Enter Button：

- `40–44px`
- 圆形或高度等于 Input
- 杏雾色
- Hover 只提高亮度，不明显发光

---

## 5.4 密码错误状态

避免：

- 红色警报
- Shake 很剧烈
- ERROR 红字

采用：

- 输入框轻微水平位移 3～5px
- 边框短暂变暖桃 / 暗杏
- 文案：

> 好像不是这里。

或：

> 门没有打开。

1.5～2 秒后恢复。

不要让错误状态有安全系统 / 后台系统味。

---

## 5.5 登录成功

建议动效：

1. 输入框边框淡出
2. Enter 箭头轻微前移
3. 当前内容 opacity 降低
4. 页面背景不切换
5. `/inner` 内容从原布局自然展开

建议总时长：

`500–800ms`

不要黑屏 Fade。

---

# 6. 登录后 Landing / Inner Index

## 6.1 内容

主标题：

> 内在世界

英文：

> inside world

副文案：

> 只为书写与思考保留的一方安静之地。

或者更简短。

---

## 6.2 两个入口

```text
○  Writing                       28

   记录思考、草稿与创作。


~  Notes                         17

   收集碎片、灵感与微小观察。
```

---

## 6.3 行为

桌面端：

Hover `Writing`：

- 文字亮度轻微增加
- `○` 轻微扩大
- 中文描述 opacity 增加
- 可出现最新一篇文章标题
- 不需要弹大卡片

Hover `Notes`：

同理。

点击进入对应 Archive。

---

## 6.4 Footer Links

允许：

- About
- Exit
- Elsewhere

但优先级很低。

例如：

```text
About      Exit      Elsewhere
```

`Exit` 用于清除当前认证状态。

---

# 7. Writing Archive

## 7.1 定位

这是完整文章的 Archive，而不是卡片 Blog Grid。

必须使用**列表式布局**。

---

## 7.2 Header

```text
○ WRITING

Writing
书写与记录

记录所思，安放瞬间。
```

---

## 7.3 Article Item

建议字段：

```ts
date
type
title
excerpt
readTime
slug
tags?
cover?
```

Desktop 行布局：

```text
2026.08.09    Essay       我似乎从未喜欢过夏天
                          突然意识到，我可能给了夏天太多的滤镜……

                                       7 min        →
```

### 不做卡片背景

默认：

- transparent
- 极淡 separator
- 无阴影
- 无 rounded card

Hover 才提供：

- 背景亮度 +2～4%
- 左侧小圆环变化
- 右侧 Preview 出现

---

# 8. Writing Hover Preview

Desktop 建议实现。

页面分为：

```text
60–65% 列表
35–40% Preview / Whitespace
```

Preview 默认：

- Invisible / opacity 0
- 或只显示极淡 placeholder

Hover 某一项后：

- Fade In
- 显示封面/配图（如果有）
- 标题
- 日期
- 摘要
- 标签
- “阅读全文 →”

---

## 8.1 Preview 动效

建议：

```css
transition:
  opacity 220ms,
  transform 300ms;
```

初始：

```css
opacity: 0;
transform: translateY(6px);
```

激活：

```css
opacity: 1;
transform: translateY(0);
```

不要使用大尺度横移。

---

## 8.2 无图文章

若没有 Cover：

显示：

- 摘要
- 文章中的一句摘录
- 极淡 Motif

不自动生成 placeholder Illustration。

---

# 9. Writing Detail

## 9.1 阅读优先

这是里世界最安静的页面。

视觉优先级：

```text
正文 > 标题 > Meta > Navigation > Decoration
```

---

## 9.2 内容宽度

Desktop：

```css
max-width: 680px ~ 740px;
```

中文最佳建议：

`680–720px`

不可让正文宽到整个主内容区。

---

## 9.3 Header

```text
○ WRITING

文章标题

2026.08.09    ·    约 7 分钟阅读
```

---

## 9.4 正文

推荐字号：

Desktop：

- `17–18px`

Mobile：

- `16–17px`

Line-height：

- `1.9`
- 可在 `1.8–2.0` 之间调整

Paragraph spacing：

- `1.4–1.8em`

正文色不得使用纯白。

---

## 9.5 Article Footer

可选：

```text
♡ 喜欢

↗ 分享

← 返回列表
```

再下面：

```text
— THE END —
```

或者只用一个很小的叶子。

功能本身不是重点。

---

# 10. Notes Archive

## 10.1 定位

Notes 不是 Writing 的缩小版。

它应该更：

- 快
- 轻
- 碎
- 随意
- 可扫描

---

## 10.2 Header

```text
~ NOTES

Notes
随记与碎片

日常的碎片，闪过的念头，未完成的句子。
```

---

## 10.3 Filtering

可以实现轻量 Tags：

- 全部
- 日常
- 灵感
- 观察
- 梦境
- 其他

不要做复杂分类 Sidebar。

表现为非常轻的 Chip：

```text
全部 27    日常 11    灵感 7    观察 5
```

---

## 10.4 Search

可选轻量搜索：

```text
搜索随记…
```

不是必选。

如果页面数据量较少，可以不做。

---

## 10.5 List Item

```text
2026.08.18    观察

一片叶子

落在水面上，轻轻转了两圈，
最后沉下去。
```

或更压缩：

```text
08.18   观察     一片叶子
                  落在水面上，轻轻转了两圈……
```

---

# 11. Note Preview

Desktop 可使用右侧 Preview。

与 Writing Preview 相比：

### Writing
- 更正式
- 信息更完整
- 图片稍大
- 阅读入口明显

### Notes
- 更轻
- Preview 更窄
- 图片不是必须
- 内容本体甚至可完整展示
- Tag 比较重要

---

# 12. Note Detail

## 12.1 定位

Note Detail 不应看起来像完整 Essay。

它应该：

- 标题较小
- Meta 更紧凑
- 正文更短
- 行间更松
- 页面上下留白更多

---

## 12.2 示例

```text
~ NOTES

雨停之后的气味

2026.08.18    23:47    观察    3 min


空气变轻。

泥土从深处呼吸，带着一点冷意，
也带着刚被洗过的树叶的暗香。

远处的路灯还亮着，
在湿漉漉的地面上开出柔软的光斑。

我站了很久。


雨    气味    深夜
```

---

# 13. 色彩系统

核心原则：

> 深，但不死黑；暗，但不赛博。

建议 Tokens：

```css
--bg-primary:      #0E1316;
--bg-secondary:    #121A1E;
--surface:         #151E22;

--mist-blue:       #1E2B33;
--deep-teal:       #2C4A4D;
--moss-green:      #3A4B3E;
--lavender-gray:   #4B4858;

--text-primary:    #D7C9B8;
--text-secondary:  #A89E91;
--text-muted:      #767E79;

--accent-apricot:  #E8B48C;
--accent-mint:     #7F9C88;

--border:          rgba(215,201,184,.13);
--divider:         rgba(215,201,184,.08);
```

---

## 13.1 背景

不要使用：

```css
background: #000;
```

建议：

```css
background:
  radial-gradient(...极轻...),
  #0E1316;
```

但 Gradient 只能用来做“雾感深度”，不能明显看见彩色光晕。

---

# 14. 字体系统

## 14.1 英文 / UI

优先：

- Inter
- Geist
- IBM Plex Sans

推荐首选：

**Inter**

用途：

- Metadata
- Date
- Tags
- English labels
- UI
- Navigation

---

## 14.2 中文正文

首选组合：

### 正文
- 霞鹜文楷
- 或思源宋体

建议实际测试二选一。

如果使用霞鹜文楷：

- 不要 Weight 太轻
- 避免大面积特别大的标题
- 更适用于正文 / 短文案

### 大标题
可使用：
- 思源宋体
- 或类似有温度的 Serif

让标题比公开站更稳重，但不要变成古风。

---

# 15. 图形 Motif

只保留少量：

```text
○   ·   —   ~   □   叶   气泡   ☾   ♡
```

核心 Motif：

- Hollow circle
- Dot
- Soft wave
- Leaf
- Bubble
- Crescent moon

---

## 15.1 Crescent Moon

月牙是里世界相对于公开主题新增的主要辨识符。

规则：

- 非 Logo
- 不频繁出现
- 最多同屏 1 个
- 一般放在：
  - 页面边缘
  - Footer
  - Preview 图中
  - Login Page

不能做成“月亮主题博客”。

---

# 16. 背景生态系统

延续公开主题的“背景中偶然出现的小生命”，但深色版更克制。

## 16.1 类型

### Bubble
- 向上
- 8–14 秒
- 透明度低

### Leaf
- 下落或漂移
- 10–18 秒
- 有非常轻微旋转

### Mist
- 30–60 秒缓慢偏移
- 非粒子
- 更像大面积半透明纹理

### Static Motif
- Circle
- Wave
- Dot

---

# 17. 鼠标互动

## 17.1 Push Away

鼠标靠近背景元素：

```text
距离 < 70–100px
```

产生轻微排斥。

最大位移：

```text
12–24px
```

随后：

```text
800–1800ms
```

缓慢返回。

禁止“物理弹飞”。

---

## 17.2 空白点击

点击真正的空白区域时：

随机生成一种：

### Bubble
2～4 个

或：

### Leaf
1～2 个

出现概率建议：

```text
Bubble 60%
Leaf   35%
Special motif 5%
```

Special 可偶尔是：

- tiny heart
- small crescent
- small flower-like star

但要极少。

---

# 18. 动效等级

整体动效强度：

**4 / 10**

比公开站更安静。

推荐：

- Hover: 150–220ms
- Panel appear: 250–400ms
- Page transition: 400–700ms
- Background: 8–60s

---

# 19. Reduced Motion

必须支持：

```css
@media (prefers-reduced-motion: reduce)
```

Reduce 时：

- 停止自动 Bubble
- 停止 Falling leaf
- 停止 Mist Motion
- 页面 transition 缩短
- Hover 仅使用 opacity

可增加站内设置：

```text
Motion
○ Normal
○ Reduced
○ Off
```

非必需，但推荐。

---

# 20. 密码与安全要求

这一部分不能只做视觉效果。

如果它只是“防止普通人随便看到”，可以采用基础认证。

如果真正具有隐私要求，则：

## 不推荐
把密码直接写在前端：

```js
if (password === "xxxx")
```

因为源码可直接读取。

---

## 推荐最低方案

由服务器处理：

```text
POST /api/auth
```

验证密码成功后：

- Set `HttpOnly`
- `Secure`
- `SameSite`
- Session Cookie

后续访问 `/inner/*` 由 Middleware 判断。

---

## 如果是纯静态站

需要明确：

> 前端密码门只能防误入，不能提供真正内容保密。

如果用户需要真正隐私，应采用：

- Server-side auth
- Basic Auth
- Cloudflare Access
- 或加密内容方案

---

# 21. 登录状态

建议：

```text
Session lifetime: 浏览器 Session
```

或：

```text
12–24h
```

提供：

```text
Exit
```

点击后清除 Cookie。

---

# 22. Privacy UX

不要：

- 登录历史
- “Last login”
- Device fingerprint UI
- Tracking 信息
- 后台风安全提示

这里不是账户系统。

只显示：

> Password protected.

足够。

---

# 23. Responsive

## 23.1 Desktop

主要设计目标：

`1440px`

适配：

`1280–1920px`

---

## 23.2 Tablet

- Preview Panel 可减小
- Archive 主体 70%
- 背景 Motif 减少约 30%

---

## 23.3 Mobile

不保留左右双栏。

### Writing Archive

```text
Header

文章
文章
文章
文章
```

点击直接进入，不显示 Hover Preview。

或者点击第一下展开 Preview，再点击进入，但不推荐，会增加操作成本。

---

### Notes

直接单列。

---

### Reading

- 左右 padding：20–24px
- 正文宽度 100%
- 背景生态数量下降 50–70%
- Moon 等大型装饰隐藏

---

# 24. Accessibility

最低要求：

- 正文对比度 >= WCAG AA
- Interactive Target >= `40px`
- Keyboard Navigation
- Password field 正确 label
- `Enter` 可提交
- `Esc` 可关闭 Preview
- Tab focus visible
- Hover 功能必须有 Keyboard 等价
- Reduced Motion
- 不仅靠颜色表达选中状态

---

# 25. 内容数据结构

## Writing Frontmatter

```yaml
title:
date:
slug:
type:
excerpt:
readTime:
tags:
cover:
draft:
```

---

## Notes Frontmatter

```yaml
title:
date:
time:
slug:
category:
tags:
excerpt:
cover:
draft:
```

可选：

```yaml
mood:
```

但不要过度结构化私人内容。

---

# 26. 页面 Transition

建议统一：

## List → Detail

文章标题轻微保持位置感：

- Current item opacity down
- Detail title fade/slide in

无需复杂 Shared Element。

---

## Back

保留之前 Archive Scroll Position。

这是很重要的体验细节。

---

# 27. Loading

尽量避免 Skeleton 卡片。

如果需要：

```text
fengqi.

正在打开这里……
```

或者非常小的：

```text
…
```

但如果内容是静态生成，最好无需 Loading UI。

---

# 28. Empty State

Writing Empty：

> 这里暂时没有写下东西。

Notes Empty：

> 这里还很安静。

Search Empty：

> 没找到这一片碎片。

不要：

> No results found.

作为主要文字。

---

# 29. Error Page

404：

```text
好像走得有点远了。

← 回到内在世界
```

同样保持黑色生态背景。

---

# 30. 不允许的视觉实现

前端实现模型应严格避免：

- Neon glow
- 粒子银河
- Three.js 星空
- 紫蓝霓虹渐变
- 强 Blur Glass Card
- 每个区域一个圆角卡片
- Bootstrap Dashboard 感
- Terminal 输入界面
- Hacker Password Screen
- 锁头图标放很大
- 任何“安全系统 UI”
- Hero 居中
- 超大英文 ALL CAPS
- 背景持续高频运动

---

# 31. 关键 Component

建议组件树：

```text
<AppShell />

<AmbientBackground />

<Brand />

<PasswordGate />

<InnerLanding />

<SectionIdentity />

<ArchiveHeader />

<WritingList />
<WritingListItem />
<WritingPreview />

<NotesList />
<NoteListItem />
<NotePreview />

<ArticleLayout />

<Metadata />

<Tag />

<PageFooter />

<MotionSettings />
```

---

# 32. AmbientBackground API 建议

```ts
interface AmbientBackgroundProps {
  density?: "low" | "medium";
  motion?: "normal" | "reduced" | "off";
  interactive?: boolean;
  variant?: "landing" | "archive" | "reading";
}
```

页面配置建议：

```text
Password    medium
Landing     medium
Archive     low
Reading     low / very low
```

---

# 33. CSS Token 建议

```css
:root {
  --inner-bg: #0E1316;
  --inner-bg-soft: #121A1E;
  --inner-surface: #151E22;

  --inner-text: #D7C9B8;
  --inner-text-secondary: #AAA093;
  --inner-text-muted: #767E79;

  --inner-teal: #2C4A4D;
  --inner-moss: #3A4B3E;
  --inner-lavender: #4B4858;
  --inner-apricot: #E8B48C;

  --inner-border: rgba(215, 201, 184, 0.13);
  --inner-divider: rgba(215, 201, 184, 0.08);

  --content-max: 720px;
  --page-padding: clamp(24px, 6vw, 96px);
}
```

---

# 34. 页面间装饰密度

| 页面 | 密度 |
|---|---:|
| Password | 1.0 |
| Landing | 1.0 |
| Writing Archive | 0.7 |
| Notes Archive | 0.75 |
| Writing Detail | 0.35 |
| Note Detail | 0.45 |

即：

**越深入内容，装饰越退后。**

---

# 35. 最终验收标准

最终网站应满足：

### 第一眼
用户能够判断：
- 是 fengqi 的一部分
- 是深色版本
- 私密
- 安静
- 有温度

### 10 秒后
用户能够理解：
- 需要密码进入
- 只有 Writing / Notes
- 页面交互很轻
- 有微弱生命感

### 阅读时
用户几乎忘记背景动效的存在。

### 离开后
用户会记得：
- 暗青黑背景
- 杏色文字/焦点
- 小叶、气泡、弯月
- 左锚定
- “内在世界”这个空间感

而不是记得某个炫酷效果。

---

# 36. 交付要求

最终实现至少包含：

- Password Gate
- Login Error / Success State
- Inner Landing
- Writing Archive
- Writing Hover Preview
- Writing Detail
- Notes Archive
- Note Preview
- Note Detail
- Ambient Background
- Responsive
- Reduced Motion
- Auth / Logout
- Markdown Rendering
- Dark Theme Tokens
- Keyboard Accessibility

---

# 37. 最终一句设计定义

> **fengqi 里世界不是公开站的 Dark Mode，而是公开站在夜里留下的一间房。**

视觉上保持熟悉，体验上更慢、更安静、更私人。

进入需要一道门，但进入之后，不应该再感受到“系统”。

只剩下：

> ○ Writing  
> ~ Notes

以及一些偶尔漂过的气泡、叶子和没有说完的话。