import React from 'react';
import { motion } from 'framer-motion';
import { ViewMode } from '../types';
import { siteConfig, allArticles, allPhotos, allProjects, allNotes } from '../utils/contentLoader';
import { LeafMotif, FlowerMotif, PeachHeartMotif } from './Motifs';

interface ExpandingIndexProps {
  onSelectSection: (sectionId: ViewMode) => void;
  onClose: () => void;
}

export const ExpandingIndex: React.FC<ExpandingIndexProps> = ({
  onSelectSection,
  onClose,
}) => {
  // 动态获取各板块实际数量
  const getSectionCount = (id: string, defaultCount: number) => {
    if (id === 'writing') return allArticles.length || defaultCount;
    if (id === 'photography') return allPhotos.length || defaultCount;
    if (id === 'projects') return allProjects.length || defaultCount;
    if (id === 'notes') return allNotes.length || defaultCount;
    return defaultCount;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.99 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto pt-28 sm:pt-36 pb-20 px-6 sm:px-12"
    >
      {/* 展开态主容器 */}
      <div className="card-soft p-8 sm:p-14 relative overflow-hidden shadow-xs border border-[#C7D9D6]/60">
        {/* 背景轻微水彩微光 */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#E6EDEB]/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#A7CFC3]/15 blur-3xl pointer-events-none" />

        {/* 顶部标题区 */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10 pb-6 border-b border-[#C7D9D6]/40">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2F4B4D] tracking-wide">
                {siteConfig.site.author}
              </h2>
              <LeafMotif size={20} color="#A7CFC3" />
            </div>
            <p className="mt-2 text-sm text-[#5C7A7C] font-sans">
              在记录中，慢慢呼吸。
            </p>
          </div>
          <div className="text-xs text-[#8EABA8] font-sans tracking-wider flex items-center gap-2">
            <span>INDEX · 索引展开态</span>
          </div>
        </div>

        {/* 4 大核心板块列表 */}
        <div className="space-y-3 sm:space-y-4">
          {siteConfig.sections.map((sec, idx) => (
            <motion.button
              key={sec.id}
              onClick={() => onSelectSection(sec.id as ViewMode)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * idx, duration: 0.35 }}
              className="w-full group text-left px-5 sm:px-8 py-5 rounded-lg border border-[#C7D9D6]/40 bg-white/40 hover:bg-white/80 hover:border-[#A7CFC3] hover:shadow-xs transition-all duration-300 flex items-center justify-between gap-4 focus:outline-none"
            >
              {/* 左侧：符号 + 英文名 */}
              <div className="flex items-center gap-4 sm:gap-6 min-w-[140px] sm:min-w-[190px]">
                <span className="w-6 text-center text-lg font-light text-[#5C7A7C] group-hover:text-[#2F4B4D] transition-colors">
                  {sec.symbol}
                </span>
                <span className="font-sans text-base sm:text-lg font-medium text-[#2F4B4D] group-hover:translate-x-0.5 transition-transform">
                  {sec.enName}
                </span>
              </div>

              {/* 中间：数量统计 */}
              <span className="font-mono text-xs sm:text-sm text-[#8EABA8] group-hover:text-[#5C7A7C] transition-colors">
                {String(getSectionCount(sec.id, sec.count)).padStart(2, '0')}
              </span>

              {/* 中右：中文简短描述 */}
              <span className="hidden md:inline-block flex-1 text-xs text-[#5C7A7C]/80 font-sans pl-4">
                {sec.desc}
              </span>

              {/* 右侧进入箭头 */}
              <div className="text-[#8EABA8] group-hover:text-[#2F4B4D] group-hover:translate-x-1 transition-all">
                <span className="text-lg font-light">→</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* 底部副级导航 (已彻底移除显性 secret 入口，回归纯粹彩蛋) */}
        <div className="mt-10 pt-6 border-t border-[#C7D9D6]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C7A7C]">
          <div className="flex items-center gap-5">
            <button
              onClick={() => onSelectSection('about')}
              className="hover:text-[#2F4B4D] hover:underline underline-offset-4 transition-colors focus:outline-none"
            >
              About 关于
            </button>
            <span className="text-[#C7D9D6]">/</span>
            <button
              onClick={() => onSelectSection('now')}
              className="hover:text-[#2F4B4D] hover:underline underline-offset-4 transition-colors focus:outline-none"
            >
              Now 近况
            </button>
            <span className="text-[#C7D9D6]">/</span>
            <button
              onClick={() => onSelectSection('elsewhere')}
              className="hover:text-[#2F4B4D] hover:underline underline-offset-4 transition-colors focus:outline-none"
            >
              Elsewhere 外部连接
            </button>
          </div>

          <div className="flex items-center gap-2 text-[#8EABA8]">
            <FlowerMotif size={14} color="#F6DCCB" />
            <span className="text-[11px] font-sans">一切从简，留白给呼吸。</span>
            <PeachHeartMotif size={11} color="#F6DCCB" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
