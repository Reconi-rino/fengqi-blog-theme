import React, { useState } from 'react';
import { ShadowArticle } from '../ShadowWorld';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { CrescentMoonMotif, StarMotif, LeafMotif, PeachHeartMotif } from '../Motifs';

interface InnerWritingDetailProps {
  article: ShadowArticle;
  onBackToArchive: () => void;
  onExitToSurface: () => void;
  onShowToast: (msg: string) => void;
}

export const InnerWritingDetail: React.FC<InnerWritingDetailProps> = ({
  article,
  onBackToArchive,
  onExitToSurface,
  onShowToast,
}) => {
  const [likes, setLikes] = useState<number>(42);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleToggleLike = () => {
    if (!isLiked) {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
      onShowToast('感谢共鸣 ♡');
    } else {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast('链接已复制');
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-6 sm:p-12 lg:p-16 relative z-10 select-none">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between w-full max-w-4xl mx-auto pb-8 border-b border-[rgba(215,201,184,0.1)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToArchive}
            className="text-xs font-sans text-[#A89E91] hover:text-[#D7C9B8] transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <span>← 返回 Writing 列表</span>
          </button>
        </div>

        {/* 右上角：四角星芒按钮 */}
        <button
          onClick={onExitToSurface}
          className="group h-9 rounded-full border border-[rgba(215,201,184,0.18)] bg-[#151E22]/60 hover:bg-[#1E2B33]/80 text-xs font-sans text-[#A89E91] hover:text-[#D7C9B8] transition-all duration-300 flex items-center gap-2 px-2.5 hover:px-4 overflow-hidden focus:outline-none backdrop-blur-md"
          title="返回地表"
        >
          <StarMotif size={14} color="#E8B48C" className="group-hover:rotate-45 transition-transform duration-300 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[70px] transition-all duration-300 text-xs font-sans opacity-0 group-hover:opacity-100 text-[#D7C9B8]">
            返回地表
          </span>
        </button>
      </header>

      {/* 主阅读区域 (严格受控的 680px ~ 720px 中文排版宽度) */}
      <main className="max-w-[700px] mx-auto w-full py-12 flex-1 space-y-12 select-text">
        {/* 文章头部信息 */}
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E8B48C] tracking-widest uppercase">
            <span>○</span>
            <span>WRITING</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#F0E8DD] leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#767E79] pt-2">
            <span>⊙ {article.date}</span>
            <span>·</span>
            <span>🕒 {article.readTime || '7 min'}</span>
            <span>·</span>
            <span className="text-[#A89E91] font-sans">{article.category || '随笔'}</span>
          </div>
        </header>

        {/* 文章 Markdown 正文 */}
        <article className="inner-editorial-prose pt-4 border-t border-[rgba(215,201,184,0.08)]">
          <MarkdownRenderer content={article.content} />
        </article>

        {/* 完篇尾注 */}
        <div className="pt-16 pb-8 flex flex-col items-center justify-center space-y-3 select-none">
          <LeafMotif size={16} color="#E8B48C" />
          <span className="font-mono text-xs text-[#767E79] tracking-widest uppercase">
            — THE END —
          </span>
        </div>

        {/* 底部轻量互动条 */}
        <footer className="pt-6 border-t border-[rgba(215,201,184,0.1)] flex flex-wrap items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-6">
            {/* 喜欢按钮 */}
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 text-xs font-sans transition-all focus:outline-none ${
                isLiked ? 'text-[#E8B48C]' : 'text-[#767E79] hover:text-[#D7C9B8]'
              }`}
            >
              <PeachHeartMotif size={13} color={isLiked ? '#E8B48C' : '#767E79'} />
              <span>喜欢 {likes}</span>
            </button>

            {/* 分享按钮 */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-xs font-sans text-[#767E79] hover:text-[#D7C9B8] transition-colors focus:outline-none"
            >
              <span>↗ 分享</span>
            </button>
          </div>

          {/* 返回列表 */}
          <button
            onClick={onBackToArchive}
            className="text-xs font-sans text-[#A89E91] hover:text-[#E8B48C] transition-colors flex items-center gap-1 focus:outline-none"
          >
            <span>← 返回列表</span>
          </button>
        </footer>
      </main>

      {/* 底部装饰 */}
      <footer className="max-w-4xl mx-auto w-full pt-8 flex items-center justify-between text-xs text-[#767E79]/50 select-none">
        <div className="flex items-center gap-2 font-serif">
          <span>完篇于内在世界。</span>
        </div>
        <div className="opacity-30">
          <CrescentMoonMotif size={16} color="#E8B48C" />
        </div>
      </footer>
    </div>
  );
};
