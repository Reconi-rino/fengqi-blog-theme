import React from 'react';
import { motion } from 'framer-motion';
import { allNotes } from '../utils/contentLoader';
import { LeafMotif } from './Motifs';

export const NotesView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12">
      {/* 顶部标题与身份标签 */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] mb-2 uppercase">
          <span className="font-light">~</span>
          <span>NOTES</span>
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

      {/* 随记时间流 */}
      <div className="space-y-6">
        {allNotes.map((note, idx) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.35 }}
            className="card-soft p-6 sm:p-7 border border-[#C7D9D6]/60 shadow-2xs hover:border-[#A7CFC3] transition-all"
          >
            <div className="flex items-center justify-between text-xs text-[#8EABA8] font-sans pb-3 border-b border-[#C7D9D6]/30 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono">{note.date}</span>
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

            <p className="font-serif text-sm sm:text-base text-[#2F4B4D] leading-relaxed">
              {note.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
