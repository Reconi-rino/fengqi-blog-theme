import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InnerAmbientCanvas, InnerAmbientCanvasHandle } from './InnerAmbientCanvas';
import { PasswordGate } from './PasswordGate';
import { InnerLanding } from './InnerLanding';
import { InnerWritingArchive } from './InnerWritingArchive';
import { InnerWritingDetail } from './InnerWritingDetail';
import { InnerNotesArchive } from './InnerNotesArchive';
import { InnerNoteDetail } from './InnerNoteDetail';
import { InnerStudio } from './InnerStudio';
import { CrescentMoonMotif } from '../Motifs';

export interface ShadowArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
}

export interface ShadowNote {
  id: string;
  date: string;
  tag?: string;
  content: string;
}

export interface ShadowData {
  version: string;
  title: string;
  motto: string;
  articles: ShadowArticle[];
  notes: ShadowNote[];
}

type InnerWorldView = 'gate' | 'landing' | 'writing' | 'writing-detail' | 'notes' | 'note-detail' | 'studio';

interface InnerWorldProps {
  initialData?: ShadowData | null;
  onExitToSurface: () => void;
  onShowToast: (msg: string) => void;
}

export const InnerWorld: React.FC<InnerWorldProps> = ({
  initialData = null,
  onExitToSurface,
  onShowToast,
}) => {
  const [data, setData] = useState<ShadowData | null>(initialData);
  const [currentView, setCurrentView] = useState<InnerWorldView>(initialData ? 'landing' : 'gate');
  const [selectedArticle, setSelectedArticle] = useState<ShadowArticle | null>(null);
  const [selectedNote, setSelectedNote] = useState<ShadowNote | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const canvasRef = useRef<InnerAmbientCanvasHandle | null>(null);

  // 空白区域点击生成微生态粒子
  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('button') ||
      target.closest('form')
    ) {
      return;
    }
    if (canvasRef.current) {
      canvasRef.current.spawnParticles(e.clientX, e.clientY);
    }
  };

  const handleUnlockSuccess = (unlockedData: ShadowData) => {
    setData(unlockedData);
    setCurrentView('landing');
  };

  const handleLockSession = () => {
    setData(null);
    setSelectedArticle(null);
    setSelectedNote(null);
    setCurrentView('gate');
    onShowToast('已锁定内在世界');
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-50 inner-world-background text-[#D7C9B8] flex flex-col overflow-y-auto selection:bg-[#E8B48C]/30 selection:text-[#F0E8DD]"
    >
      {/* 专属暗夜生态画布 */}
      <InnerAmbientCanvas
        ref={canvasRef}
        density={
          currentView === 'writing-detail' || currentView === 'note-detail'
            ? 'low'
            : 'medium'
        }
      />

      {/* 主视图状态机渲染 */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {/* 1. 密码验证门 (Password Gate) */}
          {currentView === 'gate' && (
            <motion.div
              key="gate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <PasswordGate
                onUnlockSuccess={handleUnlockSuccess}
                onExitToSurface={onExitToSurface}
                onShowToast={onShowToast}
              />
            </motion.div>
          )}

          {/* 2. 内部落地主页 (Inner Landing) */}
          {currentView === 'landing' && data && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <InnerLanding
                articles={data.articles || []}
                notes={data.notes || []}
                onNavigateSection={(section) => {
                  setCurrentView(section);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExitToSurface={onExitToSurface}
                onLockSession={handleLockSession}
                onOpenAbout={() => setIsAboutOpen(true)}
                onShowToast={onShowToast}
              />
            </motion.div>
          )}

          {/* 3. Writing 文章归档 (Inner Writing Archive) */}
          {currentView === 'writing' && data && (
            <motion.div
              key="writing-archive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <InnerWritingArchive
                articles={data.articles || []}
                onSelectArticle={(art) => {
                  setSelectedArticle(art);
                  setCurrentView('writing-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBackToLanding={() => {
                  setCurrentView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExitToSurface={onExitToSurface}
              />
            </motion.div>
          )}

          {/* 4. Writing 文章详情阅读 (Inner Writing Detail) */}
          {currentView === 'writing-detail' && selectedArticle && (
            <motion.div
              key={`article-${selectedArticle.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <InnerWritingDetail
                article={selectedArticle}
                onBackToArchive={() => {
                  setCurrentView('writing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExitToSurface={onExitToSurface}
                onShowToast={onShowToast}
              />
            </motion.div>
          )}

          {/* 5. Notes 随记归档 (Inner Notes Archive) */}
          {currentView === 'notes' && data && (
            <motion.div
              key="notes-archive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <InnerNotesArchive
                notes={data.notes || []}
                onSelectNote={(n) => {
                  setSelectedNote(n);
                  setCurrentView('note-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBackToLanding={() => {
                  setCurrentView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExitToSurface={onExitToSurface}
              />
            </motion.div>
          )}

          {/* 6. Notes 随记详情 (Inner Note Detail) */}
          {currentView === 'note-detail' && selectedNote && (
            <motion.div
              key={`note-${selectedNote.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <InnerNoteDetail
                note={selectedNote}
                onBackToArchive={() => {
                  setCurrentView('notes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExitToSurface={onExitToSurface}
                onShowToast={onShowToast}
              />
            </motion.div>
          )}

          {/* 7. Studio 密室工作台 (Inner Studio) */}
          {currentView === 'studio' && data && (
            <motion.div
              key="studio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <InnerStudio
                data={data}
                onUpdateData={(newData) => setData(newData)}
                onBackToLanding={() => {
                  setCurrentView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExitToSurface={onExitToSurface}
                onShowToast={onShowToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 内在世界关于弹窗 */}
      <AnimatePresence>
        {isAboutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAboutOpen(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="inner-card-soft max-w-md w-full p-8 text-center space-y-5 relative"
            >
              <button
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5 text-[#767E79] hover:text-[#D7C9B8] flex items-center justify-center text-xs focus:outline-none"
              >
                ✕
              </button>
              <div className="mx-auto w-10 h-10 rounded-full bg-[#E8B48C]/15 border border-[#E8B48C]/30 flex items-center justify-center">
                <CrescentMoonMotif size={18} color="#E8B48C" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#F0E8DD]">
                关于内在世界
              </h3>
              <p className="font-serif text-xs text-[#A89E91] leading-relaxed">
                这是主博客之外的一个私人写作空间。
                <br />
                用来存放未曾公开的长文、日常观察与闪烁的灵感碎片。
                <br />
                在暗夜中，慢慢呼吸。
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#767E79]">
                fengqi. — inside world v1.0
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
