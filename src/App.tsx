import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Router, Route, Switch, useLocation, useParams } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ViewMode, Article } from './types';
import { allArticles, siteConfig } from './utils/contentLoader';
import { ATMOSPHERE_PRESETS, AtmosphereMode, MIST_EASE } from './utils/motion';
import { AmbientCanvas, AmbientCanvasHandle } from './components/AmbientCanvas';
import { WatercolorTransition, WatercolorBloomEvent } from './components/WatercolorTransition';
import { Header } from './components/Header';
import { ExpandingIndex } from './components/ExpandingIndex';
import { LandingView } from './components/LandingView';
import { WritingView } from './components/WritingView';
import { ArticleView } from './components/ArticleView';
import { PhotographyView } from './components/PhotographyView';
import { ProjectsView } from './components/ProjectsView';
import { NotesView } from './components/NotesView';
import { NowView, ElsewhereView } from './components/NowView';
import { StudentInfoView } from './components/StudentInfoView';
import { AboutModal } from './components/AboutModal';
import { RssModal } from './components/RssModal';
import { InnerWorld } from './components/inner/InnerWorld';
import { LeafMotif, PeachHeartMotif } from './components/Motifs';

// 单篇文章路由匹配包装组件
function ArticleDetailWrapper({
  onSelectArticle,
  onShowToast,
  onTriggerBreeze,
  zenMode,
  onToggleZenMode,
}: {
  onSelectArticle: (article: Article) => void;
  onShowToast: (msg: string) => void;
  onTriggerBreeze?: () => void;
  zenMode: boolean;
  onToggleZenMode: () => void;
}) {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const rawSlug = params.slug || '';
  const decodedSlug = decodeURIComponent(rawSlug).replace(/\/$/, '');
  const cleanRawSlug = rawSlug.replace(/\/$/, '');

  const articleIndex = allArticles.findIndex(
    (a) =>
      a.slug === cleanRawSlug ||
      a.id === cleanRawSlug ||
      a.slug === decodedSlug ||
      a.id === decodedSlug
  );
  const article = articleIndex >= 0 ? allArticles[articleIndex] : undefined;

  if (!article) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-40 text-center px-6">
        <h2 className="font-serif text-2xl text-[#2F4B4D] mb-3">未找到该文章</h2>
        <p className="text-xs text-[#8EABA8] mb-6 font-sans">
          文章可能已被重命名或已归档
        </p>
        <button
          onClick={() => setLocation('/writing')}
          className="px-4 py-1.5 rounded-full border border-[#C7D9D6] text-xs text-[#2F4B4D] hover:bg-white transition-colors"
        >
          返回文章归档
        </button>
      </div>
    );
  }

  const prevArticle = articleIndex > 0 ? allArticles[articleIndex - 1] : null;
  const nextArticle =
    articleIndex < allArticles.length - 1 ? allArticles[articleIndex + 1] : null;

  return (
    <ArticleView
      article={article}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
      onSelectArticle={onSelectArticle}
      onBackToWriting={() => setLocation('/writing')}
      onShowToast={onShowToast}
      onTriggerBreeze={onTriggerBreeze}
      zenMode={zenMode}
      onToggleZenMode={onToggleZenMode}
    />
  );
}

