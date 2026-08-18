import React from 'react';
import { motion } from 'framer-motion';
import { ViewMode, Article } from '../types';
import { siteConfig, allArticles } from '../utils/contentLoader';
import { LeafMotif, WavyLineMotif, PeachHeartMotif } from './Motifs';

interface LandingViewProps {
  onNavigateSection: (view: ViewMode) => void;
  onSelectArticle: (article: Article) => void;
  onOpenAboutModal: () => void;
  onTriggerBreeze?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigateSection,
  onSelectArticle,
  onOpenAboutModal,
  onTriggerBreeze,
}) => {
  const latestArticles = allArticles.slice(0, 4);

  const scrollToAbout = () => {
    const aboutEl = document.getElementById('landing-about-section');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* 5.1 Landing 首屏 (Hero 空间) */}
      <section className="relative min-h-[92vh] flex flex-col justify-between px-6 sm:px-12 md:px-20 pt-36 pb-14 max-w-7xl mx-auto">
        {/* 右侧大面积柔和雾气与留白光晕 */}
        <div className="absolute top-1/4 right-8 md:right-24 w-80 md:w-96 h-80 md:h-96 rounded-full bg-[#C7D9D6]/30 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-16 right-1/3 w-64 h-64 rounded-full bg-[#E6EDEB]/70 blur-2xl pointer-events-none -z-10" />

        {/* 左锚定主标题与文案区 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl text-left mt-8 sm:mt-16"
        >
          {/* 中文大标题 + 点击触发微风彩蛋的波线 */}
          <div className="flex items-center gap-5 mb-6">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-[#2F4B4D] tracking-wider leading-none">
              {siteConfig.site.author}
            </h1>
            <button
              onClick={onTriggerBreeze}
              className="group p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
              aria-label="微风"
            >
              <WavyLineMotif
                width={48}
                height={12}
                color="#C7D9D6"
                className="opacity-80 group-hover:opacity-100 group-hover:stroke-[#A7CFC3] transition-all"
              />
            </button>
          </div>

          {/* 英文短句 */}
          <p className="font-sans text-lg sm:text-xl font-normal text-[#2F4B4D] tracking-wide mb-3">
            {siteConfig.site.subtitle_en}
          </p>

          {/* 中文简短副文案 */}
          <p className="font-serif text-sm sm:text-base text-[#5C7A7C] tracking-wide leading-relaxed">
            {siteConfig.site.subtitle_cn}
          </p>
        </motion.div>

        {/* 底部向下滚动引导 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col items-start gap-3 mt-16"
        >
          <button
            onClick={scrollToAbout}
            className="group flex flex-col items-center gap-1.5 text-xs text-[#8EABA8] hover:text-[#2F4B4D] transition-colors focus:outline-none"
          >
            <span className="font-mono text-sm leading-none opacity-60">÷</span>
            <div className="w-4 h-7 rounded-full border border-[#C7D9D6] group-hover:border-[#2F4B4D] flex items-start justify-center p-1 transition-colors">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-1.5 bg-[#A7CFC3] rounded-full"
              />
            </div>
            <span className="font-sans text-[11px] tracking-wider mt-1">向下滚动</span>
          </button>
        </motion.div>
      </section>

      {/* 5.2 About 区块 (自然过渡展示) */}
      <section
        id="landing-about-section"
        className="px-6 sm:px-12 md:px-20 py-20 max-w-7xl mx-auto border-t border-[#C7D9D6]/35"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 左侧：About 介绍与操作 */}
          <div className="lg:col-span-6 space-y-6">
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

            <div>
              <button
                onClick={onOpenAboutModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C7D9D6] bg-white/50 hover:bg-white hover:border-[#A7CFC3] text-xs font-sans text-[#2F4B4D] transition-all duration-300 shadow-2xs focus:outline-none"
              >
                <LeafMotif size={13} color="#A7CFC3" />
                <span>更多关于我</span>
              </button>
            </div>

            {/* 4 项数据统计 */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-[#C7D9D6]/30 max-w-md">
              <div className="space-y-1">
                <div className="font-serif text-2xl font-normal text-[#2F4B4D]">
                  {allArticles.length || siteConfig.profile.stats.articles}
                </div>
                <div className="text-xs text-[#8EABA8] font-sans">文章</div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-2xl font-normal text-[#2F4B4D]">
                  {siteConfig.profile.stats.photos}
                </div>
                <div className="text-xs text-[#8EABA8] font-sans">摄影</div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-2xl font-normal text-[#2F4B4D]">
                  {siteConfig.profile.stats.likes}
                </div>
                <div className="text-xs text-[#8EABA8] font-sans">喜欢</div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-2xl font-normal text-[#2F4B4D]">
                  {siteConfig.profile.stats.topics}
                </div>
                <div className="text-xs text-[#8EABA8] font-sans">主题</div>
              </div>
            </div>
          </div>

          {/* 右侧：水彩留白卡片 / 视觉意象 */}
          <div className="lg:col-span-6 relative">
            <div className="card-soft p-8 sm:p-10 relative overflow-hidden min-h-[220px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C7D9D6]/40 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between text-xs text-[#8EABA8]">
                <span>○ editorial journal</span>
                <button onClick={onTriggerBreeze} className="focus:outline-none hover:scale-125 transition-transform" aria-label="微风">
                  <PeachHeartMotif size={12} color="#F6DCCB" />
                </button>
              </div>

              <div className="my-6 space-y-2">
                <p className="font-serif text-base text-[#2F4B4D] italic leading-relaxed">
                  {siteConfig.profile.quote}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#8EABA8] pt-4 border-t border-[#C7D9D6]/30">
                <span>{siteConfig.site.title}space</span>
                <span className="font-mono">v1.0 · {siteConfig.site.copyright_year}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部条带：最新精选文章预览 */}
        <div className="mt-20 pt-10 border-t border-[#C7D9D6]/35">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#8EABA8] tracking-widest uppercase">
                LATEST
              </span>
              <span className="font-serif text-lg text-[#2F4B4D]">
                最新文章
              </span>
            </div>
            <button
              onClick={() => onNavigateSection('writing')}
              className="text-xs font-sans text-[#5C7A7C] hover:text-[#2F4B4D] flex items-center gap-1 transition-colors focus:outline-none"
            >
              <span>查看全部 ({allArticles.length})</span>
              <span>→</span>
            </button>
          </div>

          {/* 最新文章精简列表 */}
          <div className="space-y-4">
            {latestArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group cursor-pointer p-4 rounded-lg hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-[#C7D9D6]/50 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-[#8EABA8]">{art.shortDate}</span>
                  <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#5C7A7C]">
                    {art.category}
                  </span>
                  <h3 className="font-serif text-base text-[#2F4B4D] group-hover:translate-x-1 transition-transform">
                    {art.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#8EABA8]">
                  <span>{art.readTime}</span>
                  <span className="group-hover:translate-x-1 transition-transform text-[#2F4B4D]">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
