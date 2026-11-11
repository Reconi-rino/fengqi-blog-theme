import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ViewMode, Article } from '../types';
import { siteConfig, allArticles, allNotes, allPhotos } from '../utils/contentLoader';
import { LeafMotif, WavyLineMotif, PeachHeartMotif } from './Motifs';
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
      // easeOutQuart
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
  const [cardMouse, setCardMouse] = useState({ x: 50, y: 50, active: false });

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
          {/* 时序轻问候眉标 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: MIST_EASE }}
            className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/45 border border-[#C7D9D6]/45 backdrop-blur-xs text-[11px] font-sans text-[#5C7A7C] tracking-wider mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A7CFC3] animate-pulse" />
            <span>{greeting.cn}</span>
            <span className="text-[#C7D9D6]">·</span>
            <span className="font-mono uppercase text-[10px] tracking-widest text-[#8EABA8]">
              {greeting.en}
            </span>
          </motion.div>

          {/* 中文大标题 + 点击触发微风彩蛋的动态描边波线 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: MIST_EASE }}
            className="flex items-center gap-5 mb-6"
          >
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-[#2F4B4D] tracking-wider leading-none">
              {siteConfig.site.author}
            </h1>
            <button
              onClick={onTriggerBreeze}
              className="group p-1.5 rounded-full focus:outline-none transition-transform hover:scale-110 active:scale-95"
              aria-label="微风"
              title="吹一阵风 (或按 B 键)"
            >
              <WavyLineMotif
                width={52}
                height={13}
                color="#A7CFC3"
                animated
                className="opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </button>
          </motion.div>

          {/* 英文短句 */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: MIST_EASE }}
            className="font-sans text-lg sm:text-xl font-normal text-[#2F4B4D] tracking-wide mb-3"
          >
            {siteConfig.site.subtitle_en}
          </motion.p>

          {/* 中文简短副文案 */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28, ease: MIST_EASE }}
            className="font-serif text-sm sm:text-base text-[#5C7A7C] tracking-wide leading-relaxed"
          >
            {siteConfig.site.subtitle_cn}
          </motion.p>
        </div>

        {/* 底部栏：左侧向下滚动引导 + 右侧轻量化版块直达胶囊 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.7, ease: MIST_EASE }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mt-16"
        >
          <button
            onClick={scrollToAbout}
            className="group flex flex-col items-start gap-1.5 text-xs text-[#8EABA8] hover:text-[#2F4B4D] transition-colors focus:outline-none self-start"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-7 rounded-full border border-[#C7D9D6] group-hover:border-[#2F4B4D] flex items-start justify-center p-1 transition-colors">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1 h-1.5 bg-[#A7CFC3] rounded-full"
                />
              </div>
              <span className="font-sans text-[11px] tracking-wider">向下阅读 · Scroll</span>
            </div>
          </button>

          {/* 四大板块优雅直达胶囊 */}
          <div className="flex flex-wrap items-center gap-2">
            {quickPortals.map((sec, idx) => (
              <motion.button
                key={sec.id}
                onClick={() => onNavigateSection(sec.id as ViewMode)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 + idx * 0.06, duration: 0.45, ease: MIST_EASE }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group px-3.5 py-1.5 rounded-full bg-white/45 hover:bg-white/85 border border-[#C7D9D6]/50 hover:border-[#A7CFC3] text-xs font-sans text-[#5C7A7C] hover:text-[#2F4B4D] transition-all duration-300 flex items-center gap-2 shadow-2xs focus:outline-none"
              >
                <span className="text-[13px] font-light text-[#8EABA8] group-hover:text-[#2F4B4D] transition-colors">
                  {sec.symbol}
                </span>
                <span>{sec.enName}</span>
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
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: MIST_EASE }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="space-y-1">
              <span className="font-sans text-xs tracking-widest text-[#8EABA8] uppercase">
                ABOUT
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
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAboutModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C7D9D6] bg-white/55 hover:bg-white hover:border-[#A7CFC3] text-xs font-sans text-[#2F4B4D] transition-all duration-300 shadow-2xs focus:outline-none"
              >
                <LeafMotif size={13} color="#A7CFC3" />
                <span>更多关于我</span>
              </motion.button>
              <button
                onClick={() => onNavigateSection('now')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-transparent hover:border-[#C7D9D6]/60 hover:bg-white/40 text-xs font-sans text-[#5C7A7C] hover:text-[#2F4B4D] transition-all focus:outline-none"
              >
                <span>近况 /Now</span>
                <span>→</span>
              </button>
            </div>

            {/* 4 项可点击递增数据统计 */}
            <div className="grid grid-cols-4 gap-3 pt-6 border-t border-[#C7D9D6]/30 max-w-md">
              <button
                onClick={() => onNavigateSection('writing')}
                className="text-left group space-y-1 p-1.5 -ml-1.5 rounded-lg hover:bg-white/40 transition-colors focus:outline-none"
              >
                <AnimatedCounter value={allArticles.length || siteConfig.profile.stats.articles} />
                <div className="text-xs text-[#8EABA8] group-hover:text-[#2F4B4D] font-sans transition-colors">
                  文章
                </div>
              </button>
              <button
                onClick={() => onNavigateSection('photography')}
                className="text-left group space-y-1 p-1.5 rounded-lg hover:bg-white/40 transition-colors focus:outline-none"
              >
                <AnimatedCounter value={allPhotos.length || siteConfig.profile.stats.photos} />
                <div className="text-xs text-[#8EABA8] group-hover:text-[#2F4B4D] font-sans transition-colors">
                  影像
                </div>
              </button>
              <button
                onClick={() => onNavigateSection('notes')}
                className="text-left group space-y-1 p-1.5 rounded-lg hover:bg-white/40 transition-colors focus:outline-none"
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
                className="text-left group space-y-1 p-1.5 rounded-lg hover:bg-white/40 transition-colors focus:outline-none"
              >
                <AnimatedCounter value={siteConfig.profile.stats.topics} />
                <div className="text-xs text-[#8EABA8] group-hover:text-[#2F4B4D] font-sans transition-colors">
                  主题
                </div>
              </button>
            </div>
          </motion.div>

          {/* 右侧：可交互流光心绪片段卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.12, ease: MIST_EASE }}
            className="lg:col-span-6 relative"
          >
            <div
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setCardMouse({
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100,
                  active: true,
                });
              }}
              onMouseLeave={() => setCardMouse((prev) => ({ ...prev, active: false }))}
              className="card-soft p-8 sm:p-10 relative overflow-hidden min-h-[240px] flex flex-col justify-between group"
            >
              {/* 跟随光标的极轻水彩高光 */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                  opacity: cardMouse.active ? 1 : 0,
                  background: `radial-gradient(280px circle at ${cardMouse.x}% ${cardMouse.y}%, rgba(167, 207, 195, 0.22), transparent 65%)`,
                }}
              />
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C7D9D6]/35 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between text-xs text-[#8EABA8]">
                <span className="flex items-center gap-1.5">
                  <span>○</span>
                  <span>{activeFragment.kind}</span>
                </span>
                <div className="flex items-center gap-3">
                  {fragments.length > 1 && (
                    <button
                      onClick={handleNextFragment}
                      className="text-[11px] font-sans text-[#8EABA8] hover:text-[#2F4B4D] px-2 py-0.5 rounded-full hover:bg-white/60 border border-transparent hover:border-[#C7D9D6]/50 transition-all focus:outline-none"
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
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: MIST_EASE }}
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
            </div>
          </motion.div>
        </div>

        {/* 底部条带：最新精选文章预览（支持列表/画报两种排布切换） */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: MIST_EASE }}
          className="mt-20 pt-10 border-t border-[#C7D9D6]/35"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#8EABA8] tracking-widest uppercase">
                LATEST
              </span>
              <span className="font-serif text-lg text-[#2F4B4D]">最新文章</span>
            </div>

            <div className="flex items-center gap-3">
              {/* 视图切换胶囊 */}
              <div className="inline-flex items-center p-0.5 rounded-full bg-white/45 border border-[#C7D9D6]/50 text-[11px] font-sans">
                {(['list', 'cards'] as const).map((mode) => {
                  const active = latestLayout === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setLatestLayout(mode)}
                      className={`relative px-2.5 py-1 rounded-full transition-colors focus:outline-none ${
                        active ? 'text-[#2F4B4D] font-medium' : 'text-[#8EABA8] hover:text-[#2F4B4D]'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="landing-latest-view"
                          transition={PILL_SPRING}
                          className="absolute inset-0 rounded-full bg-white shadow-2xs -z-10"
                        />
                      )}
                      {mode === 'list' ? '≡ 列表' : '⊞ 画报'}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onNavigateSection('writing')}
                className="text-xs font-sans text-[#5C7A7C] hover:text-[#2F4B4D] flex items-center gap-1 transition-colors focus:outline-none"
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
                className="space-y-3"
              >
                {latestArticles.map((art, idx) => (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.35, ease: MIST_EASE }}
                    onClick={() => onSelectArticle(art)}
                    className="group cursor-pointer p-4 rounded-xl hover:bg-white/65 transition-all duration-300 border border-transparent hover:border-[#C7D9D6]/55 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3"
                  >
                    <div className="flex items-baseline gap-4 min-w-0">
                      <span className="font-mono text-xs text-[#8EABA8] shrink-0">
                        {art.shortDate}
                      </span>
                      <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#5C7A7C] shrink-0">
                        {art.category}
                      </span>
                      <h3 className="font-serif text-base text-[#2F4B4D] group-hover:translate-x-1 transition-transform duration-300 truncate">
                        {art.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#8EABA8] shrink-0">
                      <span>{art.readTime}</span>
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
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.4, ease: MIST_EASE }}
                    whileHover={{ y: -3 }}
                    onClick={() => onSelectArticle(art)}
                    className="card-soft p-5 cursor-pointer group hover:border-[#A7CFC3] flex flex-col justify-between gap-4 overflow-hidden"
                  >
                    <div>
                      {art.coverImage && (
                        <div className="w-full h-36 rounded-lg overflow-hidden mb-4 bg-[#E6EDEB] border border-[#C7D9D6]/30">
                          <img
                            src={art.coverImage}
                            alt={art.title}
                            className="w-full h-full object-cover filter saturate-90 group-hover:scale-104 group-hover:saturate-100 transition-all duration-700"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[11px] font-sans text-[#8EABA8] mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{art.date}</span>
                          <span>·</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#5C7A7C]">
                            {art.category}
                          </span>
                        </div>
                        <span>{art.readTime}</span>
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
                            <span key={t} className="text-[10px] bg-[#E6EDEB]/70 px-1.5 py-0.5 rounded">
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
        </motion.div>
      </section>
    </div>
  );
};