function MainApp() {
  const [location, setLocation] = useLocation();
  const [isIndexExpanded, setIsIndexExpanded] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isRssModalOpen, setIsRssModalOpen] = useState<boolean>(false);
  const [isInnerWorldOpen, setIsInnerWorldOpen] = useState<boolean>(false);
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [watercolorBloom, setWatercolorBloom] = useState<WatercolorBloomEvent | null>(null);
  const ambientCanvasRef = useRef<AmbientCanvasHandle | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bloomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // 纸境氛围色调（晨雾 默认 / 暖宣 / 晴瓷）
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('fengqi-atmosphere') as AtmosphereMode | null;
        if (saved === 'mist' || saved === 'warm' || saved === 'celadon') {
          return saved;
        }
      } catch {
        // file:// 或隐私模式下可能禁止访问 localStorage，安全回退默认主题
      }
    }
    return 'mist';
  });

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

  // 同步纸境属性到根节点以便模态框及滚动条周边一致渲染
  useEffect(() => {
    document.documentElement.setAttribute('data-atmosphere', atmosphere);
    try {
      window.localStorage.setItem('fengqi-atmosphere', atmosphere);
    } catch {
      // ignore storage quota errors
    }
  }, [atmosphere]);

  // 根据 location 派生 currentView
  const getCurrentView = (): ViewMode => {
    if (location === '/' || location === '') return 'landing';
    if (location.startsWith('/writing/')) return 'article';
    if (location === '/writing') return 'writing';
    if (location === '/photography') return 'photography';
    if (location === '/projects') return 'projects';
    if (location === '/notes') return 'notes';
    if (location === '/now') return 'now';
    if (location === '/elsewhere') return 'elsewhere';
    if (location === '/student') return 'student';
    if (location === '/about') return 'about';
    return 'landing';
  };

  const currentView = getCurrentView();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSelectAtmosphere = (
    mode: AtmosphereMode,
    origin?: { x: number; y: number }
  ) => {
    if (mode === atmosphere) return;

    const x = origin?.x ?? (typeof window !== 'undefined' ? window.innerWidth - 150 : 900);
    const y = origin?.y ?? 38;

    const preset = ATMOSPHERE_PRESETS.find((p) => p.id === mode);
    if (preset) {
      showToast(`纸境晕染：${preset.name} · ${preset.enName}`);
    }

    if (!reducedMotion) {
      ambientCanvasRef.current?.spawnPigmentBloom?.(x, y, mode);
      setWatercolorBloom({ id: Date.now(), x, y, mode });
      if (bloomTimerRef.current) clearTimeout(bloomTimerRef.current);
      bloomTimerRef.current = setTimeout(() => {
        setWatercolorBloom(null);
      }, 1350);
    }

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    if (!reducedMotion && typeof doc.startViewTransition === 'function' && !isTransitioningRef.current) {
      try {
        isTransitioningRef.current = true;
        document.documentElement.classList.add('atmosphere-transitioning');

        const transition = doc.startViewTransition(() => {
          flushSync(() => {
            document.documentElement.setAttribute('data-atmosphere', mode);
            setAtmosphere(mode);
          });
        });

        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        transition.ready
          .then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 940,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                pseudoElement: '::view-transition-new(root)',
              }
            );
          })
          .catch(() => {});

        transition.finished
          .catch(() => {})
          .finally(() => {
            document.documentElement.classList.remove('atmosphere-transitioning');
            isTransitioningRef.current = false;
          });
        return;
      } catch {
        document.documentElement.classList.remove('atmosphere-transitioning');
        isTransitioningRef.current = false;
      }
    }

    setAtmosphere(mode);
  };

  const handleCycleAtmosphere = (origin?: { x: number; y: number }) => {
    const order: AtmosphereMode[] = ['mist', 'warm', 'celadon'];
    const next = order[(order.indexOf(atmosphere) + 1) % order.length];
    handleSelectAtmosphere(next, origin);
  };

  // 页面切换时立即复位滚动位置并退出专注与索引展开态
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsIndexExpanded(false);
    setZenMode(false);
  }, [location]);

  // 锁定/解除 body 滚动条 (进入里世界或展开悬浮索引时防止底层页面滚动穿透)
  useEffect(() => {
    if (isInnerWorldOpen || isIndexExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isInnerWorldOpen, isIndexExpanded]);

  // 触发「起风了」微彩蛋 (Breeze Mode)
  const triggerBreeze = () => {
    if (ambientCanvasRef.current) {
      ambientCanvasRef.current.triggerBreeze();
      showToast('起风了，慢下脚步呼吸 🍃');
    }
  };

  // 键盘快捷键与暗号监听
  useEffect(() => {
    console.log(
      `%c fengqi. — quiet personal editorial space \n%c“清风徐来，水波不兴。愿你在此，停留片刻。”`,
      'color: #2F4B4D; font-family: serif; font-size: 16px; font-weight: bold; padding: 4px 0;',
      'color: #5C7A7C; font-family: serif; font-size: 13px; font-style: italic; padding-bottom: 6px;'
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsIndexExpanded(false);
        setIsAboutModalOpen(false);
        setIsRssModalOpen(false);
        return;
      }

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'b' || e.key === 'B' || e.key === 'w' || e.key === 'W') {
        triggerBreeze();
      }

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
    setIsIndexExpanded(false);
    if (section === 'about') {
      setIsAboutModalOpen(true);
      return;
    }
    if (section === 'landing') {
      setLocation('/');
      return;
    }
    setLocation(`/${section}`);
  };

  const handleSelectArticle = (article: Article) => {
    setIsIndexExpanded(false);
    setLocation(`/writing/${article.slug || article.id}`);
  };

  const handleNavigateHome = () => {
    setIsIndexExpanded(false);
    setLocation('/');
  };

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <div
        data-atmosphere={atmosphere}
        className="relative min-h-screen misty-background flex flex-col justify-between selection:bg-[#A7CFC3]/30 selection:text-[#2F4B4D]"
      >
        {/* 细微宣纸肌理质感遮罩 */}
        <div className="fixed inset-0 pointer-events-none z-0 paper-grain-overlay" />

        {/* 背景微生态粒子 Canvas */}
        <AmbientCanvas
          ref={ambientCanvasRef}
          reducedMotion={reducedMotion}
          atmosphere={atmosphere}
          zenMode={zenMode}
        />

        {/* 水墨纸境切换「晕染开来」粒子与湿边过渡层 */}
        <WatercolorTransition bloom={watercolorBloom} reducedMotion={reducedMotion} />

        {/* 顶部全局导航栏 */}
        <Header
          currentView={currentView}
          isIndexExpanded={isIndexExpanded}
          onToggleIndex={handleToggleIndex}
          onNavigateHome={handleNavigateHome}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
          atmosphere={atmosphere}
          onCycleAtmosphere={handleCycleAtmosphere}
          zenMode={zenMode}
          onOpenSecretBase={() => setIsInnerWorldOpen(true)}
        />

        {/* 原位悬浮雾感索引纱幕（保留当前阅读页面与滚动进度，不销毁上下文） */}
        <AnimatePresence>
          {isIndexExpanded && (
            <ExpandingIndex
              key="expanding-index"
              currentView={currentView}
              atmosphere={atmosphere}
              onSelectAtmosphere={handleSelectAtmosphere}
              onSelectSection={handleSelectSection}
              onClose={() => setIsIndexExpanded(false)}
            />
          )}
        </AnimatePresence>

        {/* 主视图区域：直接挂载新路由并配合丝滑淡入，避免 mode="wait" 与子组件 layoutId 发生退出队列阻塞 */}
        <main className="relative z-10 flex-1">
          <motion.div
            key={location}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.28, ease: MIST_EASE }}
          >
            <Switch location={location}>
                <Route path="/">
                  <LandingView
                    onNavigateSection={handleSelectSection}
                    onSelectArticle={handleSelectArticle}
                    onOpenAboutModal={() => setIsAboutModalOpen(true)}
                    onTriggerBreeze={triggerBreeze}
                  />
                </Route>

                <Route path="/writing">
                  <WritingView onSelectArticle={handleSelectArticle} />
                </Route>

                <Route path="/writing/:slug">
                  <ArticleDetailWrapper
                    onSelectArticle={handleSelectArticle}
                    onShowToast={showToast}
                    onTriggerBreeze={triggerBreeze}
                    zenMode={zenMode}
                    onToggleZenMode={() => {
                      setZenMode((prev) => {
                        const next = !prev;
                        showToast(next ? '已进入禅意阅读模式 🍃' : '已退出禅意阅读');
                        return next;
                      });
                    }}
                  />
                </Route>

                <Route path="/photography">
                  <PhotographyView />
                </Route>

                <Route path="/projects">
                  <ProjectsView />
                </Route>

                <Route path="/notes">
                  <NotesView />
                </Route>

                <Route path="/now">
                  <NowView />
                </Route>

                <Route path="/elsewhere">
                  <ElsewhereView />
                </Route>

                <Route path="/student">
                  <StudentInfoView onNavigateSection={handleSelectSection} />
                </Route>

                <Route path="/about">
                  <LandingView
                    onNavigateSection={handleSelectSection}
                    onSelectArticle={handleSelectArticle}
                    onOpenAboutModal={() => setIsAboutModalOpen(true)}
                    onTriggerBreeze={triggerBreeze}
                  />
                  <AboutModal
                    isOpen={true}
                    onClose={() => setLocation('/')}
                    onOpenRss={() => setIsRssModalOpen(true)}
                  />
                </Route>

                {/* 默认全匹配兜底 */}
                <Route path="/:rest*">
                  <LandingView
                    onNavigateSection={handleSelectSection}
                    onSelectArticle={handleSelectArticle}
                    onOpenAboutModal={() => setIsAboutModalOpen(true)}
                    onTriggerBreeze={triggerBreeze}
                  />
                </Route>
            </Switch>
          </motion.div>
        </main>

        {/* 底部极轻页脚 */}
        <footer
          className={`relative z-10 px-6 py-8 text-center text-xs text-[#8EABA8] font-sans border-t border-[#C7D9D6]/25 transition-opacity duration-500 ${
            zenMode ? 'opacity-20 hover:opacity-80' : 'opacity-100'
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-2">
            <div className="flex items-center gap-1.5 text-[#8EABA8]">
              <LeafMotif size={13} color="#A7CFC3" />
              <span>
                {siteConfig.site.title}space · {siteConfig.site.footer_text}
              </span>
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
              onClick={() => handleSelectSection('student')}
              className="text-[#8EABA8] hover:text-[#2F4B4D] hover:underline underline-offset-4 transition-colors flex items-center gap-1 focus:outline-none"
            >
              <span>作业信息 · 狄伟嘉</span>
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
            All words & photographs © {siteConfig.site.copyright_year}{' '}
            {siteConfig.site.author}. All rights reserved.
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
              transition={{ duration: 0.25, ease: MIST_EASE }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#2F4B4D] text-[#F3F6F4] text-xs font-sans shadow-lg flex items-center gap-2 backdrop-blur-md"
            >
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

export function App() {
  // 双击本地 index.html（file:// 协议）时自动切换 Hash 路由，避免 History.pushState 触发跨域安全限制
  const isFileProtocol =
    typeof window !== 'undefined' && window.location.protocol === 'file:';

  const getAppBase = () => {
    let base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    if (base === '.' || base === './') base = '';
    return base;
  };

  if (isFileProtocol) {
    return (
      <Router hook={useHashLocation}>
        <MainApp />
      </Router>
    );
  }

  return (
    <Router base={getAppBase()}>
      <MainApp />
    </Router>
  );
}

export default App;
