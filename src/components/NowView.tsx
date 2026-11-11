import React from 'react';
import { motion } from 'framer-motion';
import { LeafMotif, PeachHeartMotif } from './Motifs';
import { rawNowMarkdown, allElsewhere } from '../utils/contentLoader';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MIST_EASE } from '../utils/motion';

export const NowView: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12">
      {/* 顶部标题与身份标签 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: MIST_EASE }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] mb-2 uppercase">
          <span className="font-light">•</span>
          <span>NOW</span>
        </div>
        <div className="flex items-baseline gap-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#2F4B4D] tracking-tight">
            Now
          </h1>
          <span className="font-serif text-base sm:text-lg text-[#5C7A7C]">
            近况与当下
          </span>
          <LeafMotif size={18} color="#A7CFC3" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.55, ease: MIST_EASE }}
        className="card-soft p-8 sm:p-10 shadow-2xs space-y-6"
      >
        <MarkdownRenderer content={rawNowMarkdown} />

        <div className="pt-4 border-t border-[#C7D9D6]/30 flex items-center justify-between text-xs text-[#8EABA8]">
          <span>inspired by Derek Sivers' /now movement</span>
          <PeachHeartMotif size={12} color="#F6DCCB" />
        </div>
      </motion.div>
    </div>
  );
};

export const ElsewhereView: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: MIST_EASE }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] mb-2 uppercase">
          <span className="font-light">•</span>
          <span>ELSEWHERE</span>
        </div>
        <div className="flex items-baseline gap-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#2F4B4D] tracking-tight">
            Elsewhere
          </h1>
          <span className="font-serif text-base sm:text-lg text-[#5C7A7C]">
            外部足迹
          </span>
          <LeafMotif size={18} color="#A7CFC3" />
        </div>
      </motion.div>

      <div className="space-y-4">
        {allElsewhere.map((item, idx) => (
          <motion.a
            key={item.name}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, duration: 0.45, ease: MIST_EASE }}
            whileHover={{ y: -2 }}
            className="card-soft p-5 sm:p-6 flex items-center justify-between group hover:border-[#A7CFC3] transition-all block text-left"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg text-[#2F4B4D] group-hover:text-[#1F3335]">
                  {item.name}
                </span>
                <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#E6EDEB] text-[#5C7A7C]">
                  {item.tag}
                </span>
              </div>
              <p className="font-serif text-xs sm:text-sm text-[#5C7A7C] mt-1">
                {item.desc}
              </p>
            </div>
            <span className="text-lg text-[#8EABA8] group-hover:text-[#2F4B4D] group-hover:translate-x-1 transition-all">
              ↗
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
