import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from '../types';
import { allArticles } from '../utils/contentLoader';
import { LeafMotif } from './Motifs';

interface WritingViewProps {
  onSelectArticle: (article: Article) => void;
}

export const WritingView: React.FC<WritingViewProps> = ({ onSelectArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredArticle, setHoveredArticle] = useState<Article>(allArticles[0] || ({} as Article));

  const filteredArticles = allArticles.filter((art) => {
    if (selectedCategory === 'all') return true;
    return art.category === selectedCategory;
  });

  // 按年份分组
  const years = Array.from(new Set(filteredArticles.map((a) => a.year))).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <div className="w-full max-w-7xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12 md:px-16">
      {/* 顶部标题与身份标签 */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] mb-2 uppercase">
          <span className="font-light">○</span>
          <span>WRITING</span>
        </div>
        <div className="flex items-baseline gap-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#2F4B4D] tracking-tight">
            Writing
          </h1>
          <span className="font-serif text-base sm:text-lg text-[#5C7A7C]">
            书写与记录
          </span>
          <LeafMotif size={18} color="#A7CFC3" />
        </div>
      </div>

      {/* 分类筛选 Chips */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
        {['all', 'essay', 'tech', 'note'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1 rounded-full text-xs font-sans transition-all duration-200 focus:outline-none ${
              selectedCategory === cat
                ? 'bg-[#2F4B4D] text-[#F3F6F4] shadow-2xs'
                : 'bg-white/50 text-[#5C7A7C] hover:bg-white hover:text-[#2F4B4D] border border-[#C7D9D6]/50'
            }`}
          >
            {cat === 'all' ? '全部' : cat}
          </button>
        ))}
      </div>

      {/* 主布局：左侧文章列表 + 右侧聚焦预览卡 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* 左侧：列表取代卡片 */}
        <div className="lg:col-span-7 space-y-12">
          {years.map((year) => {
            const yearArticles = filteredArticles.filter((a) => a.year === year);
            return (
              <div key={year} className="space-y-4">
                {/* 年份标题 */}
                <div className="font-serif text-2xl font-light text-[#2F4B4D]/70 border-b border-[#C7D9D6]/35 pb-2">
                  {year}
                </div>

                {/* 文章项列表 */}
                <div className="space-y-1">
                  {yearArticles.map((art) => {
                    const isHovered = hoveredArticle.id === art.id;
                    return (
                      <div
                        key={art.id}
                        onMouseEnter={() => setHoveredArticle(art)}
                        onClick={() => onSelectArticle(art)}
                        className={`group cursor-pointer p-3 sm:p-4 rounded-lg transition-all duration-200 ${
                          isHovered
                            ? 'bg-white/70 shadow-2xs border border-[#C7D9D6]/60'
                            : 'hover:bg-white/40 border border-transparent'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                          {/* 左部：日期 + 分类 + 动机图标 + 标题 */}
                          <div className="flex items-baseline gap-3 flex-1 min-w-0">
                            <span className="font-mono text-xs text-[#8EABA8] w-11 shrink-0">
                              {art.shortDate}
                            </span>
                            <span className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#5C7A7C] shrink-0">
                              {art.category}
                            </span>
                            <span className="text-[#A7CFC3] shrink-0">
                              {art.category === 'essay' ? (
                                <LeafMotif size={13} color="#A7CFC3" />
                              ) : (
                                <span className="text-xs font-mono">○</span>
                              )}
                            </span>
                            <h3 className="font-serif text-base text-[#2F4B4D] group-hover:text-[#243B3D] truncate">
                              {art.title}
                            </h3>
                          </div>

                          {/* 右部：阅读时间 */}
                          <span className="font-sans text-xs text-[#8EABA8] shrink-0 sm:text-right">
                            {art.readTime}
                          </span>
                        </div>

                        {/* 单行简短摘要 */}
                        {art.subtitle && (
                          <p className="mt-1.5 pl-14 text-xs text-[#5C7A7C]/80 font-serif line-clamp-1">
                            {art.subtitle}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 右侧：聚焦预览卡 (快速响应、跟手极速切换) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-36">
          <div className="card-soft p-7 border border-[#C7D9D6]/60 shadow-xs relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <AnimatePresence mode="popLayout">
              {hoveredArticle && hoveredArticle.id && (
                <motion.div
                  key={hoveredArticle.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div>
                    {/* 顶部标题与元数据 */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-serif text-xl font-normal text-[#2F4B4D] leading-snug">
                          {hoveredArticle.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs font-sans text-[#8EABA8]">
                          <span>{hoveredArticle.date}</span>
                          <span>•</span>
                          <span className="capitalize">{hoveredArticle.category}</span>
                          <span>•</span>
                          <span>{hoveredArticle.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* 预览氛围图 */}
                    {hoveredArticle.coverImage && (
                      <div className="w-full h-44 rounded-lg overflow-hidden my-3 relative border border-[#C7D9D6]/30 bg-[#E6EDEB]">
                        <img
                          src={hoveredArticle.coverImage}
                          alt={hoveredArticle.title}
                          className="w-full h-full object-cover filter saturate-90 brightness-98 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2F4B4D]/25 via-transparent to-transparent pointer-events-none" />
                      </div>
                    )}

                    {/* 展开摘要 */}
                    <p className="font-serif text-xs sm:text-sm text-[#5C7A7C] leading-relaxed line-clamp-3 my-3">
                      {hoveredArticle.excerpt}
                    </p>
                  </div>

                  {/* 阅读全文按钮 */}
                  <div className="pt-4 border-t border-[#C7D9D6]/30 flex items-center justify-between mt-auto">
                    <LeafMotif size={14} color="#A7CFC3" />
                    <button
                      onClick={() => onSelectArticle(hoveredArticle)}
                      className="font-sans text-xs text-[#2F4B4D] hover:text-[#1F3335] flex items-center gap-1.5 font-medium group focus:outline-none"
                    >
                      <span>阅读全文</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
