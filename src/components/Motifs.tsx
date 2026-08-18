import React from 'react';

interface MotifProps {
  className?: string;
  size?: number;
  color?: string;
}

// 柔和微小叶片 (Leaf Motif)
export const LeafMotif: React.FC<MotifProps> = ({ 
  className = '', 
  size = 18, 
  color = 'currentColor' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path 
      d="M20.5 3.5C20.5 3.5 13.5 4 8.5 9C3.5 14 3.5 20.5 3.5 20.5C3.5 20.5 10 20.5 15 15.5C20 10.5 20.5 3.5 20.5 3.5Z" 
      stroke={color} 
      strokeWidth="1.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M8.5 15.5L15.5 8.5" 
      stroke={color} 
      strokeWidth="1.2" 
      strokeLinecap="round" 
    />
  </svg>
);

// 四角星芒图案 (Star / Sparkle Motif)
export const StarMotif: React.FC<MotifProps> = ({
  className = '',
  size = 16,
  color = '#A7CFC3',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path
      d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 弯月图案 (Crescent Moon Motif)
export const CrescentMoonMotif: React.FC<MotifProps & { fill?: string }> = ({
  className = '',
  size = 18,
  color = '#E8B48C',
  fill = 'none',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 钥孔图案 (Keyhole Motif)
export const KeyholeMotif: React.FC<MotifProps> = ({
  className = '',
  size = 16,
  color = '#A89E91',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <circle cx="12" cy="9" r="4" stroke={color} strokeWidth="1.2" />
    <path d="M10 12L8.5 20H15.5L14 12" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

// 柔和气泡 (Bubble Motif)
export const BubbleMotif: React.FC<MotifProps> = ({ 
  className = '', 
  size = 16, 
  color = '#A7CFC3' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.2" strokeOpacity="0.8" />
    <path d="M7 6.5C7.8 5.7 8.9 5.2 10.2 5.2" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.9" />
  </svg>
);

// 波线 (Wavy Line)
export const WavyLineMotif: React.FC<MotifProps & { width?: number; height?: number }> = ({ 
  className = '', 
  width = 36, 
  height = 10, 
  color = '#C7D9D6' 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 36 10" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path 
      d="M1 5C4 2 8 2 11 5C14 8 18 8 21 5C24 2 28 2 31 5C32.5 6.5 34 6.5 35 5" 
      stroke={color} 
      strokeWidth="1.2" 
      strokeLinecap="round" 
    />
  </svg>
);

// 暖桃微小心心 (Peach Heart)
export const PeachHeartMotif: React.FC<MotifProps & { filled?: boolean }> = ({ 
  className = '', 
  size = 14, 
  color = '#F6DCCB',
  filled = true 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    fill={filled ? color : 'none'} 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path 
      d="M8 13.5L2.3 7.8C0.9 6.4 0.9 4.1 2.3 2.7C3.7 1.3 6 1.3 7.4 2.7L8 3.3L8.6 2.7C10 1.3 12.3 1.3 13.7 2.7C15.1 4.1 15.1 6.4 13.7 7.8L8 13.5Z" 
      stroke={color} 
      strokeWidth="1.2" 
      strokeLinejoin="round" 
    />
  </svg>
);

// 暖桃小花 (Little Flower)
export const FlowerMotif: React.FC<MotifProps> = ({ 
  className = '', 
  size = 16, 
  color = '#F6DCCB' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <circle cx="12" cy="7" r="3" fill={color} fillOpacity="0.7" />
    <circle cx="17" cy="11" r="3" fill={color} fillOpacity="0.7" />
    <circle cx="15" cy="17" r="3" fill={color} fillOpacity="0.7" />
    <circle cx="9" cy="17" r="3" fill={color} fillOpacity="0.7" />
    <circle cx="7" cy="11" r="3" fill={color} fillOpacity="0.7" />
    <circle cx="12" cy="12" r="2" fill="#A7CFC3" />
  </svg>
);
