import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from '../types';
import { allArticles } from '../utils/contentLoader';
import { LeafMotif } from './Motifs';
import { MIST_EASE, PILL_SPRING, GENTLE_SPRING } from '../utils/motion';

interface WritingViewProps {
  onSelectArticle: (article: Article) => void;
}

type WritingLayoutMode = 'split' | 'magazine' | 'index';

export const WritingView: React.FC<WritingViewProps> = ({ onSelectArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<WritingLayoutMode>('split');
  const [hoveredArticle, setHoveredArticle] = useState<Article>(
    allArticles[0] || ({} as Article)
  );

  // 收集全站可用文章标签
  const allTags = useMemo(() => {
    const set = new Set<string>();
    allArticles.forEach((a) => {
      a.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, []);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allArticles.filter((art) => {
      if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
      if (selectedTag && !art.tags?.includes(selectedTag)) return false;
      if (q) {
        const hay = `${art.title} ${art.subtitle || ''} ${art.excerpt} ${(art.tags || []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  // 保证右侧预览始终指向当前筛选内的有效文章
  const activePreview = useMemo(() => {
    if (filteredArticles.some((a) => a.id === hoveredArticle?.id)) {
      return hoveredArticle;
    }
    return filteredArticles[0] || null;
  }, [filteredArticles, hoveredArticle]);

  // 按年份分组
  const years = useMemo(
    () =>
      Array.from(new Set(filteredArticles.map((a) => a.year))).sort(
        (a, b) => Number(b) - Number(a)
      ),
    [filteredArticles]
  );

  const handleTagToggle = (tag: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12 md:px-16">
      {/* 顶部标题与身份标签 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: MIST_EASE }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] mb-2 uppercase">
            <span className="font-light">○</span>
            <span>WRITING · {filteredArticles.length} 篇</span>
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

        {/* 右侧：视图切换器（双栏 / 画报 / 索引）+ 极轻搜索框 */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="检索标题或片段…"
              className="w-44 sm:w-52 px-3.5 py-1.5 rounded-full bg-white/55 border border-[#C7D9D6]/60 text-xs font-sans text-[#2F4B4D] placeholder:text-[#8EABA8] focus:outline-none focus:border-[#A7CFC3] focus:bg-white/85 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#8EABA8] hover:text-[#2F4B4D] focus:outline-none"
                aria-label="清空搜索"
              >
                ✕
              </button>
            )}
          </div>

          <div className="inline-flex items-center p-0.5 rounded-full bg-white/50 border border-[#C7D9D6]/60 text-xs font-sans">
            {(
              [
                { id: 'split', label: '双栏预览' },
                { id: 'magazine', label: '画报网格' },
                { id: 'index', label: '极简年表' },
              ] as const
            ).map((mode) => {
              const active = layoutMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setLayoutMode(mode.id)}
                  className={`relative px-3 py-1 rounded-full transition-colors focus:outline-none ${
                    active ? 'text-[#2F4B4D] font-medium' : 'text-[#8EABA8] hover:text-[#2F4B4D]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="writing-layout-pill"
                      transition={PILL_SPRING}
                      className="absolute inset-0 rounded-full bg-white shadow-2xs border border-[#C7D9D6]/40 -z-10"
                    />
                  )}
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 分类与标签筛选栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        {/* 分类 Chips（带滑移胶囊背景） */}
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white/40 border border-[#C7D9D6]/45">
          {['all', 'essay', 'tech', 'note'].map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3.5 py-1 rounded-full text-xs font-sans transition-colors duration-200 focus:outline-none ${
                  active ? 'text-[#F3F6F4]' : 'text-[#5C7A7C] hover:text-[#2F4B4D]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="writing-cat-pill"
                    transition={PILL_SPRING}
                    className="absolute inset-0 rounded-full bg-[#2F4B4D] shadow-2xs -z-10"
                  />
                )}
                {cat === 'all' ? '全部' : cat}
              </button>
            );
          })}
        </div>

        {/* 动态标签筛选条 */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {allTags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-sans transition-all focus:outline-none border ${
                    active
                      ? 'bg-[#A7CFC3]/35 border-[#A7CFC3] text-[#2F4B4D] font-medium'
                      : 'bg-white/45 border-[#C7D9D6]/40 text-[#8EABA8] hover:text-[#2F4B4D] hover:bg-white/80'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[11px] text-[#8EABA8] hover:text-[#2F4B4D] px-2 py-0.5 underline underline-offset-2 focus:outline-none"
              >
                重置标签
              </button>
            )}
          </div>
        )}
      </div>

      {/* 空状态兜底 */}
      {filteredArticles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-soft p-12 text-center space-y-3"
        >
          <LeafMotif size={22} color="#A7CFC3" />
          <p className="font-serif text-base text-[#2F4B4D]">没有找到符合条件的文章</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag(null);
              setSearchQuery('');
            }}
            className="px-4 py-1.5 rounded-full bg-white/80 border border-[#C7D9D6] text-xs font-sans text-[#2F4B4D] hover:bg-white transition-colors"
          >
            显示全部文章
          </button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {/* 视图一：经典双栏聚焦预览（带滑移选中背板） */}
          {layoutMode === 'split' && (
            <motion.div
              key="layout-split"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: MIST_EASE }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              {/* 左侧：列表 */}
              <div className="lg:col-span-7 space-y-12">
                {years.map((year) => {
                  const yearArticles = filteredArticles.filter((a) => a.year === year);
                  return (
                    <div key={year} className="space-y-4">
                      {/* 年份标题 */}
                      <div className="font-serif text-2xl font-light text-[#2F4B4D]/75 border-b border-[#C7D9D6]/35 pb-2 flex items-baseline justify-between">
                        <span>{year}</span>
                        <span className="text-xs font-mono text-[#8EABA8]">
                          {yearArticles.length} entries
                        </span>
                      </div>

                      {/* 文章项列表 */}
                      <div className="space-y-1.5">
                        {yearArticles.map((art) => {
                          const isHovered = activePreview?.id === art.id;
                          return (
                            <div
                              key={art.id}
                              onMouseEnter={() => setHoveredArticle(art)}
                              onClick={() => onSelectArticle(art)}
                              className="relative group cursor-pointer p-3.5 sm:p-4 rounded-xl transition-colors duration-200 border border-transparent"
                            >
                              {isHovered && (
                                <motion.div
                                  layoutId="writing-row-highlight"
                                  transition={GENTLE_SPRING}
                                  className="absolute inset-0 rounded-xl bg-white/75 border border-[#C7D9D6]/60 shadow-2xs -z-10"
                                />
                              )}

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
                                  <h3 className="font-serif text-base text-[#2F4B4D] group-hover:text-[#1F3335] group-hover:translate-x-0.5 transition-all truncate">
                                    {art.title}
                                  </h3>
                                </div>

                                {/* 右部：标签与阅读时间 */}
                                <div className="flex items-center gap-2 shrink-0 sm:text-right">
                                  {art.tags && art.tags.length > 0 && (
                                    <div className="hidden md:flex items-center gap-1">
                                      {art.tags.slice(0, 2).map((t) => (
                                        <button
                                          key={t}
                                          onClick={(e) => handleTagToggle(t, e)}
                                          className="text-[10px] text-[#8EABA8] hover:text-[#2F4B4D] bg-white/70 px-1.5 py-0.5 rounded transition-colors focus:outline-none"
                                        >
                                          #{t}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  <span className="font-sans text-xs text-[#8EABA8]">
                                    {art.readTime}
                                  </span>
                                </div>
                              </div>

                              {/* 单行简短摘要 */}
                              {art.excerpt && (
                                <p className="mt-1.5 pl-14 text-xs text-[#5C7A7C]/80 font-serif line-clamp-1">
                                  {art.excerpt}
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

              {/* 右侧：聚焦预览卡 */}
              <div className="hidden lg:block lg:col-span-5 sticky top-36">
                <div className="card-soft p-7 shadow-xs relative overflow-hidden min-h-[390px] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    {activePreview && activePreview.id && (
                      <motion.div
                        key={activePreview.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: MIST_EASE }}
                        className="flex-1 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-serif text-xl font-normal text-[#2F4B4D] leading-snug">
                                {activePreview.title}
                              </h3>
                              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-sans text-[#8EABA8]">
                                <span>{activePreview.date}</span>
                                <span>·</span>
                                <span className="capitalize">{activePreview.category}</span>
                                <span>·</span>
                                <span>{activePreview.readTime}</span>
                              </div>
                              {activePreview.tags && activePreview.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {activePreview.tags.map((t) => (
                                    <span
                                      key={t}
                                      className="text-[10px] text-[#5C7A7C] bg-[#E6EDEB] px-2 py-0.5 rounded-md"
                                    >
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 预览氛围图 */}
                          {activePreview.coverImage && (
                            <div className="w-full h-44 rounded-lg overflow-hidden my-3 relative border border-[#C7D9D6]/30 bg-[#E6EDEB]">
                              <motion.img
                                initial={{ scale: 1.04 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.65, ease: MIST_EASE }}
                                src={activePreview.coverImage}
                                alt={activePreview.title}
                                className="w-full h-full object-cover filter saturate-95"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#2F4B4D]/20 via-transparent to-transparent pointer-events-none" />
                            </div>
                          )}

                          {/* 展开摘要 */}
                          <p className="font-serif text-xs sm:text-sm text-[#5C7A7C] leading-relaxed line-clamp-3 my-3">
                            {activePreview.excerpt}
                          </p>
                        </div>

                        {/* 阅读全文按钮 */}
                        <div className="pt-4 border-t border-[#C7D9D6]/30 flex items-center justify-between mt-auto">
                          <LeafMotif size={14} color="#A7CFC3" />
                          <button
                            onClick={() => onSelectArticle(activePreview)}
                            className="font-sans text-xs text-[#2F4B4D] hover:text-[#1F3335] flex items-center gap-1.5 font-medium group focus:outline-none"
                          >
                            <span>阅读全文</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                              →
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* 视图二：刊物画报网格 */}
          {layoutMode === 'magazine' && (
            <motion.div
              key="layout-magazine"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: MIST_EASE }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {filteredArticles.map((art, idx) => (
                <motion.article
                  key={art.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.045, duration: 0.45, ease: MIST_EASE }}
                  whileHover={{ y: -4 }}
                  onClick={() => onSelectArticle(art)}
                  className="card-soft p-5 sm:p-6 cursor-pointer group hover:border-[#A7CFC3] flex flex-col justify-between gap-4 overflow-hidden"
                >
                  <div>
                    {art.coverImage ? (
                      <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-[#E6EDEB] border border-[#C7D9D6]/30 relative">
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-full h-full object-cover filter saturate-90 group-hover:scale-105 group-hover:saturate-100 transition-all duration-700"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[16/10] rounded-xl mb-4 bg-gradient-to-br from-[#E6EDEB]/80 to-[#F6DCCB]/25 border border-[#C7D9D6]/35 flex flex-col items-center justify-center p-4 text-center">
                        <LeafMotif size={22} color="#A7CFC3" className="mb-2 opacity-80" />
                        <span className="font-serif text-xs text-[#5C7A7C]/80 line-clamp-1">
                          {art.subtitle || art.category}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] font-sans text-[#8EABA8] mb-2">
                      <span className="font-mono">{art.date}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#5C7A7C]">
                        {art.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl text-[#2F4B4D] group-hover:text-[#1F3335] leading-snug mb-2">
                      {art.title}
                    </h3>

                    <p className="font-serif text-xs text-[#5C7A7C] leading-relaxed line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#C7D9D6]/30 flex items-center justify-between text-xs text-[#8EABA8]">
                    <span className="font-sans">{art.readTime}</span>
                    <span className="text-[#2F4B4D] font-sans group-hover:translate-x-1 transition-transform">
                      阅读 →
                    </span>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

          {/* 视图三：极简编年目录 */}
          {layoutMode === 'index' && (
            <motion.div
              key="layout-index"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: MIST_EASE }}
              className="max-w-4xl space-y-12"
            >
              {years.map((year) => {
                const yearArticles = filteredArticles.filter((a) => a.year === year);
                return (
                  <div key={year} className="relative pl-6 sm:pl-10 border-l border-[#C7D9D6]/55 space-y-5">
                    <div className="flex items-baseline gap-3 -ml-[31px] sm:-ml-[47px]">
                      <span className="w-3 h-3 rounded-full bg-[#A7CFC3] border-2 border-[#F3F6F4] inline-block" />
                      <h2 className="font-serif text-2xl font-normal text-[#2F4B4D]">{year}</h2>
                    </div>

                    <div className="divide-y divide-[#C7D9D6]/30">
                      {yearArticles.map((art, idx) => (
                        <motion.div
                          key={art.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.035, duration: 0.35, ease: MIST_EASE }}
                          onClick={() => onSelectArticle(art)}
                          className="group cursor-pointer py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:pl-2 transition-all duration-300"
                        >
                          <div className="flex items-baseline gap-4 min-w-0">
                            <span className="font-mono text-xs text-[#8EABA8] shrink-0">
                              {art.shortDate}
                            </span>
                            <h3 className="font-serif text-base sm:text-lg text-[#2F4B4D] group-hover:text-[#1F3335] truncate">
                              {art.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#8EABA8] shrink-0">
                            {art.tags && art.tags.length > 0 && (
                              <span className="hidden sm:inline text-[11px] text-[#5C7A7C]">
                                #{art.tags[0]}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#5C7A7C] text-[10px]">
                              {art.category}
                            </span>
                            <span className="font-mono text-[11px]">{art.readTime}</span>
                            <span className="group-hover:translate-x-1 transition-transform text-[#2F4B4D]">
                              →
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
