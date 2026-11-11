import React from 'react';
import { motion } from 'framer-motion';
import { MIST_EASE } from '../utils/motion';

interface MistRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blurAmount?: number;
  className?: string;
  viewportOnce?: boolean;
}

/**
 * 雾气浮现动效：元素带着柔和焦外散景缓缓凝实浮现，如墨入宣纸
 */
export const MistReveal: React.FC<MistRevealProps> = ({
  children,
  delay = 0,
  duration = 0.78,
  yOffset = 16,
  blurAmount = 7,
  className = '',
  viewportOnce = false,
}) => {
  const initial = {
    opacity: 0,
    y: yOffset,
    filter: `blur(${blurAmount}px)`,
  };
  const target = {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  };

  if (viewportOnce) {
    return (
      <motion.div
        initial={initial}
        whileInView={target}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration, delay, ease: MIST_EASE }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      animate={target}
      transition={{ duration, delay, ease: MIST_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface EditorialRuleProps {
  className?: string;
  delay?: number;
  duration?: number;
}

/**
 * 刊物级细线描边展开
 */
export const EditorialRule: React.FC<EditorialRuleProps> = ({
  className = '',
  delay = 0,
  duration = 0.85,
}) => (
  <motion.span
    initial={{ scaleX: 0, opacity: 0.3 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration, delay, ease: MIST_EASE }}
    style={{ transformOrigin: '0% 50%' }}
    className={`block h-px bg-current ${className}`}
  />
);

interface CurtainImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
}

/**
 * 展陈级图片揭幕动效：柔和遮罩舒展 + 微幅定格推进
 */
export const CurtainImage: React.FC<CurtainImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  delay = 0.08,
}) => (
  <motion.div
    initial={{ clipPath: 'inset(6% 2% 6% 2% round 8px)', opacity: 0.35 }}
    animate={{ clipPath: 'inset(0% 0% 0% 0% round 10px)', opacity: 1 }}
    transition={{ duration: 0.85, delay, ease: MIST_EASE }}
    className={`overflow-hidden ${className}`}
  >
    <motion.img
      initial={{ scale: 1.07 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.1, delay, ease: MIST_EASE }}
      src={src}
      alt={alt}
      className={imgClassName}
    />
  </motion.div>
);

/**
 * 印刷裁切线角标（用于高级刊物卡片四角微装饰）
 */
export const SpecimenCorners: React.FC<{ active?: boolean }> = ({ active = false }) => {
  const colorClass = active ? 'border-[#8EABA8]/85' : 'border-[#C7D9D6]/65';
  return (
    <>
      <span
        className={`pointer-events-none absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l transition-colors duration-500 ${colorClass}`}
      />
      <span
        className={`pointer-events-none absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r transition-colors duration-500 ${colorClass}`}
      />
      <span
        className={`pointer-events-none absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l transition-colors duration-500 ${colorClass}`}
      />
      <span
        className={`pointer-events-none absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r transition-colors duration-500 ${colorClass}`}
      />
    </>
  );
};
