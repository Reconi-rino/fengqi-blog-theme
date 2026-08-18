import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShadowNote } from '../ShadowWorld';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { CrescentMoonMotif, StarMotif, LeafMotif, BubbleMotif } from '../Motifs';

interface InnerNotesArchiveProps {
  notes: ShadowNote[];
  onSelectNote: (note: ShadowNote) => void;
  onBackToLanding: () => void;
  onExitToSurface: () => void;
}

export const InnerNotesArchive: React.FC<InnerNotesArchiveProps> = ({
  notes,
  onSelectNote,
  onBackToLanding,
  onExitToSurface,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [hoveredNote, setHoveredNote] = useState<ShadowNote>(notes[0] || ({} as ShadowNote));

  // 提取可用分类标签
  const categories = useMemo(() => {
    const counts: Record<string, number> = { 全部: notes.length };
    notes.forEach((n) => {
      const cat = n.tag || '其他';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (selectedTag === '全部') return notes;
    return notes.filter((n) => (n.tag || '其他') === selectedTag);
  }, [notes, selectedTag]);

  return (
    <div className="min-h-screen w-full flex flex-col p-6 sm:p-12 lg:p-16 relative z-10 select-none">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto pb-8 border-b border-[rgba(215,201,184,0.1)]">
        <div className="flex items-center gap-6">
          <button
            onClick={onBackToLanding}
            className="flex items-baseline gap-2 group text-left focus:outline-none"
          >
            <span className="font-serif text-2xl font-normal text-[#D7C9B8] group-hover:text-[#E8B48C] transition-colors">
              fengqi.
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-[#767E79] tracking-widest pl-2">
              inner world
            </span>
          </button>
          <span className="text-xs text-[#767E79] font-mono">/</span>
          <button
            onClick={onBackToLanding}
            className="text-xs font-sans text-[#A89E91] hover:text-[#D7C9B8] transition-colors flex items-center gap-1 focus:outline-none"
          >
            <span>← 返回索引</span>
          </button>
        </div>

        {/* 右上角：四角星芒按钮 */}
        <button
          onClick={onExitToSurface}
          className="group h-9 rounded-full border border-[rgba(215,201,184,0.18)] bg-[#151E22]/60 hover:bg-[#1E2B33]/80 text-xs font-sans text-[#A89E91] hover:text-[#D7C9B8] transition-all duration-300 flex items-center gap-2 px-2.5 hover:px-4 overflow-hidden focus:outline-none backdrop-blur-md"
          title="返回地表"
        >
          <StarMotif size={14} color="#E8B48C" className="group-hover:rotate-45 transition-transform duration-300 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[70px] transition-all duration-300 text-xs font-sans opacity-0 group-hover:opacity-100 text-[#D7C9B8]">
            返回地表
          </span>
        </button>
      </header>

      {/* 主体区 */}
      <main className="max-w-7xl mx-auto w-full py-10 flex-1 space-y-8">
        {/* 板块 Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E8B48C] tracking-widest uppercase">
            <span>~</span>
            <span>NOTES</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-[#D7C9B8] tracking-tight">
              Notes
            </h1>
            <span className="font-serif text-xl sm:text-2xl font-normal text-[#A89E91]">
              随记与碎片
            </span>
          </div>
          <p className="font-serif text-xs sm:text-sm text-[#767E79]">
            日常的碎片，闪过的念头，未完成的句子。
          </p>
        </div>

        {/* 分类筛选 Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {Object.entries(categories).map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setSelectedTag(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                selectedTag === cat
                  ? 'bg-[#E8B48C] text-[#0E1316] font-medium shadow-xs'
                  : 'bg-[#151E22]/70 text-[#A89E91] hover:text-[#D7C9B8] border border-[rgba(215,201,184,0.1)]'
              }`}
            >
              <span>{cat}</span>
              <span className="font-mono text-[10px] opacity-70">{count}</span>
            </button>
          ))}
        </div>

        {/* 桌面双栏布局：左侧随记列表，右侧轻量随记预览 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-2">
          {/* 左侧：列表项 */}
          <div className="lg:col-span-7 space-y-3">
            {filteredNotes.map((note) => {
              const isHovered = hoveredNote?.id === note.id;
              const firstLine = note.content.split('\n')[0].replace(/^[#\s*-_]+/, '');
              return (
                <motion.div
                  key={note.id}
                  onMouseEnter={() => setHoveredNote(note)}
                  onClick={() => onSelectNote(note)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border space-y-2.5 ${
                    isHovered
                      ? 'bg-[#151E22]/90 border-[#E8B48C]/40 shadow-xs'
                      : 'bg-[#151E22]/40 border-[rgba(215,201,184,0.08)] hover:border-[rgba(215,201,184,0.2)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-[#767E79]">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full border transition-all ${
                        isHovered ? 'border-[#E8B48C] bg-[#E8B48C]' : 'border-[#767E79]'
                      }`} />
                      <span>{note.date}</span>
                    </div>
                    {note.tag && (
                      <span className="px-2 py-0.5 rounded bg-[rgba(215,201,184,0.06)] text-[#E8B48C] font-sans text-[11px] border border-[rgba(215,201,184,0.1)]">
                        {note.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-base text-[#D7C9B8] leading-snug">
                    {firstLine}
                  </h3>

                  <p className="font-serif text-xs text-[#767E79] line-clamp-2 leading-relaxed">
                    {note.content.replace(firstLine, '').trim() || firstLine}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* 右侧：随记完整卡片预览 */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <AnimatePresence mode="wait">
              {hoveredNote && (
                <motion.div
                  key={hoveredNote.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="inner-card-soft p-6 space-y-6"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#767E79] border-b border-[rgba(215,201,184,0.1)] pb-3">
                    <span>{hoveredNote.date}</span>
                    <span className="px-2 py-0.5 rounded bg-[#E8B48C]/15 text-[#E8B48C] font-sans text-xs">
                      {hoveredNote.tag || '随记'}
                    </span>
                  </div>

                  {/* 夜幕微光卡片 */}
                  <div className="h-28 rounded-xl bg-radial from-[#1E2B33]/60 to-[#0E1316] border border-[rgba(215,201,184,0.08)] flex items-center justify-center relative overflow-hidden">
                    <BubbleMotif size={24} color="#7F9C88" className="opacity-70" />
                    <div className="absolute bottom-2 right-3 opacity-30">
                      <CrescentMoonMotif size={16} color="#E8B48C" />
                    </div>
                  </div>

                  {/* 正文直接阅览 */}
                  <div className="inner-editorial-prose text-xs leading-relaxed text-[#D7C9B8] select-text">
                    <MarkdownRenderer content={hoveredNote.content} />
                  </div>

                  <button
                    onClick={() => onSelectNote(hoveredNote)}
                    className="w-full py-2.5 rounded-xl bg-[rgba(215,201,184,0.08)] hover:bg-[#E8B48C] text-[#D7C9B8] hover:text-[#0E1316] text-xs font-sans transition-all duration-200 flex items-center justify-center gap-1 focus:outline-none"
                  >
                    <span>查看详情</span>
                    <span className="font-mono">→</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="max-w-7xl mx-auto w-full pt-12 border-t border-[rgba(215,201,184,0.08)] flex items-center justify-between text-xs text-[#767E79]">
        <div className="flex items-center gap-2 font-serif">
          <LeafMotif size={12} color="#767E79" />
          <span>随手记录，无意留存。</span>
        </div>
        <div className="opacity-40">
          <CrescentMoonMotif size={18} color="#E8B48C" />
        </div>
      </footer>
    </div>
  );
};
