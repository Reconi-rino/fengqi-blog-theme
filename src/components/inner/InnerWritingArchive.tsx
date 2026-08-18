import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShadowArticle } from '../ShadowWorld';
import { CrescentMoonMotif, StarMotif, LeafMotif } from '../Motifs';

interface InnerWritingArchiveProps {
  articles: ShadowArticle[];
  onSelectArticle: (article: ShadowArticle) => void;
  onBackToLanding: () => void;
  onExitToSurface: () => void;
}

export const InnerWritingArchive: React.FC<InnerWritingArchiveProps> = ({
  articles,
  onSelectArticle,
  onBackToLanding,
  onExitToSurface,
}) => {
  const [hoveredArticle, setHoveredArticle] = useState<ShadowArticle>(articles[0] || ({} as ShadowArticle));

  return (
    <div className="min-h-screen w-full flex flex-col p-6 sm:p-12 lg:p-16 relative z-10 select-none">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto pb-8 border-b border-[rgba(215,201,184,0.1)]">
        <div className="flex items-center gap-6">
          <button
            onClick={onBackToLanding}
            className="flex items-baseline gap-2 group text-left focus:outline-none"
          >
            <span className="font-serif text-2xl font-normal text-[#D7C9B8] group-hover:text-[#E8B48C] transition-colors">
              fengqi.
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-[#767E79] tracking-widest pl-2">
              inner world
            </span>
          </button>
          <span className="text-xs text-[#767E79] font-mono">/</span>
          <button
            onClick={onBackToLanding}
            className="text-xs font-sans text-[#A89E91] hover:text-[#D7C9B8] transition-colors flex items-center gap-1 focus:outline-none"
          >
            <span>← 返回索引</span>
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

      {/* 主体区 */}
      <main className="max-w-7xl mx-auto w-full py-10 flex-1 space-y-10">
        {/* 板块 Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E8B48C] tracking-widest uppercase">
            <span>○</span>
            <span>WRITING</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-[#D7C9B8] tracking-tight">
              Writing
            </h1>
            <span className="font-serif text-xl sm:text-2xl font-normal text-[#A89E91]">
              书写与记录
            </span>
          </div>
          <p className="font-serif text-xs sm:text-sm text-[#767E79]">
            记录所思，安放瞬间，慢慢靠近内在世界。
          </p>
        </div>

        {/* 桌面双栏布局：左侧 65% 文章列表，右侧 35% 悬浮实时预览卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* 左侧：列表区域 */}
          <div className="lg:col-span-8 space-y-1">
            {/* 表头 */}
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-[rgba(215,201,184,0.1)] text-[11px] font-mono text-[#767E79] uppercase tracking-wider">
              <span className="col-span-3">日期 DATE</span>
              <span className="col-span-2">类型 TYPE</span>
              <span className="col-span-5">标题 / 摘要 TITLE</span>
              <span className="col-span-2 text-right">阅读 READ</span>
            </div>

            {/* 列表项 */}
            <div className="divide-y divide-[rgba(215,201,184,0.06)]">
              {articles.map((art) => {
                const isHovered = hoveredArticle?.id === art.id;
                return (
                  <motion.div
                    key={art.id}
                    onMouseEnter={() => setHoveredArticle(art)}
                    onClick={() => onSelectArticle(art)}
                    className={`py-4 px-3 -mx-3 rounded-xl cursor-pointer transition-all duration-200 group flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center ${
                      isHovered
                        ? 'bg-[#151E22]/80 shadow-xs'
                        : 'hover:bg-[#151E22]/40'
                    }`}
                  >
                    {/* 日期 */}
                    <div className="col-span-3 flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full border transition-all ${
                        isHovered
                          ? 'border-[#E8B48C] bg-[#E8B48C]'
                          : 'border-[#767E79] bg-transparent'
                      }`} />
                      <span className="text-xs font-mono text-[#767E79] group-hover:text-[#A89E91] transition-colors">
                        {art.date}
                      </span>
                    </div>

                    {/* 类型 */}
                    <div className="col-span-2 hidden sm:block">
                      <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-[rgba(215,201,184,0.06)] text-[#A89E91] border border-[rgba(215,201,184,0.1)]">
                        {art.category || '随笔'}
                      </span>
                    </div>

                    {/* 标题与摘要 */}
                    <div className="col-span-5 space-y-1">
                      <h3 className="font-serif text-base text-[#D7C9B8] group-hover:text-[#E8B48C] transition-colors leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs font-serif text-[#767E79] line-clamp-1 group-hover:text-[#A89E91] transition-colors">
                        {art.excerpt}
                      </p>
                    </div>

                    {/* 阅读时间与箭头 */}
                    <div className="col-span-2 text-right hidden sm:flex items-center justify-end gap-1.5 text-xs font-mono text-[#767E79] group-hover:text-[#D7C9B8] transition-colors">
                      <span>{art.readTime || '5 min'}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 右侧：预览面板 (Preview Panel) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28">
            <AnimatePresence mode="wait">
              {hoveredArticle && (
                <motion.div
                  key={hoveredArticle.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="inner-card-soft p-6 space-y-6"
                >
                  {/* 预览顶栏 */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#767E79] border-b border-[rgba(215,201,184,0.1)] pb-3">
                    <span>[预览] PREVIEW</span>
                    <span className="text-[#E8B48C]">{hoveredArticle.category}</span>
                  </div>

                  {/* 夜幕氛围微图 */}
                  <div className="h-32 rounded-xl bg-radial from-[#1E2B33]/80 to-[#0E1316] border border-[rgba(215,201,184,0.08)] flex flex-col items-center justify-center relative overflow-hidden p-4 text-center">
                    <div className="absolute top-3 right-4 opacity-40">
                      <CrescentMoonMotif size={20} color="#E8B48C" />
                    </div>
                    <LeafMotif size={22} color="#7F9C88" className="mb-2 opacity-80" />
                    <p className="text-[11px] font-serif text-[#767E79] italic max-w-xs">
                      “安静沉入，与自己轻声交谈。”
                    </p>
                  </div>

                  {/* 标题与摘要 */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-[#767E79]">
                      {hoveredArticle.date} · {hoveredArticle.readTime}
                    </div>
                    <h2 className="font-serif text-xl font-normal text-[#D7C9B8] leading-snug">
                      {hoveredArticle.title}
                    </h2>
                    <p className="font-serif text-xs text-[#A89E91] leading-relaxed line-clamp-4">
                      {hoveredArticle.excerpt}
                    </p>
                  </div>

                  {/* 进入阅读按钮 */}
                  <button
                    onClick={() => onSelectArticle(hoveredArticle)}
                    className="w-full py-3 rounded-xl bg-[#E8B48C] hover:bg-[#F3C49E] text-[#0E1316] text-xs font-sans font-medium transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none"
                  >
                    <span>阅读全文</span>
                    <span className="font-mono">→</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="max-w-7xl mx-auto w-full pt-12 border-t border-[rgba(215,201,184,0.08)] flex items-center justify-between text-xs text-[#767E79]">
        <div className="flex items-center gap-2 font-serif">
          <LeafMotif size={12} color="#767E79" />
          <span>文字如舟，安渡长夜。</span>
        </div>
        <div className="opacity-40">
          <CrescentMoonMotif size={18} color="#E8B48C" />
        </div>
      </footer>
    </div>
  );
};
