import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewMode } from '../types';
import { siteConfig } from '../utils/contentLoader';
import { LeafMotif } from './Motifs';

interface HeaderProps {
  currentView: ViewMode;
  isIndexExpanded: boolean;
  onToggleIndex: () => void;
  onNavigateHome: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onOpenSecretBase?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  isIndexExpanded,
  onToggleIndex,
  onNavigateHome,
  reducedMotion,
  onToggleReducedMotion,
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

  // 仅在 Landing 首页且未向下滚动时显示灰色副标，在 writing / article / notes 等阅读页面及滚动后平滑淡出收起
  const isScrolled = scrollY > 40;
  const showSubtitle = currentView === 'landing' && !isScrolled && !isIndexExpanded;

  const siteTitle = siteConfig.site.title || 'fengqi.';
  const hasPeriod = siteTitle.endsWith('.');
  const baseTitle = hasPeriod ? siteTitle.slice(0, -1) : siteTitle;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 flex items-center justify-between pointer-events-none transition-all duration-300 ${
        isScrolled
          ? 'py-4 bg-[#F3F6F4]/80 backdrop-blur-md border-b border-[#C7D9D6]/40'
          : 'py-7 bg-transparent border-b border-transparent'
      }`}
    >
      {/* 站点左上角 Logo */}
      <div className="pointer-events-auto flex items-baseline gap-2.5">
        <button
          onClick={onNavigateHome}
          className="group flex items-baseline text-left focus:outline-none"
          title="返回首页"
        >
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#2F4B4D] group-hover:text-[#243B3D] transition-colors">
            {baseTitle}
          </span>
          {hasPeriod && (
            <span
              onClick={handlePeriodClick}
              className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#2F4B4D] hover:text-[#A7CFC3] transition-colors cursor-pointer"
              title="连按 3 次唤醒隐秘之境 ✦"
            >
              .
            </span>
          )}
        </button>

        {/* 灰色副标：整句纯淡入淡出（Opacity + Translate） */}
        <AnimatePresence>
          {showSubtitle && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:inline-block text-xs font-sans text-[#5C7A7C]/70 tracking-widest font-normal whitespace-nowrap"
            >
              — {siteConfig.site.footer_text || 'quiet personal editorial space'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* 右上角操作区：保持纯粹克制 */}
      <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
        {/* 微动效开/关控制 */}
        <button
          onClick={onToggleReducedMotion}
          className="px-2.5 py-1 text-xs rounded-full border border-[#C7D9D6]/60 bg-white/40 backdrop-blur-xs text-[#5C7A7C] hover:text-[#2F4B4D] hover:border-[#A7CFC3] transition-all flex items-center gap-1.5 focus:outline-none"
          title={reducedMotion ? "开启背景动态生态" : "减弱背景动态"}
        >
          <LeafMotif size={13} color={reducedMotion ? "#8EABA8" : "#A7CFC3"} />
          <span className="hidden md:inline font-sans text-[11px]">
            {reducedMotion ? "动效减弱" : "微动态"}
          </span>
        </button>

        {/* 展开式索引入口 (+) / (×) */}
        <button
          onClick={onToggleIndex}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 focus:outline-none ${
            isIndexExpanded
              ? 'bg-[#2F4B4D] text-[#F3F6F4] border-[#2F4B4D] rotate-90 shadow-xs'
              : 'bg-white/60 text-[#2F4B4D] border-[#C7D9D6] hover:border-[#2F4B4D] hover:bg-white'
          }`}
          aria-label={isIndexExpanded ? "关闭展开索引" : "展开导航索引"}
          title={isIndexExpanded ? "收起索引" : "展开索引 (+)"}
        >
          {isIndexExpanded ? (
            <span className="text-xl font-light leading-none -mt-0.5">×</span>
          ) : (
            <span className="text-xl font-light leading-none -mt-0.5">+</span>
          )}
        </button>
      </div>
    </header>
  );
};
