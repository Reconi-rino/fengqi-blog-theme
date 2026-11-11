import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allNotes } from '../utils/contentLoader';
import { LeafMotif } from './Motifs';
import { MistReveal } from './MistReveal';
import { MIST_EASE, PILL_SPRING } from '../utils/motion';

export const NotesView: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'timeline' | 'wall'>('timeline');

  const tags = useMemo(() => {
    const set = new Set<string>();
    allNotes.forEach((n) => {
      if (n.tag) set.add(n.tag);
    });
    return ['all', ...Array.from(set)];
  }, []);

  const filteredNotes = useMemo(() => {
    if (selectedTag === 'all') return allNotes;
    return allNotes.filter((n) => n.tag === selectedTag);
  }, [selectedTag]);

  return (
    <div className="w-full max-w-5xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12">
      {/* 顶部标题与布局切换 */}
      <MistReveal
        duration={0.75}
        yOffset={16}
        blurAmount={6}
        className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#8EABA8] mb-2 uppercase">
            <span className="font-light">~</span>
            <span>NOTES · {filteredNotes.length} FRAGMENTS</span>
          </div>
          <div className="flex items-baseline gap-4">
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#2F4B4D] tracking-tight">
              Notes
            </h1>
            <span className="font-serif text-base sm:text-lg text-[#5C7A7C]">
              随记与想法
            </span>
            <LeafMotif size={18} color="#A7CFC3" />
          </div>
        </div>

        {/* 视图切换：下划线切换条 */}
        <div className="inline-flex items-center gap-5 border-b border-[#C7D9D6]/40 text-xs font-sans self-start sm:self-auto">
          {(
            [
              { id: 'timeline', label: '时间轴' },
              { id: 'wall', label: '灵感墙' },
            ] as const
          ).map((mode) => {
            const active = layoutMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setLayoutMode(mode.id)}
                className={`relative pb-1.5 transition-colors focus:outline-none ${
                  active ? 'text-[#2F4B4D] font-medium' : 'text-[#8EABA8] hover:text-[#2F4B4D]'
                }`}
              >
                {mode.label}
                {active && (
                  <motion.span
                    layoutId="notes-view-pill"
                    transition={PILL_SPRING}
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2F4B4D]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </MistReveal>

      {/* 标签筛选 */}
      {tags.length > 1 && (
        <div className="flex flex-wrap items-center gap-4 border-b border-[#C7D9D6]/30 mb-10">
          {tags.map((tag) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`relative pb-2 text-xs font-sans transition-colors focus:outline-none ${
                  active ? 'text-[#2F4B4D] font-medium' : 'text-[#8EABA8] hover:text-[#2F4B4D]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="notes-tag-pill"
                    transition={PILL_SPRING}
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2F4B4D]"
                  />
                )}
                {tag === 'all' ? '全部随记' : `#${tag}`}
              </button>
            );
          })}
        </div>
      )}

      {/* 内容视图 */}
      <AnimatePresence mode="wait">
        {layoutMode === 'timeline' ? (
          <motion.div
            key="notes-timeline"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: MIST_EASE }}
            className="relative max-w-3xl pl-6 sm:pl-8 border-l border-[#C7D9D6]/55 space-y-6"
          >
            {filteredNotes.map((note, idx) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.055, duration: 0.4, ease: MIST_EASE }}
                className="relative"
              >
                {/* 时间轴圆点 */}
                <span className="absolute -left-[30px] sm:-left-[38px] top-6 w-2.5 h-2.5 rounded-full bg-[#A7CFC3] ring-4 ring-[#F3F6F4]/80" />

                <div className="card-soft p-6 sm:p-7 shadow-2xs hover:border-[#A7CFC3] transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#8EABA8] font-sans pb-3 border-b border-[#C7D9D6]/30 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{note.date}</span>
                      <span>·</span>
                      <span>{note.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {note.weather && <span>{note.weather}</span>}
                      {note.tag && (
                        <button
                          onClick={() => setSelectedTag(note.tag || 'all')}
                          className="px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#5C7A7C] hover:text-[#2F4B4D] text-[10px] transition-colors focus:outline-none"
                        >
                          {note.tag}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="font-serif text-sm sm:text-base text-[#2F4B4D] leading-relaxed">
                    {note.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="notes-wall"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: MIST_EASE }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredNotes.map((note, idx) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.055, duration: 0.4, ease: MIST_EASE }}
                whileHover={{ y: -3 }}
                className="card-soft p-6 sm:p-7 shadow-2xs hover:border-[#A7CFC3] transition-all flex flex-col justify-between gap-5"
              >
                <p className="font-serif text-sm sm:text-base text-[#2F4B4D] leading-relaxed">
                  {note.content}
                </p>

                <div className="pt-3 border-t border-[#C7D9D6]/30 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8EABA8] font-sans">
                  <div className="flex items-center gap-2 font-mono">
                    <span>{note.date}</span>
                    <span>·</span>
                    <span>{note.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {note.weather && <span>{note.weather}</span>}
                    {note.tag && (
                      <span className="px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#5C7A7C] text-[10px]">
                        {note.tag}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
