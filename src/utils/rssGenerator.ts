/**
 * 客户端动态 RSS 2.0 XML 生成工具
 * 用于在 RSS 订阅弹窗中根据当前部署域名实时生成并预览/复制/下载标准订阅源。
 */
import { siteConfig, allArticles } from './contentLoader';

/**
 * 动态获取站点访问根地址（优先使用 fengqi.config.yaml 中的 site.url，否则自适应当前浏览器域名与子路径）
 */
export function getDynamicSiteUrl(): string {
  if (siteConfig.site?.url) {
    return siteConfig.site.url.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const basePath = import.meta.env.BASE_URL || '/';
    const normalizedBase = basePath.endsWith('/') && basePath.length > 1 ? basePath.slice(0, -1) : (basePath === '/' ? '' : basePath);
    return `${window.location.origin}${normalizedBase}`;
  }
  return '';
}

/**
 * 根据全站文章列表拼装符合 RSS 2.0 规范的 XML 字符串
 */
export function generateRssXml(customSiteUrl?: string): string {
  const siteUrl = customSiteUrl || getDynamicSiteUrl();
  const now = new Date().toUTCString();
  const title = siteConfig.site.title || 'fengqi.';
  const author = siteConfig.site.author || '风栖';
  const description = siteConfig.site.description || '一个安静、柔和、带微互动的个人刊物式博客空间';

  const itemsXml = allArticles
    .map((article) => {
      const articleUrl = `${siteUrl}/#writing/${article.slug || article.id}`;
      // 转换日期为 RFC 822 格式
      const pubDate = new Date(article.date.replace(/\./g, '-')).toUTCString();
      const content = Array.isArray(article.content) ? article.content.join('\n\n') : String(article.content);
      
      // XML 转义辅助
      const escapeXml = (unsafe: string) =>
        unsafe
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(article.category)}</category>
      <description>${escapeXml(article.excerpt || article.subtitle || '')}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title} — ${siteConfig.site.subtitle_en}</title>
    <link>${siteUrl || '/'}</link>
    <description>${description}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>${author}</managingEditor>
    <webMaster>${author}</webMaster>
${itemsXml}
  </channel>
</rss>`;
}
