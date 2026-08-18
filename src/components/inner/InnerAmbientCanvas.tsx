import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  opacity: number;
  maxOpacity: number;
  swayAmp: number;
  swaySpeed: number;
  swayPhase: number;
  baseX: number;
  offsetX: number;
  offsetY: number;
}

interface NightLeaf {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  angle: number;
  angularSpeed: number;
  opacity: number;
  baseX: number;
  offsetX: number;
  offsetY: number;
}

export interface InnerAmbientCanvasHandle {
  spawnParticles: (x: number, y: number) => void;
}

interface InnerAmbientCanvasProps {
  reducedMotion?: boolean;
  density?: 'low' | 'medium';
}

export const InnerAmbientCanvas = forwardRef<InnerAmbientCanvasHandle, InnerAmbientCanvasProps>(
  ({ reducedMotion = false, density = 'medium' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
    const bubblesRef = useRef<Bubble[]>([]);
    const leavesRef = useRef<NightLeaf[]>([]);
    const reqIdRef = useRef<number | null>(null);

    const spawnParticles = (x: number, y: number) => {
      if (reducedMotion) return;
      // 随机生成 2~3 个小气泡与 1 片叶子
      for (let i = 0; i < 2; i++) {
        bubblesRef.current.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 40,
          r: 3 + Math.random() * 4,
          vy: -(0.3 + Math.random() * 0.4),
          vx: (Math.random() - 0.5) * 0.2,
          opacity: 0.1,
          maxOpacity: 0.25 + Math.random() * 0.2,
          swayAmp: 6 + Math.random() * 8,
          swaySpeed: 0.002 + Math.random() * 0.003,
          swayPhase: Math.random() * Math.PI * 2,
          baseX: x,
          offsetX: 0,
          offsetY: 0,
        });
      }
      leavesRef.current.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y,
        size: 10 + Math.random() * 6,
        vy: 0.2 + Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.2,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.01,
        opacity: 0.25,
        baseX: x,
        offsetX: 0,
        offsetY: 0,
      });
    };

    useImperativeHandle(ref, () => ({
      spawnParticles,
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const handleResize = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };

      const handleMouseMove = (e: MouseEvent) => {
        mousePosRef.current = { x: e.clientX, y: e.clientY };
      };

      const handleMouseLeave = () => {
        mousePosRef.current = { x: -1000, y: -1000 };
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);

      // 初始化气泡与夜叶
      const bubbleCount = density === 'low' ? 6 : 12;
      const leafCount = density === 'low' ? 3 : 6;

      bubblesRef.current = Array.from({ length: bubbleCount }, () => {
        const x = Math.random() * width;
        return {
          x,
          y: Math.random() * height,
          r: 2.5 + Math.random() * 4.5,
          vy: -(0.2 + Math.random() * 0.35),
          vx: 0,
          opacity: 0.05 + Math.random() * 0.15,
          maxOpacity: 0.15 + Math.random() * 0.2,
          swayAmp: 8 + Math.random() * 12,
          swaySpeed: 0.0015 + Math.random() * 0.0025,
          swayPhase: Math.random() * Math.PI * 2,
          baseX: x,
          offsetX: 0,
          offsetY: 0,
        };
      });

      leavesRef.current = Array.from({ length: leafCount }, () => {
        const x = Math.random() * width;
        return {
          x,
          y: Math.random() * height,
          size: 9 + Math.random() * 7,
          vy: 0.18 + Math.random() * 0.28,
          vx: (Math.random() - 0.5) * 0.15,
          angle: Math.random() * Math.PI * 2,
          angularSpeed: (Math.random() - 0.5) * 0.008,
          opacity: 0.12 + Math.random() * 0.15,
          baseX: x,
          offsetX: 0,
          offsetY: 0,
        };
      });

      let lastTime = performance.now();

      const render = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        ctx.clearRect(0, 0, width, height);

        const mouse = mousePosRef.current;

        // 1. 绘制上升小气泡
        bubblesRef.current.forEach((b) => {
          if (!reducedMotion) {
            b.y += b.vy * dt * 60;
            b.swayPhase += b.swaySpeed * dt * 60;
            b.x = b.baseX + Math.sin(b.swayPhase) * b.swayAmp + b.offsetX;

            // 鼠标靠近推开 (70~100px 范围)
            const dx = b.x - mouse.x;
            const dy = b.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 85 && dist > 0) {
              const force = (85 - dist) / 85;
              b.offsetX += (dx / dist) * force * 1.5;
              b.offsetY += (dy / dist) * force * 1.5;
            } else {
              b.offsetX *= 0.96;
              b.offsetY *= 0.96;
            }

            // 顶部重置
            if (b.y + b.r < 0) {
              b.y = height + b.r + Math.random() * 20;
              b.baseX = Math.random() * width;
              b.x = b.baseX;
              b.offsetX = 0;
              b.offsetY = 0;
            }
          }

          // 绘制极轻气泡
          ctx.save();
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(167, 207, 195, ${b.opacity * 0.8})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // 气泡微小高光
          ctx.beginPath();
          ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232, 180, 140, ${b.opacity * 0.9})`;
          ctx.fill();
          ctx.restore();
        });

        // 2. 绘制下落小夜叶
        leavesRef.current.forEach((l) => {
          if (!reducedMotion) {
            l.y += l.vy * dt * 60;
            l.baseX += l.vx * dt * 60;
            l.angle += l.angularSpeed * dt * 60;
            l.x = l.baseX + l.offsetX;

            const dx = l.x - mouse.x;
            const dy = l.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 85 && dist > 0) {
              const force = (85 - dist) / 85;
              l.offsetX += (dx / dist) * force * 1.8;
              l.offsetY += (dy / dist) * force * 1.8;
            } else {
              l.offsetX *= 0.96;
              l.offsetY *= 0.96;
            }

            // 底部重置
            if (l.y - l.size > height) {
              l.y = -l.size - Math.random() * 20;
              l.baseX = Math.random() * width;
              l.x = l.baseX;
              l.offsetX = 0;
              l.offsetY = 0;
            }
          }

          // 绘制极简小叶轮廓
          ctx.save();
          ctx.translate(l.x, l.y);
          ctx.rotate(l.angle);
          ctx.strokeStyle = `rgba(215, 201, 184, ${l.opacity * 0.7})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -l.size * 0.6);
          ctx.quadraticCurveTo(l.size * 0.45, 0, 0, l.size * 0.6);
          ctx.quadraticCurveTo(-l.size * 0.45, 0, 0, -l.size * 0.6);
          ctx.stroke();
          ctx.restore();
        });

        reqIdRef.current = requestAnimationFrame(render);
      };

      reqIdRef.current = requestAnimationFrame(render);

      return () => {
        if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [reducedMotion, density]);

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.85 }}
      />
    );
  }
);
