import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allPhotos } from '../utils/contentLoader';
import { LeafMotif } from './Motifs';
import { MistReveal, CurtainImage } from './MistReveal';
import { MIST_EASE, PILL_SPRING } from '../utils/motion';

export const PhotographyView: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'sheet'>('grid');

  const activePhoto = activeIndex !== null ? allPhotos[activeIndex] || null : null;

  const handleNext = useCallback(() => {
    if (allPhotos.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % allPhotos.length));
  }, []);

  const handlePrev = useCallback(() => {
    if (allPhotos.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) =>
      prev === null ? 0 : (prev - 1 + allPhotos.length) % allPhotos.length
    );
  }, []);

  // 灯箱键盘左右切换与 Esc 关闭
  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveIndex(null);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, handleNext, handlePrev]);

  return (
    <div className="w-full max-w-7xl mx-auto pt-32 sm:pt-40 pb-28 px-6 sm:px-12 md:px-16">
      {/* 顶部标题与视图切换 */}
      <MistReveal
        duration={0.75}
        yOffset={16}
        blurAmount={6}
        className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#8EABA8] mb-2 uppercase">
            <span className="font-light">□</span>
            <span>PHOTOGRAPHY · {allPhotos.length} FRAMES</span>
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

        {/* 布局模式切换（下划线刊物切换条） */}
        <div className="inline-flex items-center gap-5 border-b border-[#C7D9D6]/40 text-xs font-sans self-start sm:self-auto">
          {(
            [
              { id: 'grid', label: '双栏画廊' },
              { id: 'sheet', label: '胶片印相' },
            ] as const
          ).map((mode) => {
            const active = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`relative pb-1.5 transition-colors focus:outline-none ${
                  active ? 'text-[#2F4B4D] font-medium' : 'text-[#8EABA8] hover:text-[#2F4B4D]'
                }`}
              >
                {mode.label}
                {active && (
                  <motion.span
                    layoutId="photo-view-pill"
                    transition={PILL_SPRING}
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2F4B4D]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </MistReveal>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          /* 模式一：舒展双栏画廊 */
          <motion.div
            key="photo-grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: MIST_EASE }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {allPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: MIST_EASE }}
                whileHover={{ y: -3 }}
                onClick={() => {
                  setDirection(0);
                  setActiveIndex(index);
                }}
                className="group cursor-pointer space-y-3"
              >
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#E6EDEB] border border-[#C7D9D6]/50 relative shadow-2xs">
                  <CurtainImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    delay={index * 0.07}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover filter saturate-90 transition-all duration-700 group-hover:scale-103 group-hover:saturate-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2F4B4D]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="px-2.5 py-1 rounded-sm bg-white/85 backdrop-blur-xs text-[11px] font-sans text-[#2F4B4D]">
                      点击放大查看
                    </span>
                    <span className="px-2 py-1 rounded-sm bg-black/30 backdrop-blur-xs text-[10px] font-mono text-white/90">
                      {photo.camera}
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
          </motion.div>
        ) : (
          /* 模式二：交错胶片印相画卷 */
          <motion.div
            key="photo-sheet"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: MIST_EASE }}
            className="space-y-12"
          >
            {allPhotos.map((photo, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, ease: MIST_EASE }}
                  onClick={() => {
                    setDirection(0);
                    setActiveIndex(index);
                  }}
                  className="card-soft p-5 sm:p-7 cursor-pointer group hover:border-[#A7CFC3] transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
                >
                  <div
                    className={`lg:col-span-7 overflow-hidden rounded-xl bg-[#E6EDEB] border border-[#C7D9D6]/40 aspect-[16/10] ${
                      !isEven ? 'lg:order-2' : ''
                    }`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover filter saturate-95 group-hover:scale-103 transition-transform duration-700"
                    />
                  </div>

                  <div
                    className={`lg:col-span-5 flex flex-col justify-between space-y-5 ${
                      !isEven ? 'lg:order-1' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-[#8EABA8]">
                      <span>FRAME № {String(index + 1).padStart(2, '0')}</span>
                      <span>{photo.date}</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-normal text-[#2F4B4D]">
                        {photo.title}
                      </h3>
                      <p className="font-serif text-sm text-[#5C7A7C] leading-relaxed">
                        {photo.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#C7D9D6]/35 space-y-1 text-[11px] font-mono text-[#8EABA8]">
                      <div className="flex justify-between">
                        <span>LOCATION</span>
                        <span className="text-[#5C7A7C]">{photo.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CAMERA</span>
                        <span className="text-[#5C7A7C]">{photo.camera}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>OPTICS</span>
                        <span className="text-[#5C7A7C]">{photo.lens}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 放大灯箱 Modal（支持左右翻页与键盘快捷键） */}
      <AnimatePresence>
        {activePhoto && activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: MIST_EASE }}
            onClick={() => setActiveIndex(null)}
            className="fixed inset-0 z-50 bg-[#2F4B4D]/65 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: MIST_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F3F6F4] p-4 sm:p-6 rounded-2xl max-w-4xl w-full border border-[#C7D9D6] shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-serif text-xl text-[#2F4B4D]">{activePhoto.title}</h4>
                    <span className="text-[11px] font-mono text-[#8EABA8] px-2 py-0.5 rounded-full bg-[#E6EDEB]">
                      {String(activeIndex + 1).padStart(2, '0')} /{' '}
                      {String(allPhotos.length).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs text-[#8EABA8] font-sans">
                    {activePhoto.location} · {activePhoto.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {allPhotos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="w-8 h-8 rounded-full bg-white/70 border border-[#C7D9D6] flex items-center justify-center text-xs hover:bg-white text-[#2F4B4D] focus:outline-none transition-colors"
                        title="上一张 (←)"
                      >
                        ←
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-8 h-8 rounded-full bg-white/70 border border-[#C7D9D6] flex items-center justify-center text-xs hover:bg-white text-[#2F4B4D] focus:outline-none transition-colors"
                        title="下一张 (→)"
                      >
                        →
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setActiveIndex(null)}
                    className="w-8 h-8 rounded-full bg-white/70 border border-[#C7D9D6] flex items-center justify-center text-sm hover:bg-white text-[#2F4B4D] focus:outline-none transition-colors"
                    title="关闭 (Esc)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="w-full max-h-[64vh] rounded-xl overflow-hidden bg-black/5 flex items-center justify-center relative">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.img
                    key={activePhoto.id}
                    src={activePhoto.imageUrl}
                    alt={activePhoto.title}
                    initial={{ opacity: 0, x: direction * 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -direction * 24 }}
                    transition={{ duration: 0.28, ease: MIST_EASE }}
                    className="max-h-[64vh] w-auto object-contain rounded-lg"
                  />
                </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5C7A7C] font-mono pt-2 border-t border-[#C7D9D6]/40">
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
