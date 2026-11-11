import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Article } from '../types';
import { LeafMotif, PeachHeartMotif } from './Motifs';
import { MarkdownRenderer } from './MarkdownRenderer';
import { extractHeadings, MIST_EASE, PILL_SPRING } from '../utils/motion';

interface ArticleViewProps {
  article: Article;
  prevArticle?: Article | null;
  nextArticle?: Article | null;
  onSelectArticle?: (article: Article) => void;
  onBackToWriting: () => void;
  onShowToast: (msg: string) => void;
  onTriggerBreeze?: () => void;
  zenMode?: boolean;
  onToggleZenMode?: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  prevArticle,
  nextArticle,
  onSelectArticle,
  onBackToWriting,
  onShowToast,
  onTriggerBreeze,
  zenMode = false,
  onToggleZenMode,
}) => {
  const [hasHearted, setHasHearted] = useState(false);
  const [fontStyle, setFontStyle] = useState<'serif' | 'wenkai'>('serif');
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);

  // 顶部丝滑阅读进度条
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001,
  });

  // 拼接段落内容为 Markdown 字符串
  const rawMarkdown = Array.isArray(article.content)
    ? article.content.join('\n\n')
    : String(article.content);

  const headings = useMemo(() => extractHeadings(rawMarkdown), [rawMarkdown]);

  // 监听滚动显示回到顶部 + IntersectionObserver 高亮当前目录章节
  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (headings.length === 0) {
      return () => window.removeEventListener('scroll', onScroll);
    }

    setActiveHeadingId(headings[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveHeadingId(visible[0].target.id);
        }
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: 0.05 }
    );

    const timer = setTimeout(() => {
      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [headings, article.id]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveHeadingId(id);
      setIsMobileTocOpen(false);
    }
  };

  const handleHeart = () => {
    setHasHearted(!hasHearted);
    if (!hasHearted) {
      onShowToast('心意已记下，起了一阵微风 🍃');
      if (onTriggerBreeze) onTriggerBreeze();
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast('文章链接已复制到剪贴板 🍃');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: MIST_EASE }}
      className="relative w-full min-h-screen pt-32 sm:pt-40 pb-32 px-6 sm:px-10 max-w-4xl mx-auto"
    >
      {/* 顶部极细水彩阅读进度条 */}
      <motion.div
        style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
        className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-gradient-to-r from-[#A7CFC3] via-[#8EABA8] to-[#F6DCCB] pointer-events-none"
      />

      {/* 边缘水彩气泡与微装饰 */}
      <div
        className={`absolute top-44 right-10 md:right-20 w-64 h-64 bg-[#C7D9D6]/20 rounded-full blur-3xl pointer-events-none -z-10 transition-opacity duration-700 ${
          zenMode ? 'opacity-20' : 'opacity-100'
        }`}
      />

      {/* 宽屏右侧静音悬浮目录 */}
      {headings.length >= 2 && (
        <aside
          className={`hidden xl:block fixed right-8 top-40 w-48 z-20 transition-opacity duration-500 ${
            zenMode ? 'opacity-20 hover:opacity-95' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <div className="border-l border-[#C7D9D6]/50 pl-3.5 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#8EABA8] mb-2.5">
              OUTLINE · 目录
            </div>
            <nav className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
              {headings.map((h) => {
                const isActive = activeHeadingId === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => scrollToHeading(h.id)}
                    className={`relative block w-full text-left text-[11px] font-sans leading-snug transition-all duration-200 focus:outline-none ${
                      h.level === 3 ? 'pl-3' : h.level === 2 ? 'pl-1' : ''
                    } ${
                      isActive
                        ? 'text-[#2F4B4D] font-medium'
                        : 'text-[#8EABA8] hover:text-[#5C7A7C]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="article-toc-indicator"
                        transition={PILL_SPRING}
                        className="absolute -left-[17px] top-1.5 w-1.5 h-1.5 rounded-full bg-[#A7CFC3]"
                      />
                    )}
                    <span className="line-clamp-2">{h.text}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      {/* 顶部章节身份标签 */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <button
          onClick={onBackToWriting}
          className="group inline-flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] hover:text-[#2F4B4D] uppercase transition-colors focus:outline-none"
        >
          <span className="font-light group-hover:-translate-x-0.5 transition-transform">←</span>
          <span className="font-light">○</span>
          <span>WRITING / {article.category}</span>
        </button>

        <span className="text-xs text-[#8EABA8] font-mono">fengqi journal</span>
      </div>

      {/* 文章主标题 */}
      <div className="mb-6">
        <div className="flex items-start gap-4">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2F4B4D] tracking-tight leading-tight">
            {article.title}
          </h1>
          <LeafMotif size={24} color="#A7CFC3" className="mt-2 shrink-0 opacity-80" />
        </div>

        {article.subtitle && (
          <p className="mt-3 font-serif text-base sm:text-lg text-[#5C7A7C]/90 leading-relaxed">
            {article.subtitle}
          </p>
        )}

        {/* 元信息与标签 */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-sans text-[#8EABA8]">
          <span>{article.date}</span>
          <span>·</span>
          <span>约 {article.readTime}</span>
          <span>·</span>
          <span className="capitalize">{article.category}</span>

          {article.tags && article.tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-[#E6EDEB] text-[#5C7A7C] text-[11px]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 极简阅读调节工具条（字体风格 + 禅意专注 + 移动端目录） */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-sans">
          <div className="inline-flex items-center p-0.5 rounded-full bg-white/50 border border-[#C7D9D6]/50">
            <button
              onClick={() => setFontStyle('serif')}
              className={`px-2.5 py-0.5 rounded-full transition-colors focus:outline-none ${
                fontStyle === 'serif'
                  ? 'bg-white text-[#2F4B4D] font-medium shadow-2xs'
                  : 'text-[#8EABA8] hover:text-[#2F4B4D]'
              }`}
            >
              宋体
            </button>
            <button
              onClick={() => setFontStyle('wenkai')}
              className={`px-2.5 py-0.5 rounded-full transition-colors focus:outline-none ${
                fontStyle === 'wenkai'
                  ? 'bg-white text-[#2F4B4D] font-medium shadow-2xs'
                  : 'text-[#8EABA8] hover:text-[#2F4B4D]'
              }`}
            >
              文楷
            </button>
          </div>

          {onToggleZenMode && (
            <button
              onClick={onToggleZenMode}
              className={`px-3 py-1 rounded-full border transition-all focus:outline-none ${
                zenMode
                  ? 'bg-[#2F4B4D] text-[#F3F6F4] border-[#2F4B4D]'
                  : 'bg-white/45 border-[#C7D9D6]/50 text-[#5C7A7C] hover:text-[#2F4B4D] hover:bg-white/75'
              }`}
            >
              {zenMode ? '退出禅意阅读' : '禅意专注'}
            </button>
          )}

          {headings.length >= 2 && (
            <button
              onClick={() => setIsMobileTocOpen((v) => !v)}
              className="xl:hidden px-3 py-1 rounded-full bg-white/45 border border-[#C7D9D6]/50 text-[#5C7A7C] hover:text-[#2F4B4D] transition-all focus:outline-none"
            >
              {isMobileTocOpen ? '收起目录 ▲' : `目录 (${headings.length}) ▼`}
            </button>
          )}
        </div>

        {/* 移动端折叠目录 */}
        <AnimatePresence>
          {isMobileTocOpen && headings.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: MIST_EASE }}
              className="xl:hidden overflow-hidden mt-3"
            >
              <div className="card-soft p-4 space-y-1.5 text-xs font-sans">
                {headings.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => scrollToHeading(h.id)}
                    className={`block w-full text-left py-1 text-[#5C7A7C] hover:text-[#2F4B4D] transition-colors ${
                      h.level === 3 ? 'pl-5' : h.level === 2 ? 'pl-2' : ''
                    }`}
                  >
                    · {h.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 柔和微分割线 */}
      <div className="w-full h-px bg-[#C7D9D6]/40 my-8" />

      {/* 封面头图（若有） */}
      {article.coverImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: MIST_EASE }}
          className="my-8 rounded-xl overflow-hidden max-h-[420px] relative border border-[#C7D9D6]/40 shadow-xs"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover filter saturate-95"
          />
          <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded-md bg-black/25 backdrop-blur-xs text-[11px] text-white/90 font-sans">
            photographed by fengqi
          </div>
        </motion.div>
      )}

      {/* 正文阅读区：受控最大宽度 740px，支持宋体 / 文楷即时切换 */}
      <div className="max-w-[740px] mx-auto my-10 text-base sm:text-lg">
        <MarkdownRenderer
          content={rawMarkdown}
          className={fontStyle === 'wenkai' ? 'font-wenkai' : ''}
        />
      </div>

      {/* 底部操作区 */}
      <div className="max-w-[740px] mx-auto mt-16 pt-10 border-t border-[#C7D9D6]/40 space-y-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* 心意留存按钮 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleHeart}
            className={`px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 text-xs font-sans focus:outline-none ${
              hasHearted
                ? 'bg-[#F6DCCB]/60 border-[#F6DCCB] text-[#2F4B4D] scale-105 shadow-2xs'
                : 'bg-white/50 border-[#C7D9D6] text-[#5C7A7C] hover:text-[#2F4B4D] hover:border-[#A7CFC3] hover:bg-white'
            }`}
          >
            <PeachHeartMotif size={14} color="#F6DCCB" filled={hasHearted} />
            <span>{hasHearted ? '已存心意 ♡' : '寄托心意'}</span>
          </motion.button>

          {/* 分享与返回操作 */}
          <div className="flex items-center gap-4 text-xs font-sans text-[#5C7A7C]">
            <button
              onClick={handleShare}
              className="hover:text-[#2F4B4D] transition-colors flex items-center gap-1.5 focus:outline-none"
            >
              <span>分享这篇文章</span>
              <LeafMotif size={12} color="#A7CFC3" />
            </button>
            <span className="text-[#C7D9D6]">/</span>
            <button
              onClick={onBackToWriting}
              className="hover:text-[#2F4B4D] transition-colors focus:outline-none"
            >
              返回文章列表
            </button>
          </div>
        </div>

        {/* 上一篇 / 下一篇 延伸阅读导航 */}
        {(prevArticle || nextArticle) && onSelectArticle && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#C7D9D6]/30">
            {prevArticle ? (
              <button
                onClick={() => onSelectArticle(prevArticle)}
                className="card-soft p-4 text-left group hover:border-[#A7CFC3] transition-all focus:outline-none"
              >
                <div className="text-[11px] font-sans text-[#8EABA8] mb-1">← 上一篇</div>
                <div className="font-serif text-sm text-[#2F4B4D] group-hover:translate-x-0.5 transition-transform line-clamp-1">
                  {prevArticle.title}
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextArticle && (
              <button
                onClick={() => onSelectArticle(nextArticle)}
                className="card-soft p-4 text-left sm:text-right group hover:border-[#A7CFC3] transition-all focus:outline-none"
              >
                <div className="text-[11px] font-sans text-[#8EABA8] mb-1">下一篇 →</div>
                <div className="font-serif text-sm text-[#2F4B4D] group-hover:-translate-x-0.5 transition-transform line-clamp-1">
                  {nextArticle.title}
                </div>
              </button>
            )}
          </div>
        )}

        {/* 结语标志 — the end — */}
        <div className="flex flex-col items-center justify-center gap-2 pt-4 text-[#8EABA8]">
          <span className="font-mono text-xs tracking-widest">— the end —</span>
          <PeachHeartMotif size={13} color="#F6DCCB" />
        </div>
      </div>

      {/* 悬浮回到顶部胶囊 */}
      <AnimatePresence>
        {showBackTop && (
          <motion.button
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.25, ease: MIST_EASE }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-6 sm:right-10 z-30 px-3.5 py-2 rounded-full bg-white/75 backdrop-blur-md border border-[#C7D9D6] text-xs font-sans text-[#2F4B4D] hover:bg-white shadow-sm transition-colors focus:outline-none flex items-center gap-1.5"
            aria-label="回到顶部"
          >
            <span>↑</span>
            <span className="hidden sm:inline">顶部</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.article>
  );
};
