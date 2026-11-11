import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewMode } from '../types';
import { siteConfig } from '../utils/contentLoader';
import { LeafMotif } from './Motifs';
import { ATMOSPHERE_PRESETS, AtmosphereMode, MIST_EASE, GENTLE_SPRING } from '../utils/motion';

interface HeaderProps {
  currentView: ViewMode;
  isIndexExpanded: boolean;
  onToggleIndex: () => void;
  onNavigateHome: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  atmosphere: AtmosphereMode;
  onCycleAtmosphere: (origin?: { x: number; y: number }) => void;
  zenMode?: boolean;
  onOpenSecretBase?: () => void;
}

const VIEW_LABELS: Record<ViewMode, string> = {
  landing: '',
  writing: 'Writing · 书写',
  article: 'Reading · 阅览',
  photography: 'Photography · 影像',
  projects: 'Projects · 实验',
  notes: 'Notes · 随记',
  about: 'About · 关于',
  now: 'Now · 近况',
  elsewhere: 'Elsewhere · 足迹',
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  isIndexExpanded,
  onToggleIndex,
  onNavigateHome,
  reducedMotion,
  onToggleReducedMotion,
  atmosphere,
  onCycleAtmosphere,
  zenMode = false,
  onOpenSecretBase,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 连击 3 次句点触发秘密基地彩蛋
  const handlePeriodClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenSecretBase?.();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1000);
    }
  };

  // 仅在 Landing 首页且未向下滚动时显示灰色副标
  const isScrolled = scrollY > 40;
  const showSubtitle = currentView === 'landing' && !isScrolled && !isIndexExpanded;
  const showBreadcrumb = currentView !== 'landing' && !isIndexExpanded;

  const siteTitle = siteConfig.site.title || 'fengqi.';
  const hasPeriod = siteTitle.endsWith('.');
  const baseTitle = hasPeriod ? siteTitle.slice(0, -1) : siteTitle;

  const activePreset =
    ATMOSPHERE_PRESETS.find((p) => p.id === atmosphere) || ATMOSPHERE_PRESETS[0];

  return (
    <header
      style={
        isScrolled && !isIndexExpanded
          ? { backgroundColor: 'var(--surface-header-bg)' }
          : undefined
      }
      className={`fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 flex items-center justify-between pointer-events-none transition-all duration-500 ${
        isScrolled && !isIndexExpanded
          ? 'py-4 backdrop-blur-md border-b border-[#C7D9D6]/40'
          : 'py-7 bg-transparent border-b border-transparent'
      } ${zenMode && !isIndexExpanded ? 'opacity-25 hover:opacity-100' : 'opacity-100'}`}
    >
      {/* 站点左上角 Logo 与动态面包屑 */}
      <div className="pointer-events-auto flex items-baseline gap-2.5 min-w-0">
        <button
          onClick={onNavigateHome}
          className="group flex items-baseline text-left focus:outline-none shrink-0"
          title="返回首页"
        >
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#2F4B4D] group-hover:text-[#243B3D] transition-colors">
            {baseTitle}
          </span>
          {hasPeriod && (
            <span
              onClick={handlePeriodClick}
              className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#2F4B4D] hover:text-[#A7CFC3] transition-colors cursor-pointer"
            >
              .
            </span>
          )}
        </button>

        {/* 灰色副标或当前页轻面包屑 */}
        <AnimatePresence mode="wait">
          {showSubtitle ? (
            <motion.span
              key="subtitle"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.35, ease: MIST_EASE }}
              className="hidden sm:inline-block text-xs font-sans text-[#5C7A7C]/70 tracking-widest font-normal whitespace-nowrap"
            >
              — {siteConfig.site.footer_text || 'quiet personal editorial space'}
            </motion.span>
          ) : showBreadcrumb ? (
            <motion.span
              key={`crumb-${currentView}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.3, ease: MIST_EASE }}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-sans text-[#8EABA8] tracking-wider whitespace-nowrap"
            >
              <span className="text-[#C7D9D6]">/</span>
              <span>{VIEW_LABELS[currentView] || currentView}</span>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      {/* 右上角操作区：保持纯粹克制与画廊手帖质感 */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 shrink-0">
        {/* 纸境切换按钮：水彩晕染墨碟标牌 */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX || rect.left + rect.width / 2;
            const y = e.clientY || rect.top + rect.height / 2;
            onCycleAtmosphere({ x, y });
          }}
          className="group relative px-2.5 py-1 text-xs rounded-md border border-[#C7D9D6]/65 bg-white/40 backdrop-blur-xs text-[#5C7A7C] hover:text-[#2F4B4D] hover:border-[#A7CFC3] hover:bg-white/75 transition-all flex items-center gap-2 focus:outline-none"
          title={`切换纸境 (${activePreset.name} · ${activePreset.desc})`}
        >
          <span className="relative flex items-center justify-center w-3 h-3">
            <span
              className="absolute inset-0 rounded-full opacity-40 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500"
              style={{ backgroundColor: activePreset.swatchAccent }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full border border-[#2F4B4D]/25 shrink-0 transition-colors duration-500"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${activePreset.swatchPrimary} 20%, ${activePreset.swatchAccent} 100%)`,
              }}
            />
          </span>
          <span className="hidden sm:inline font-serif text-[11px] tracking-wider">
            {activePreset.name}
          </span>
        </motion.button>

        {/* 微动效开/关控制 */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onToggleReducedMotion}
          className="px-2.5 py-1 text-xs rounded-md border border-[#C7D9D6]/65 bg-white/40 backdrop-blur-xs text-[#5C7A7C] hover:text-[#2F4B4D] hover:border-[#A7CFC3] hover:bg-white/75 transition-all flex items-center gap-1.5 focus:outline-none"
          title={reducedMotion ? '开启背景动态生态' : '减弱背景动态'}
        >
          <LeafMotif size={13} color={reducedMotion ? '#8EABA8' : '#A7CFC3'} />
          <span className="hidden md:inline font-sans text-[11px] tracking-wide">
            {reducedMotion ? '静息' : '微动态'}
          </span>
        </motion.button>

        {/* 展开式索引入口 (+) / (×) */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleIndex}
          className={`group relative w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-300 focus:outline-none ${
            isIndexExpanded
              ? 'bg-[#2F4B4D] text-[#F3F6F4] border-[#2F4B4D] shadow-xs'
              : 'bg-white/65 text-[#2F4B4D] border-[#C7D9D6] hover:border-[#2F4B4D] hover:bg-white'
          }`}
          aria-label={isIndexExpanded ? '关闭展开索引' : '展开导航索引'}
          title={isIndexExpanded ? '收起索引 (Esc)' : '展开索引 (+)'}
        >
          {!isIndexExpanded && (
            <span className="pointer-events-none absolute inset-0 rounded-full border border-[#A7CFC3]/50 scale-100 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500" />
          )}
          <motion.svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            animate={{ rotate: isIndexExpanded ? 45 : 0 }}
            transition={GENTLE_SPRING}
          >
            <path
              d="M8 2.5V13.5M2.5 8H13.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.button>
      </div>
    </header>
  );
};
