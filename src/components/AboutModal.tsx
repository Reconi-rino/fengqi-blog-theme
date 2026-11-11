import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeafMotif, FlowerMotif, PeachHeartMotif } from './Motifs';
import { rawAboutMarkdown, allElsewhere } from '../utils/contentLoader';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MIST_EASE } from '../utils/motion';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRss?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenRss }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#2F4B4D]/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: MIST_EASE }}
            onClick={(e) => e.stopPropagation()}
            className="card-soft p-8 sm:p-12 max-w-2xl w-full border border-[#C7D9D6] shadow-xl relative overflow-hidden space-y-6 max-h-[85vh] overflow-y-auto"
          >
            {/* 右上角关闭 */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/60 border border-[#C7D9D6] flex items-center justify-center text-sm hover:bg-white text-[#5C7A7C] hover:text-[#2F4B4D] focus:outline-none"
            >
              ✕
            </button>

            {/* 标题 */}
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-3xl font-normal text-[#2F4B4D]">
                关于风栖
              </h3>
              <LeafMotif size={20} color="#A7CFC3" />
            </div>

            {/* Markdown 正文 */}
            <div className="pt-2 border-t border-[#C7D9D6]/40">
              <MarkdownRenderer content={rawAboutMarkdown} />
            </div>

            {/* Elsewhere 外部链接与 RSS：统一柔和灰色文字 */}
            <div className="pt-4 border-t border-[#C7D9D6]/40 flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-[#5C7A7C]">
              <div className="flex flex-wrap items-center gap-3">
                {allElsewhere.map((item, idx) => (
                  <React.Fragment key={item.name}>
                    {idx > 0 && <span className="text-[#C7D9D6]">/</span>}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#5C7A7C] hover:text-[#2F4B4D] hover:underline underline-offset-4 transition-colors"
                    >
                      {item.name}
                    </a>
                  </React.Fragment>
                ))}
                <span className="text-[#C7D9D6]">/</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenRss?.();
                  }}
                  className="text-[#5C7A7C] hover:text-[#2F4B4D] hover:underline underline-offset-4 transition-colors flex items-center gap-1 focus:outline-none"
                >
                  <span>RSS 订阅</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-[#8EABA8] text-[11px]">
                <FlowerMotif size={13} color="#F6DCCB" />
                <span>stay for a while</span>
                <PeachHeartMotif size={10} color="#F6DCCB" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
