# 🚀 部署指南 (Deployment Guide)

「风栖 (fengqi)」博客系统基于 **Vite + React 19 + TypeScript** 构建，最终产物为纯静态文件（位于 `dist/` 目录），因此具备**极高的部署兼容性**与**极佳的加载性能**。

---

## 📋 平台支持矩阵 (Support Matrix)

| 平台 (Platform) | 部署方式 | 推荐度 | 优势与特点 |
| :--- | :--- | :---: | :--- |
| **Vercel** | Git 自动部署 | ⭐⭐⭐⭐⭐ (强烈推荐) | 零配置、国内访问速度极佳、自动预览分支、免费 HTTPS |
| **Cloudflare Pages** | Git 自动部署 | ⭐⭐⭐⭐⭐ | 全球 Edge 边缘加速节点、无限免费带宽、抗攻击能力强 |
| **GitHub Pages** | GitHub Actions | ⭐⭐⭐⭐ | 官方原生集成、免费、支持自定义域名 |
| **Netlify** | Git / 拖拽部署 | ⭐⭐⭐⭐ | 简单易用、支持拖拽 `dist` 文件夹即时上线 |
| **自建 Nginx / Caddy** | 静态托管 / Docker | ⭐⭐⭐ | 完全自主可控、适合个人 VPS 服务器 |

---

## 1. 部署到 Vercel (最简单、推荐)

1. 将你的博客仓库推送到 GitHub / GitLab；
2. 登录 [Vercel 官网](https://vercel.com/)，点击 **"Add New..." -> "Project"**；
3. 选择并导入你的博客仓库；
4. Vercel 会自动识别 Vite 项目，保持默认配置即可：
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 **"Deploy"**，等待 30 秒即可获得专属访问网址（例如 `https://your-blog.vercel.app`）。

> [!TIP]
> 以后只要你在 `content/posts/` 提交新的 Markdown 文章并 push 到 GitHub，Vercel 就会自动触发重新构建并更新网站，无需任何手动操作。

---

## 2. 部署到 GitHub Pages (两种方式)

### ❓ 在 GitHub Pages 部署是否需要 GitHub Actions？

* **推荐方式（需要 GitHub Actions，已为你内置）**：
  * **为什么需要**：使用 GitHub Actions 可以在你推送代码后，由 GitHub 云端服务器自动运行 `npm install` 与 `npm run build`，并将打包好的 `dist/` 静态网页发布上线。**你完全不需要在本地手动打包，也不需要往仓库提交任何构建产物。**
  * **开箱即用**：本项目已内置好 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)，你**无需编写任何配置**！
* **传统手动方式（无需 Actions）**：
  * 在本地终端运行 `npm run build`，手动将生成的 `dist` 目录推送到远程仓库的 `gh-pages` 分支。这种方式较繁琐，每次发文都需要手动打包。

---

### 🛠️ GitHub Actions 一键启用步骤：

1. **推送代码到 GitHub 仓库**：
   ```bash
   git remote add origin https://github.com/<你的用户名>/<你的仓库名>.git
   git push -u origin main
   ```
2. **在 GitHub 网页端开启 Pages 权限**：
   * 打开仓库页面，点击顶部 **Settings**；
   * 在左侧侧边栏找到 **Pages**；
   * 在 **"Build and deployment" -> "Source"** 下拉菜单中，将默认的 *Deploy from a branch* 修改为 **`GitHub Actions`**。
3. **完成！**
   * 每次你向 `main` 分支提交代码时，GitHub 就会自动运行 Actions 并完成部署；
   * 稍等片刻即可在 Settings -> Pages 看到分配的站点网址（例如 `https://<用户名>.github.io/<仓库名>/`）。

---

## 3. 部署到 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，在左侧导航栏点击 **"Workers & Pages"**；
2. 点击 **"Create Application" -> "Pages" -> "Connect to Git"**；
3. 选择你的 GitHub 仓库；
4. 在构建配置（Build settings）中设置：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. 点击 **"Save and Deploy"** 即可。

---

## 4. 部署到个人服务器 (Nginx / VPS)

1. 在本地运行生产打包：
   ```bash
   npm run build
   ```
2. 将生成的 `dist/` 文件夹上传到服务器的 Web 目录（例如 `/var/www/fengqi-blog`）；
3. 配置 Nginx 虚拟主机配置：

```nginx
server {
    listen 80;
    server_name yourdomain.com; # 替换为你的域名

    root /var/www/fengqi-blog;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长期缓存优化
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```
4. 重载 Nginx：`sudo nginx -s reload`。

---

## 5. 自定义域名绑定 (Custom Domain)

* **Vercel / Cloudflare Pages**：在项目后台的 **Settings -> Domains** 中输入你的域名，并根据提示在你的 DNS 服务商（如腾讯云/阿里云/Cloudflare）处添加对应的 `CNAME` 记录。
* **GitHub Pages**：在仓库的 **Settings -> Pages -> Custom domain** 中填写域名，并在 DNS 中添加 `CNAME` 指向 `<username>.github.io`。
