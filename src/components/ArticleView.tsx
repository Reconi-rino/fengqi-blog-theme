import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Article } from '../types';
import { LeafMotif, PeachHeartMotif } from './Motifs';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ArticleViewProps {
  article: Article;
  onBackToWriting: () => void;
  onShowToast: (msg: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onBackToWriting,
  onShowToast,
}) => {
  const [likes, setLikes] = useState(article.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      onShowToast('感谢你的喜欢 ♡');
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast('文章链接已复制到剪贴板 🍃');
  };

  // 拼接段落内容为 Markdown 字符串
  const rawMarkdown = Array.isArray(article.content)
    ? article.content.join('\n\n')
    : String(article.content);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full min-h-screen pt-32 sm:pt-40 pb-32 px-6 sm:px-10 max-w-4xl mx-auto"
    >
      {/* 边缘水彩气泡与微装饰 */}
      <div className="absolute top-44 right-10 md:right-20 w-64 h-64 bg-[#C7D9D6]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 顶部章节身份标签 */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onBackToWriting}
          className="group inline-flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] hover:text-[#2F4B4D] uppercase transition-colors focus:outline-none"
        >
          <span className="font-light">←</span>
          <span className="font-light">○</span>
          <span>WRITING / {article.category}</span>
        </button>

        <span className="text-xs text-[#8EABA8] font-mono">
          fengqi journal
        </span>
      </div>

      {/* 文章主标题 */}
      <div className="mb-6">
        <div className="flex items-start gap-4">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2F4B4D] tracking-tight leading-tight">
            {article.title}
          </h1>
          <LeafMotif size={24} color="#A7CFC3" className="mt-2 shrink-0 opacity-80" />
        </div>

        {/* 元信息 */}
        <div className="mt-4 flex items-center gap-3 text-xs font-sans text-[#8EABA8]">
          <span>{article.date}</span>
          <span>·</span>
          <span>约 {article.readTime}</span>
          <span>·</span>
          <span className="capitalize">{article.category}</span>
        </div>
      </div>

      {/* 柔和微分割线 */}
      <div className="w-full h-px bg-[#C7D9D6]/40 my-8" />

      {/* 封面头图（若有） */}
      {article.coverImage && (
        <div className="my-8 rounded-xl overflow-hidden max-h-[420px] relative border border-[#C7D9D6]/40 shadow-xs">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover filter saturate-95"
          />
          <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded-md bg-black/25 backdrop-blur-xs text-[11px] text-white/90 font-sans">
            photographed by fengqi
          </div>
        </div>
      )}

      {/* 正文阅读区：受控最大宽度 720~760px，行高 1.95，宋体/文楷排版，支持 Markdown 富渲染 */}
      <div className="max-w-[740px] mx-auto my-10 text-base sm:text-lg">
        <MarkdownRenderer content={rawMarkdown} />
      </div>

      {/* 底部操作区 */}
      <div className="max-w-[740px] mx-auto mt-16 pt-10 border-t border-[#C7D9D6]/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* 喜欢按钮 */}
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 text-xs font-sans focus:outline-none ${
              hasLiked
                ? 'bg-[#F6DCCB]/60 border-[#F6DCCB] text-[#2F4B4D] scale-105 shadow-2xs'
                : 'bg-white/50 border-[#C7D9D6] text-[#5C7A7C] hover:text-[#2F4B4D] hover:border-[#A7CFC3] hover:bg-white'
            }`}
          >
            <PeachHeartMotif size={14} color="#F6DCCB" filled={hasLiked} />
            <span>喜欢这篇文章 ({likes})</span>
          </button>

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

        {/* 结语标志 — the end — */}
        <div className="flex flex-col items-center justify-center gap-2 mt-16 text-[#8EABA8]">
          <span className="font-mono text-xs tracking-widest">— the end —</span>
          <PeachHeartMotif size={13} color="#F6DCCB" />
        </div>
      </div>
    </motion.article>
  );
};
