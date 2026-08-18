import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '../types';
import { allPhotos } from '../utils/contentLoader';
import { LeafMotif } from './Motifs';

export const PhotographyView: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12 md:px-16">
      {/* 顶部标题与身份标签 */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-[#8EABA8] mb-2 uppercase">
          <span className="font-light">□</span>
          <span>PHOTOGRAPHY</span>
        </div>
        <div className="flex items-baseline gap-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#2F4B4D] tracking-tight">
            Photography
          </h1>
          <span className="font-serif text-base sm:text-lg text-[#5C7A7C]">
            影像拾集
          </span>
          <LeafMotif size={18} color="#A7CFC3" />
        </div>
      </div>

      {/* 摄影画廊栅格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {allPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.45 }}
            onClick={() => setActivePhoto(photo)}
            className="group cursor-pointer space-y-3"
          >
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#E6EDEB] border border-[#C7D9D6]/50 relative shadow-2xs">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover filter saturate-90 transition-all duration-700 group-hover:scale-103 group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-xs font-sans text-[#2F4B4D]">
                  点击放大查看
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <h3 className="font-serif text-lg text-[#2F4B4D] group-hover:text-[#1F3335] transition-colors">
                  {photo.title}
                </h3>
                <p className="text-xs text-[#5C7A7C] font-serif mt-0.5">
                  {photo.description}
                </p>
              </div>
              <div className="text-right text-[11px] font-sans text-[#8EABA8] shrink-0">
                <div>{photo.location}</div>
                <div className="font-mono">{photo.year}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 放大灯箱 Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-[#2F4B4D]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F3F6F4] p-4 sm:p-6 rounded-2xl max-w-4xl w-full border border-[#C7D9D6] shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-xl text-[#2F4B4D]">{activePhoto.title}</h4>
                  <span className="text-xs text-[#8EABA8] font-sans">
                    {activePhoto.location} · {activePhoto.date}
                  </span>
                </div>
                <button
                  onClick={() => setActivePhoto(null)}
                  className="w-8 h-8 rounded-full bg-white/60 border border-[#C7D9D6] flex items-center justify-center text-sm hover:bg-white text-[#2F4B4D] focus:outline-none"
                >
                  ✕
                </button>
              </div>

              <div className="w-full max-h-[65vh] rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="max-h-[65vh] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#5C7A7C] font-mono pt-2 border-t border-[#C7D9D6]/40">
                <span>{activePhoto.camera}</span>
                <span>{activePhoto.lens}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
