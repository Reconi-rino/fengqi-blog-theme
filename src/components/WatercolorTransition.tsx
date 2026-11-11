import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtmosphereMode, MIST_EASE } from '../utils/motion';

export interface WatercolorBloomEvent {
  id: number;
  x: number;
  y: number;
  mode: AtmosphereMode;
}

interface WatercolorTransitionProps {
  bloom: WatercolorBloomEvent | null;
  reducedMotion?: boolean;
}

const BLOOM_PALETTE: Record<
  AtmosphereMode,
  { core: string; rim: string; secondary: string }
> = {
  mist: {
    core: 'rgba(167, 207, 195, 0.34)',
    rim: 'rgba(142, 171, 168, 0.42)',
    secondary: 'rgba(199, 217, 214, 0.3)',
  },
  warm: {
    core: 'rgba(232, 180, 140, 0.36)',
    rim: 'rgba(214, 158, 114, 0.42)',
    secondary: 'rgba(246, 220, 203, 0.34)',
  },
  celadon: {
    core: 'rgba(138, 184, 173, 0.34)',
    rim: 'rgba(108, 162, 152, 0.42)',
    secondary: 'rgba(180, 210, 204, 0.32)',
  },
};

export const WatercolorTransition: React.FC<WatercolorTransitionProps> = ({
  bloom,
  reducedMotion = false,
}) => {
  if (reducedMotion) return null;

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 隐藏 SVG 滤镜：模拟宣纸纤维导致的湿边水墨不规则晕染边缘 */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="watercolor-bleed-filter" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018"
              numOctaves="3"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="38"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <AnimatePresence>
        {bloom && (
          <React.Fragment key={bloom.id}>
            {(() => {
              const colors = BLOOM_PALETTE[bloom.mode];
              const maxRadius =
                Math.hypot(Math.max(bloom.x, vw - bloom.x), Math.max(bloom.y, vh - bloom.y)) *
                1.18;
              // 固定中等离屏画布尺寸并通过 GPU transform scale 扩散，避免超大尺寸 SVG 滤镜卡顿
              const baseSize = 520;
              const baseHalf = baseSize / 2;
              const targetScale = (maxRadius * 2) / baseSize;

              return (
                <>
                  {/* 1. 起始笔触落墨水滴（柔和化开） */}
                  <motion.div
                    initial={{ scale: 0.2, opacity: 0.88 }}
                    animate={{ scale: 4.8, opacity: 0 }}
                    transition={{ duration: 0.72, ease: MIST_EASE }}
                    style={{
                      left: bloom.x - 24,
                      top: bloom.y - 24,
                      width: 48,
                      height: 48,
                      willChange: 'transform, opacity',
                      background: `radial-gradient(circle, ${colors.rim} 0%, ${colors.core} 55%, transparent 100%)`,
                      filter: 'blur(4px)',
                    }}
                    className="absolute rounded-full"
                  />

                  {/* 2. 主水墨晕染推进水痕（带动不规则边缘向外扩散） */}
                  <motion.div
                    initial={{ scale: 0.06, opacity: 0.94 }}
                    animate={{ scale: targetScale, opacity: 0 }}
                    transition={{ duration: 1.05, ease: MIST_EASE }}
                    style={{
                      left: bloom.x - baseHalf,
                      top: bloom.y - baseHalf,
                      width: baseSize,
                      height: baseSize,
                      willChange: 'transform, opacity',
                      borderRadius: '48% 52% 49% 51% / 51% 48% 52% 49%',
                      background: `radial-gradient(circle, transparent 60%, ${colors.core} 80%, ${colors.rim} 92%, transparent 100%)`,
                      filter: 'url(#watercolor-bleed-filter) blur(1.5px)',
                    }}
                    className="absolute"
                  />

                  {/* 3. 次层轻雾水波余韵（柔和交融新旧纸色边界） */}
                  <motion.div
                    initial={{ scale: 0.06, opacity: 0.82 }}
                    animate={{ scale: targetScale * 1.08, opacity: 0 }}
                    transition={{ duration: 1.25, delay: 0.06, ease: MIST_EASE }}
                    style={{
                      left: bloom.x - baseHalf,
                      top: bloom.y - baseHalf,
                      width: baseSize,
                      height: baseSize,
                      willChange: 'transform, opacity',
                      borderRadius: '51% 49% 52% 48% / 48% 51% 49% 52%',
                      background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 48%, ${colors.secondary} 86%, transparent 100%)`,
                      filter: 'blur(8px)',
                    }}
                    className="absolute"
                  />
                </>
              );
            })()}
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
};
