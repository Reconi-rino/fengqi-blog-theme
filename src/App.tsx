import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ViewMode, Article } from './types';
import { allArticles, siteConfig } from './utils/contentLoader';
import { AmbientCanvas, AmbientCanvasHandle } from './components/AmbientCanvas';
import { Header } from './components/Header';
import { ExpandingIndex } from './components/ExpandingIndex';
import { LandingView } from './components/LandingView';
import { WritingView } from './components/WritingView';
import { ArticleView } from './components/ArticleView';
import { PhotographyView } from './components/PhotographyView';
import { ProjectsView } from './components/ProjectsView';
import { NotesView } from './components/NotesView';
import { NowView, ElsewhereView } from './components/NowView';
import { AboutModal } from './components/AboutModal';
import { RssModal } from './components/RssModal';
import { InnerWorld } from './components/inner/InnerWorld';
import { LeafMotif, PeachHeartMotif } from './components/Motifs';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [isIndexExpanded, setIsIndexExpanded] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article>(allArticles[0] || ({} as Article));
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isRssModalOpen, setIsRssModalOpen] = useState<boolean>(false);
  const [isInnerWorldOpen, setIsInnerWorldOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const ambientCanvasRef = useRef<AmbientCanvasHandle | null>(null);

  // 键盘暗号缓冲区 (用于连按 secret 或 base 开启内在世界)
  const keySequenceRef = useRef<string[]>([]);
  const keyTimerRef = useRef<any>(null);

  // 动效减弱偏好初始化
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (siteConfig.motion?.default_reduced) return true;
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 锁定/解除 body 滚动条 (进入里世界时避免地表层滚动穿透)
  useEffect(() => {
    if (isInnerWorldOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isInnerWorldOpen]);

  // 触发「起风了」微彩蛋 (Breeze Mode)
  const triggerBreeze = () => {
    if (ambientCanvasRef.current) {
      ambientCanvasRef.current.triggerBreeze();
      showToast('起风了，慢下脚步呼吸 🍃');
    }
  };

  // 键盘快捷键与暗号监听
  useEffect(() => {
    // 1. 打印控制台文气标语
    console.log(
      `%c fengqi. — quiet personal editorial space \n%c“清风徐来，水波不兴。愿你在此，停留片刻。”`,
      'color: #2F4B4D; font-family: serif; font-size: 16px; font-weight: bold; padding: 4px 0;',
      'color: #5C7A7C; font-family: serif; font-size: 13px; font-style: italic; padding-bottom: 6px;'
    );

    // 2. 监听按键
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // 单键微风
      if (e.key === 'b' || e.key === 'B' || e.key === 'w' || e.key === 'W') {
        triggerBreeze();
      }

      // 连续按键暗号识别 (secret / base)
      keySequenceRef.current.push(e.key.toLowerCase());
      if (keySequenceRef.current.length > 8) {
        keySequenceRef.current.shift();
      }

      const currentString = keySequenceRef.current.join('');
      if (currentString.endsWith('secret') || currentString.endsWith('base')) {
        keySequenceRef.current = [];
        setIsInnerWorldOpen(true);
      }

      if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
      keyTimerRef.current = setTimeout(() => {
        keySequenceRef.current = [];
      }, 3000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleIndex = () => {
    setIsIndexExpanded((prev) => !prev);
  };

  const handleSelectSection = (section: ViewMode) => {
    if (section === 'about') {
      setIsAboutModalOpen(true);
      setIsIndexExpanded(false);
      return;
    }
    setCurrentView(section);
    setIsIndexExpanded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    setIsIndexExpanded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('landing');
    setIsIndexExpanded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen misty-background flex flex-col justify-between selection:bg-[#A7CFC3]/30 selection:text-[#2F4B4D]">
      {/* 背景微生态粒子 Canvas */}
      <AmbientCanvas ref={ambientCanvasRef} reducedMotion={reducedMotion} />

      {/* 顶部全局导航栏 */}
      <Header
        currentView={currentView}
        isIndexExpanded={isIndexExpanded}
        onToggleIndex={handleToggleIndex}
        onNavigateHome={handleNavigateHome}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
        onOpenSecretBase={() => setIsInnerWorldOpen(true)}
      />

      {/* 主视图区域 */}
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {isIndexExpanded ? (
            /* 原位自体展开索引态 */
            <ExpandingIndex
              key="expanding-index"
              onSelectSection={handleSelectSection}
              onClose={() => setIsIndexExpanded(false)}
            />
          ) : (
            /* 各常规视图 */
            <motion.div
              key={currentView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {currentView === 'landing' && (
                <LandingView
                  onNavigateSection={handleSelectSection}
                  onSelectArticle={handleSelectArticle}
                  onOpenAboutModal={() => setIsAboutModalOpen(true)}
                  onTriggerBreeze={triggerBreeze}
                />
              )}

              {currentView === 'writing' && (
                <WritingView onSelectArticle={handleSelectArticle} />
              )}

              {currentView === 'article' && (
                <ArticleView
                  article={selectedArticle}
                  onBackToWriting={() => setCurrentView('writing')}
                  onShowToast={showToast}
                />
              )}

              {currentView === 'photography' && <PhotographyView />}

              {currentView === 'projects' && <ProjectsView />}

              {currentView === 'notes' && <NotesView />}

              {currentView === 'now' && <NowView />}

              {currentView === 'elsewhere' && <ElsewhereView />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 底部极轻页脚 */}
      <footer className="relative z-10 px-6 py-8 text-center text-xs text-[#8EABA8] font-sans border-t border-[#C7D9D6]/25">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-2">
          <div className="flex items-center gap-1.5 text-[#8EABA8]">
            <LeafMotif size={13} color="#A7CFC3" />
            <span>{siteConfig.site.title}space · {siteConfig.site.footer_text}</span>
          </div>
          <span className="text-[#C7D9D6]">/</span>
          <button
            onClick={() => setIsRssModalOpen(true)}
            className="text-[#8EABA8] hover:text-[#2F4B4D] hover:underline underline-offset-4 transition-colors flex items-center gap-1 focus:outline-none"
          >
            <span>RSS Feed</span>
          </button>
          <span className="text-[#C7D9D6]">/</span>
          <button
            onClick={triggerBreeze}
            className="text-[#8EABA8] hover:text-[#2F4B4D] hover:scale-125 transition-all focus:outline-none"
            aria-label="微风"
          >
            <PeachHeartMotif size={11} color="#F6DCCB" />
          </button>
        </div>
        <p className="text-[11px] text-[#8EABA8]/70">
          All words & photographs © {siteConfig.site.copyright_year} {siteConfig.site.author}. All rights reserved.
        </p>
      </footer>

      {/* 全局关于我 Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenRss={() => setIsRssModalOpen(true)}
      />

      {/* 全局 RSS 订阅 Modal */}
      <RssModal
        isOpen={isRssModalOpen}
        onClose={() => setIsRssModalOpen(false)}
        onShowToast={showToast}
      />

      {/* 全屏内在世界 (Inner World) 沉浸式视图（fixed 全屏遮罩层） */}
      <AnimatePresence>
        {isInnerWorldOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 overflow-hidden bg-[#0E1316]"
          >
            <InnerWorld
              onExitToSurface={() => {
                setIsInnerWorldOpen(false);
                showToast('已返回地表');
              }}
              onShowToast={showToast}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 浮动轻量 Toast 提示 */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#2F4B4D] text-[#F3F6F4] text-xs font-sans shadow-lg flex items-center gap-2 backdrop-blur-md"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
