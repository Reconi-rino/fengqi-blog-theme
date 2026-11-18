import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ViewMode } from '../types';
import { siteConfig, allArticles, allPhotos, allProjects, allNotes } from '../utils/contentLoader';
import { LeafMotif, FlowerMotif, PeachHeartMotif } from './Motifs';
import { SpecimenCorners } from './MistReveal';
import {
  ATMOSPHERE_PRESETS,
  AtmosphereMode,
  MIST_EASE,
  GENTLE_SPRING,
  PILL_SPRING,
} from '../utils/motion';

interface ExpandingIndexProps {
  currentView: ViewMode;
  atmosphere: AtmosphereMode;
  onSelectAtmosphere: (mode: AtmosphereMode, origin?: { x: number; y: number }) => void;
  onSelectSection: (sectionId: ViewMode) => void;
  onClose: () => void;
}

export const ExpandingIndex: React.FC<ExpandingIndexProps> = ({
  currentView,
  atmosphere,
  onSelectAtmosphere,
  onSelectSection,
  onClose,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 动态获取各板块实际数量
  const getSectionCount = (id: string, defaultCount: number) => {
    if (id === 'writing') return allArticles.length || defaultCount;
    if (id === 'photography') return allPhotos.length || defaultCount;
    if (id === 'projects') return allProjects.length || defaultCount;
    if (id === 'notes') return allNotes.length || defaultCount;
    return defaultCount;
  };

  const isSectionActive = (id: string) => {
    if (id === 'writing' && (currentView === 'writing' || currentView === 'article')) {
      return true;
    }
    return currentView === id;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: MIST_EASE }}
      onClick={onClose}
      style={{ backgroundColor: 'var(--surface-veil-bg)' }}
      className="fixed inset-0 z-30 overflow-y-auto backdrop-blur-xl px-6 sm:px-12 pt-28 sm:pt-36 pb-20"
    >
      {/* 主容器 */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.45, ease: MIST_EASE }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="card-soft p-7 sm:p-14 relative overflow-hidden shadow-sm">
          <SpecimenCorners active />
          {/* 背景柔和呼吸水彩微光 */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#E6EDEB]/70 blur-3xl pointer-events-none animate-mist-breathe" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#A7CFC3]/20 blur-3xl pointer-events-none animate-mist-drift" />

          {/* 顶部标题区 */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-9 pb-6 border-b border-[#C7D9D6]/40">
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
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A7CFC3]" />
              <span>INDEX · 索引展开态</span>
            </div>
          </div>

          {/* 4 大核心板块列表（带滑动 Hover 高亮） */}
          <div
            className="relative z-10 space-y-2.5 sm:space-y-3"
            onMouseLeave={() => setHoveredId(null)}
          >
            {siteConfig.sections.map((sec, idx) => {
              const active = isSectionActive(sec.id);
              const isHovered = hoveredId === sec.id;

              return (
                <motion.button
                  key={sec.id}
                  onClick={() => onSelectSection(sec.id as ViewMode)}
                  onMouseEnter={() => setHoveredId(sec.id)}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.05 + idx * 0.055,
                    duration: 0.45,
                    ease: MIST_EASE,
                  }}
                  className={`relative w-full group text-left px-5 sm:px-8 py-5 rounded-xl border transition-colors duration-300 flex items-center justify-between gap-4 focus:outline-none ${
                    active
                      ? 'border-[#A7CFC3]/80 bg-white/75 shadow-2xs'
                      : isHovered
                        ? 'border-[#A7CFC3]/75 bg-white/75 shadow-2xs'
                        : 'border-[#C7D9D6]/40 bg-white/35 hover:border-[#A7CFC3]/70'
                  }`}
                >

                  {/* 左侧：符号 + 英文名 */}
                  <div className="flex items-center gap-4 sm:gap-6 min-w-[145px] sm:min-w-[195px]">
                    <span className="w-6 text-center text-lg font-light text-[#5C7A7C] group-hover:text-[#2F4B4D] group-hover:scale-110 transition-all duration-300">
                      {sec.symbol}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="font-sans text-base sm:text-lg font-medium text-[#2F4B4D] group-hover:translate-x-0.5 transition-transform duration-300">
                        {sec.enName}
                      </span>
                      {active && (
                        <span className="text-[10px] font-sans px-1.5 py-0.5 rounded-full bg-[#A7CFC3]/30 text-[#2F4B4D]">
                          当前
                        </span>
                      )}
                    </div>
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
                  <div className="text-[#8EABA8] group-hover:text-[#2F4B4D] group-hover:translate-x-1.5 transition-all duration-300">
                    <span className="text-lg font-light">→</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* 纸境调色盘选择条：画廊纸签风格，点击坐标向外水墨晕染 */}
          <div className="relative z-10 mt-8 pt-6 border-t border-[#C7D9D6]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#8EABA8] font-sans">
              <span>纸境色调 · Paper Atmosphere</span>
            </div>
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white/45 border border-[#C7D9D6]/45 self-start sm:self-auto">
              {ATMOSPHERE_PRESETS.map((preset) => {
                const isSelected = atmosphere === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      onSelectAtmosphere(preset.id, {
                        x: e.clientX || rect.left + rect.width / 2,
                        y: e.clientY || rect.top + rect.height / 2,
                      });
                    }}
                    className={`relative px-3.5 py-1 rounded-md text-xs font-serif tracking-wider transition-all flex items-center gap-2 focus:outline-none ${
                      isSelected
                        ? 'text-[#2F4B4D] font-medium bg-white shadow-2xs border border-[#C7D9D6]/50'
                        : 'text-[#8EABA8] hover:text-[#2F4B4D] border border-transparent'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-[#2F4B4D]/25"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${preset.swatchPrimary} 20%, ${preset.swatchAccent} 100%)`,
                      }}
                    />
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 底部副级导航与快捷提示 */}
          <div className="relative z-10 mt-6 pt-6 border-t border-[#C7D9D6]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C7A7C]">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
              <button
                onClick={() => onSelectSection('landing')}
                className="hover:text-[#2F4B4D] hover:underline underline-offset-4 transition-colors focus:outline-none"
              >
                Home 首页
              </button>
              <span className="text-[#C7D9D6]">/</span>
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
                Elsewhere 足迹
              </button>
            </div>

            <div className="flex items-center gap-2 text-[#8EABA8]">
              <FlowerMotif size={14} color="#F6DCCB" />
              <span className="text-[11px] font-sans">Esc 收起 · B/W 起风</span>
              <PeachHeartMotif size={11} color="#F6DCCB" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
