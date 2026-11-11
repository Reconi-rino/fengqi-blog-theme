import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ViewMode, Article } from '../types';
import { siteConfig, allArticles, allNotes, allPhotos } from '../utils/contentLoader';
import { LeafMotif, WavyLineMotif, PeachHeartMotif } from './Motifs';
import {
  MistReveal,
  EditorialRule,
  CurtainImage,
  SpecimenCorners,
} from './MistReveal';
import { getTimeGreeting, MIST_EASE, PILL_SPRING, GENTLE_SPRING } from '../utils/motion';

interface LandingViewProps {
  onNavigateSection: (view: ViewMode) => void;
  onSelectArticle: (article: Article) => void;
  onOpenAboutModal: () => void;
  onTriggerBreeze?: () => void;
}

// 视口进入时轻柔滚动递增数字
const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const duration = 900;
    let frameId: number;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value]);

  return (
    <div ref={ref} className="font-serif text-2xl font-normal text-[#2F4B4D] tabular-nums">
      {displayValue}
    </div>
  );
};

// 板块符号专属交互微动效
const AnimatedPortalSymbol: React.FC<{ id: string; symbol: string }> = ({ id, symbol }) => {
  if (id === 'photography') {
    return (
      <span className="inline-block text-[13px] font-light text-[#8EABA8] group-hover:text-[#2F4B4D] group-hover:rotate-45 transition-all duration-400">
        {symbol}
      </span>
    );
  }
  if (id === 'projects') {
    return (
      <span className="inline-block text-[14px] font-light text-[#8EABA8] group-hover:text-[#2F4B4D] group-hover:rotate-90 transition-all duration-400">
        {symbol}
      </span>
    );
  }
  if (id === 'writing') {
    return (
      <span className="relative inline-flex items-center justify-center text-[13px] font-light text-[#8EABA8] group-hover:text-[#2F4B4D] transition-colors duration-300">
        <span className="absolute w-4 h-4 rounded-full border border-[#A7CFC3]/60 scale-75 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500" />
        {symbol}
      </span>
    );
  }
  return (
    <span className="inline-block text-[14px] font-light text-[#8EABA8] group-hover:text-[#2F4B4D] group-hover:scale-110 transition-all duration-300">
      {symbol}
    </span>
  );
};

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigateSection,
  onSelectArticle,
  onOpenAboutModal,
  onTriggerBreeze,
}) => {
  const latestArticles = allArticles.slice(0, 4);
  const greeting = useMemo(() => getTimeGreeting(), []);

  // 最新文章视图模式：列表 / 画报卡片
  const [latestLayout, setLatestLayout] = useState<'list' | 'cards'>('list');

  // 右侧心绪卡片内容池（站点座右铭 + 精选随记摘录）
  const fragments = useMemo(() => {
    const list: Array<{ text: string; source: string; kind: string }> = [
      {
        text: siteConfig.profile.quote,
        source: `${siteConfig.site.title}space`,
        kind: 'editorial journal',
      },
    ];
    allNotes.slice(0, 4).forEach((n) => {
      list.push({
        text: n.content,
        source: `${n.date}${n.weather ? ` · ${n.weather}` : ''}`,
        kind: n.tag ? `note · ${n.tag}` : 'note fragment',
      });
    });
    return list;
  }, []);

  const [fragmentIndex, setFragmentIndex] = useState(0);
  const [cardMouse, setCardMouse] = useState({
    x: 50,
    y: 50,
    rx: 0,
    ry: 0,
    active: false,
  });

  const activeFragment = fragments[fragmentIndex % fragments.length];

  const handleNextFragment = () => {
    setFragmentIndex((prev) => (prev + 1) % fragments.length);
  };

  const scrollToAbout = () => {
    const aboutEl = document.getElementById('landing-about-section');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickPortals = siteConfig.sections.slice(0, 4);

  return (
    <div className="w-full min-h-screen">
      {/* 5.1 Landing 首屏 (Hero 空间) */}
      <section className="relative min-h-[92vh] flex flex-col justify-between px-6 sm:px-12 md:px-20 pt-36 pb-14 max-w-7xl mx-auto">
        {/* 右侧大面积呼吸水彩雾气与留白光晕 */}
        <div className="absolute top-1/4 right-8 md:right-24 w-80 md:w-[420px] h-80 md:h-[420px] rounded-full bg-[#C7D9D6]/30 blur-3xl pointer-events-none -z-10 animate-mist-breathe" />
        <div className="absolute bottom-16 right-1/3 w-64 h-64 rounded-full bg-[#E6EDEB]/70 blur-2xl pointer-events-none -z-10 animate-mist-drift" />
        <div className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full bg-[#F6DCCB]/18 blur-3xl pointer-events-none -z-10 animate-mist-breathe" />

        {/* 左锚定主标题与文案区 */}
        <div className="max-w-2xl text-left mt-6 sm:mt-14">
          {/* 刊头细线时序眉标（取代圆角药丸） */}
          <div className="flex items-center gap-3 mb-7 text-[#5C7A7C]">
            <EditorialRule className="w-8 sm:w-10 text-[#A7CFC3]" delay={0.05} />
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: MIST_EASE }}
              className="flex items-center gap-2 text-[11px] font-sans tracking-widest"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A7CFC3] animate-pulse" />
              <span className="font-serif text-[#2F4B4D]/85">{greeting.cn}</span>
              <span className="text-[#C7D9D6]">/</span>
              <span className="font-mono uppercase text-[10px] tracking-[0.2em] text-[#8EABA8]">
                {greeting.en}
              </span>
            </motion.div>
          </div>

          {/* 中文大标题（雾感凝实浮现）+ 动态描边波线 */}
          <MistReveal delay={0.1} duration={0.9} yOffset={22} blurAmount={9} className="mb-6">
            <div className="flex items-center gap-5">
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-[#2F4B4D] tracking-wider leading-none">
                {siteConfig.site.author}
              </h1>
              <button
                onClick={onTriggerBreeze}
                className="group p-1.5 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                aria-label="微风"
                title="吹一阵风 (或按 B 键)"
              >
                <WavyLineMotif
                  width={54}
                  height={13}
                  color="#A7CFC3"
                  animated
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </button>
            </div>
          </MistReveal>

          {/* 英文短句 */}
          <MistReveal delay={0.24} duration={0.8} yOffset={14} blurAmount={5}>
            <p className="font-sans text-lg sm:text-xl font-normal text-[#2F4B4D] tracking-wide mb-3">
              {siteConfig.site.subtitle_en}
            </p>
          </MistReveal>

          {/* 中文简短副文案 */}
          <MistReveal delay={0.34} duration={0.85} yOffset={12} blurAmount={5}>
            <p className="font-serif text-sm sm:text-base text-[#5C7A7C] tracking-wide leading-relaxed">
              {siteConfig.site.subtitle_cn}
            </p>
          </MistReveal>
        </div>

        {/* 底部栏：左侧向下阅读引导 + 右侧刊物级目录书签索引（告别普通药丸） */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.75, ease: MIST_EASE }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mt-16"
        >
          <button
            onClick={scrollToAbout}
            className="group flex items-center gap-3 text-xs text-[#8EABA8] hover:text-[#2F4B4D] transition-colors focus:outline-none self-start"
          >
            <div className="w-4 h-7 rounded-sm border border-[#C7D9D6]/80 group-hover:border-[#2F4B4D] flex items-start justify-center p-1 transition-colors">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-0.5 h-1.5 bg-[#A7CFC3] rounded-full"
              />
            </div>
            <div className="text-left">
              <span className="block font-mono text-[10px] tracking-[0.18em] uppercase text-[#8EABA8]">
                SCROLL
              </span>
              <span className="font-serif text-[11px] tracking-wider">向下阅读</span>
            </div>
          </button>

          {/* 四大板块风格化「刊物折页索引条」 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 w-full lg:w-auto">
            {quickPortals.map((sec, idx) => (
              <motion.button
                key={sec.id}
                onClick={() => onNavigateSection(sec.id as ViewMode)}
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.48 + idx * 0.075,
                  duration: 0.6,
                  ease: MIST_EASE,
                }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group relative text-left px-3.5 py-2.5 rounded-md border-b border-[#C7D9D6]/65 bg-white/25 hover:bg-white/60 backdrop-blur-xs transition-colors duration-300 focus:outline-none overflow-hidden"
              >
                {/* 悬浮底部墨迹笔刷展开线 */}
                <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#2F4B4D] via-[#A7CFC3] to-transparent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />

                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="font-mono text-[10px] tracking-widest text-[#8EABA8]/80 group-hover:text-[#5C7A7C] transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <AnimatedPortalSymbol id={sec.id} symbol={sec.symbol} />
                </div>

                <div className="font-sans text-xs sm:text-[13px] font-medium text-[#2F4B4D] tracking-wide group-hover:translate-x-0.5 transition-transform duration-300">
                  {sec.enName}
                </div>
                <div className="font-serif text-[10px] text-[#8EABA8] group-hover:text-[#5C7A7C] transition-colors mt-0.5 truncate">
                  {sec.cnName}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5.2 About 区块 (随视口平滑显现) */}
      <section
        id="landing-about-section"
        className="px-6 sm:px-12 md:px-20 py-20 max-w-7xl mx-auto border-t border-[#C7D9D6]/35"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 左侧：About 介绍与交互统计 */}
          <MistReveal
            viewportOnce
            duration={0.75}
            yOffset={18}
            blurAmount={5}
            className="lg:col-span-6 space-y-6"
          >
            <div className="space-y-1">
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#8EABA8] uppercase">
                ABOUT · 关于
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#2F4B4D]">
                关于我
              </h2>
            </div>

            <div className="font-serif text-sm sm:text-base text-[#5C7A7C] leading-relaxed space-y-2 max-w-lg">
              {siteConfig.profile.bio.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAboutModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#C7D9D6]/75 bg-white/50 hover:bg-white hover:border-[#A7CFC3] text-xs font-sans text-[#2F4B4D] transition-all duration-300 shadow-2xs focus:outline-none"
              >
                <LeafMotif size={13} color="#A7CFC3" />
                <span>更多关于我</span>
              </motion.button>
              <button
                onClick={() => onNavigateSection('now')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-[#5C7A7C] hover:text-[#2F4B4D] border-b border-transparent hover:border-[#A7CFC3] transition-all focus:outline-none"
              >
                <span>近况 /Now</span>
                <span>→</span>
              </button>
            </div>

            {/* 4 项可点击递增数据统计 */}
            <div className="grid grid-cols-4 gap-3 pt-6 border-t border-[#C7D9D6]/30 max-w-md">
              <button
                onClick={() => onNavigateSection('writing')}
                className="text-left group space-y-1 p-1.5 -ml-1.5 rounded-md hover:bg-white/45 transition-colors focus:outline-none"
              >
                <AnimatedCounter value={allArticles.length || siteConfig.profile.stats.articles} />
                <div className="text-xs text-[#8EABA8] group-hover:text-[#2F4B4D] font-sans transition-colors">
                  文章
                </div>
              </button>
              <button
                onClick={() => onNavigateSection('photography')}
                className="text-left group space-y-1 p-1.5 rounded-md hover:bg-white/45 transition-colors focus:outline-none"
              >
                <AnimatedCounter value={allPhotos.length || siteConfig.profile.stats.photos} />
                <div className="text-xs text-[#8EABA8] group-hover:text-[#2F4B4D] font-sans transition-colors">
                  影像
                </div>
              </button>
              <button
                onClick={() => onNavigateSection('notes')}
                className="text-left group space-y-1 p-1.5 rounded-md hover:bg-white/45 transition-colors focus:outline-none"
              >
                <AnimatedCounter
                  value={allNotes.length || siteConfig.sections.find((s) => s.id === 'notes')?.count || 35}
                />
                <div className="text-xs text-[#8EABA8] group-hover:text-[#2F4B4D] font-sans transition-colors">
                  随记
                </div>
              </button>
              <button
                onClick={() => onNavigateSection('projects')}
                className="text-left group space-y-1 p-1.5 rounded-md hover:bg-white/45 transition-colors focus:outline-none"
              >
                <AnimatedCounter value={siteConfig.profile.stats.topics} />
                <div className="text-xs text-[#8EABA8] group-hover:text-[#2F4B4D] font-sans transition-colors">
                  主题
                </div>
              </button>
            </div>
          </MistReveal>

          {/* 右侧：带印刷角标与 3D 视差微倾的心绪手帖卡片 */}
          <MistReveal
            viewportOnce
            delay={0.12}
            duration={0.8}
            yOffset={18}
            blurAmount={5}
            className="lg:col-span-6 relative"
          >
            <motion.div
              animate={{
                rotateX: cardMouse.rx,
                rotateY: cardMouse.ry,
              }}
              transition={GENTLE_SPRING}
              style={{ transformPerspective: 900 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;
                setCardMouse({
                  x: px * 100,
                  y: py * 100,
                  rx: (0.5 - py) * 3.5,
                  ry: (px - 0.5) * 3.5,
                  active: true,
                });
              }}
              onMouseLeave={() =>
                setCardMouse({ x: 50, y: 50, rx: 0, ry: 0, active: false })
              }
              className="card-soft p-8 sm:p-10 relative overflow-hidden min-h-[245px] flex flex-col justify-between group"
            >
              {/* 印刷裁切线角标 */}
              <SpecimenCorners active={cardMouse.active} />

              {/* 跟随光标的极轻水彩晕染高光 */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                  opacity: cardMouse.active ? 1 : 0,
                  background: `radial-gradient(280px circle at ${cardMouse.x}% ${cardMouse.y}%, rgba(167, 207, 195, 0.24), transparent 65%)`,
                }}
              />
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C7D9D6]/35 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between text-xs text-[#8EABA8]">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span>○</span>
                  <span>{activeFragment.kind}</span>
                </span>
                <div className="flex items-center gap-3">
                  {fragments.length > 1 && (
                    <button
                      onClick={handleNextFragment}
                      className="text-[11px] font-sans text-[#8EABA8] hover:text-[#2F4B4D] px-2 py-0.5 rounded-sm border-b border-transparent hover:border-[#A7CFC3] transition-all focus:outline-none"
                      title="切换心绪摘录"
                    >
                      换一句 ↻
                    </button>
                  )}
                  <button
                    onClick={onTriggerBreeze}
                    className="focus:outline-none hover:scale-125 transition-transform"
                    aria-label="微风"
                  >
                    <PeachHeartMotif size={12} color="#F6DCCB" />
                  </button>
                </div>
              </div>

              <div className="relative z-10 my-6 min-h-[76px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={fragmentIndex}
                    initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                    transition={{ duration: 0.38, ease: MIST_EASE }}
                    className="font-serif text-base text-[#2F4B4D] italic leading-relaxed"
                  >
                    {activeFragment.text}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="relative z-10 flex items-center justify-between text-[11px] text-[#8EABA8] pt-4 border-t border-[#C7D9D6]/30">
                <span>{activeFragment.source}</span>
                <span className="font-mono">
                  {fragmentIndex + 1} / {fragments.length} · {siteConfig.site.copyright_year}
                </span>
              </div>
            </motion.div>
          </MistReveal>
        </div>

        {/* 底部条带：最新精选文章预览（下划线式极简视图切换） */}
        <MistReveal
          viewportOnce
          duration={0.7}
          yOffset={18}
          blurAmount={4}
          className="mt-20 pt-10 border-t border-[#C7D9D6]/35"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#8EABA8] tracking-widest uppercase">
                LATEST
              </span>
              <span className="font-serif text-lg text-[#2F4B4D]">最新文章</span>
            </div>

            <div className="flex items-center gap-5">
              {/* 风格化下划线视图切换 */}
              <div className="inline-flex items-center gap-4 text-xs font-sans border-b border-[#C7D9D6]/40">
                {(['list', 'cards'] as const).map((mode) => {
                  const active = latestLayout === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setLatestLayout(mode)}
                      className={`relative pb-1.5 transition-colors focus:outline-none ${
                        active ? 'text-[#2F4B4D] font-medium' : 'text-[#8EABA8] hover:text-[#2F4B4D]'
                      }`}
                    >
                      {mode === 'list' ? '≡ 列表' : '⊞ 画报'}
                      {active && (
                        <motion.span
                          layoutId="landing-latest-view"
                          transition={PILL_SPRING}
                          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2F4B4D]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onNavigateSection('writing')}
                className="text-xs font-sans text-[#5C7A7C] hover:text-[#2F4B4D] flex items-center gap-1 transition-colors focus:outline-none pb-1"
              >
                <span>查看全部 ({allArticles.length})</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {latestLayout === 'list' ? (
              <motion.div
                key="latest-list"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: MIST_EASE }}
                className="space-y-2.5"
              >
                {latestArticles.map((art, idx) => (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.055, duration: 0.4, ease: MIST_EASE }}
                    onClick={() => onSelectArticle(art)}
                    className="group cursor-pointer p-4 rounded-lg hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-[#C7D9D6]/55 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3"
                  >
                    <div className="flex items-baseline gap-4 min-w-0">
                      <span className="font-mono text-xs text-[#8EABA8] shrink-0">
                        {art.shortDate}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#E6EDEB]/80 text-[#5C7A7C] border border-[#C7D9D6]/40 shrink-0">
                        {art.category}
                      </span>
                      <h3 className="font-serif text-base text-[#2F4B4D] group-hover:translate-x-1 transition-transform duration-300 truncate">
                        {art.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#8EABA8] shrink-0">
                      <span className="font-mono text-[11px]">{art.readTime}</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300 text-[#2F4B4D]">
                        →
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="latest-cards"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: MIST_EASE }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {latestArticles.map((art, idx) => (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: idx * 0.06, duration: 0.5, ease: MIST_EASE }}
                    whileHover={{ y: -3 }}
                    onClick={() => onSelectArticle(art)}
                    className="card-soft p-5 cursor-pointer group hover:border-[#A7CFC3] flex flex-col justify-between gap-4 overflow-hidden relative"
                  >
                    <div>
                      {art.coverImage && (
                        <CurtainImage
                          src={art.coverImage}
                          alt={art.title}
                          delay={idx * 0.06}
                          className="w-full h-36 rounded-lg mb-4 bg-[#E6EDEB] border border-[#C7D9D6]/30"
                          imgClassName="w-full h-full object-cover filter saturate-90 group-hover:scale-105 group-hover:saturate-100 transition-all duration-700"
                        />
                      )}
                      <div className="flex items-center justify-between text-[11px] font-sans text-[#8EABA8] mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{art.date}</span>
                          <span>·</span>
                          <span className="px-2 py-0.5 rounded-sm bg-[#E6EDEB]/80 text-[#5C7A7C] font-mono text-[10px] uppercase">
                            {art.category}
                          </span>
                        </div>
                        <span className="font-mono">{art.readTime}</span>
                      </div>
                      <h3 className="font-serif text-lg text-[#2F4B4D] group-hover:text-[#1F3335] mb-1.5">
                        {art.title}
                      </h3>
                      <p className="font-serif text-xs text-[#5C7A7C] leading-relaxed line-clamp-2">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#C7D9D6]/30 flex items-center justify-between text-xs text-[#8EABA8]">
                      <div className="flex gap-1.5 truncate">
                        {art.tags && art.tags.length > 0 ? (
                          art.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono bg-[#E6EDEB]/70 px-1.5 py-0.5 rounded-sm"
                            >
                              #{t}
                            </span>
                          ))
                        ) : (
                          <LeafMotif size={12} color="#A7CFC3" />
                        )}
                      </div>
                      <span className="text-[#2F4B4D] font-sans group-hover:translate-x-1 transition-transform duration-300">
                        阅读 →
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </MistReveal>
      </section>
    </div>
  );
};
