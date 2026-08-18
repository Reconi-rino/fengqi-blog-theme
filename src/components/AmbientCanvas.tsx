import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { AmbientParticle, ParticleKind } from '../types';

export interface AmbientCanvasHandle {
  triggerBreeze: () => void;
}

interface AmbientCanvasProps {
  reducedMotion?: boolean;
}

export const AmbientCanvas = forwardRef<AmbientCanvasHandle, AmbientCanvasProps>(({ reducedMotion = false }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<AmbientParticle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const animFrameIdRef = useRef<number | null>(null);

  // 创建粒子辅助函数
  const createParticle = (x?: number, y?: number, preferredKind?: ParticleKind, customVx?: number, customVy?: number): AmbientParticle => {
    const width = canvasRef.current?.width || window.innerWidth;
    const height = canvasRef.current?.height || window.innerHeight;

    const kinds: ParticleKind[] = ['bubble', 'leaf', 'circle', 'dot', 'heart'];
    const kind = preferredKind || kinds[Math.floor(Math.random() * kinds.length)];
    
    const px = x !== undefined ? x : Math.random() * width;
    const py = y !== undefined ? y : (kind === 'leaf' ? -20 : height + 20);

    let color = 'rgba(167, 207, 195, 0.7)'; // 薄荷绿
    if (kind === 'heart') color = 'rgba(246, 220, 203, 0.85)'; // 暖桃
    if (kind === 'circle' || kind === 'dot') color = 'rgba(199, 217, 214, 0.6)'; // 雾青
    if (kind === 'leaf') color = 'rgba(167, 207, 195, 0.75)';

    const isRising = kind === 'bubble' || kind === 'circle' || kind === 'dot';
    const baseVy = customVy !== undefined ? customVy : (isRising ? -(0.3 + Math.random() * 0.4) : (0.35 + Math.random() * 0.45));
    const baseVx = customVx !== undefined ? customVx : (Math.random() - 0.5) * 0.3;
    const size = kind === 'leaf' ? 12 + Math.random() * 8 : (kind === 'heart' ? 10 + Math.random() * 6 : 6 + Math.random() * 10);

    return {
      id: Math.random(),
      x: px,
      y: py,
      vx: baseVx,
      vy: baseVy,
      size,
      kind,
      color,
      alpha: 0,
      maxAlpha: 0.4 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.01 + Math.random() * 0.02,
      swayAmplitude: 0.4 + Math.random() * 0.6,
      life: 0,
      maxLife: 400 + Math.random() * 500,
    };
  };

  // 暴露「起风了」微彩蛋指令 (Breeze Mode)
  useImperativeHandle(ref, () => ({
    triggerBreeze: () => {
      const width = canvasRef.current?.width || window.innerWidth;
      const height = canvasRef.current?.height || window.innerHeight;
      const count = 16;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const kind: ParticleKind = Math.random() > 0.3 ? 'leaf' : 'bubble';
          const startX = Math.random() * (width * 0.7);
          const startY = kind === 'leaf' ? -10 : height + 10;
          const p = createParticle(startX, startY, kind, 1.2 + Math.random() * 1.5, kind === 'leaf' ? 0.6 + Math.random() * 0.6 : -1.0 - Math.random() * 0.8);
          p.maxLife = 600;
          p.swayAmplitude = 1.2;
          particlesRef.current.push(p);
        }, i * 70);
      }
    },
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

    window.addEventListener('resize', handleResize);

    // 初始化稀疏的 7 个元素
    if (particlesRef.current.length === 0) {
      const initialCount = 7;
      for (let i = 0; i < initialCount; i++) {
        const p = createParticle(Math.random() * width, Math.random() * height);
        p.life = Math.random() * (p.maxLife * 0.7);
        p.alpha = p.maxAlpha * 0.8;
        particlesRef.current.push(p);
      }
    }

    // 鼠标移动监听 (微扰动)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // 彩蛋 1：点击空白处生成 2~4 个微小气泡或落叶
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea, [role="button"]')) {
        return;
      }
      
      const spawnCount = Math.floor(Math.random() * 3) + 2;
      const spawnType: ParticleKind = Math.random() > 0.5 ? 'bubble' : 'leaf';
      for (let i = 0; i < spawnCount; i++) {
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        const p = createParticle(e.clientX + offsetX, e.clientY + offsetY, spawnType);
        p.alpha = 0.1;
        p.vx = (Math.random() - 0.5) * 0.8;
        p.vy = spawnType === 'bubble' ? -(0.8 + Math.random() * 0.6) : (0.6 + Math.random() * 0.6);
        particlesRef.current.push(p);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // 绘制叶片路径
    const drawLeaf = (x: number, y: number, size: number, angle: number, alpha: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.bezierCurveTo(size * 0.6, -size * 0.3, size * 0.6, size * 0.3, 0, size / 2);
      ctx.bezierCurveTo(-size * 0.6, size * 0.3, -size * 0.6, -size * 0.3, 0, -size / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -size / 2.5);
      ctx.lineTo(0, size / 2.5);
      ctx.stroke();

      ctx.restore();
    };

    // 绘制气泡路径
    const drawBubble = (x: number, y: number, radius: number, alpha: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.4, 0.8 * Math.PI, 1.4 * Math.PI);
      ctx.stroke();

      ctx.restore();
    };

    // 绘制暖桃心心
    const drawHeart = (x: number, y: number, size: number, alpha: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      const s = size / 16;
      ctx.beginPath();
      ctx.moveTo(0, 5 * s);
      ctx.bezierCurveTo(-5 * s, 0, -8 * s, -5 * s, 0, -8 * s);
      ctx.bezierCurveTo(8 * s, -5 * s, 5 * s, 0, 0, 5 * s);
      ctx.fill();
      ctx.restore();
    };

    // 绘制空心圆或小点
    const drawCircle = (x: number, y: number, radius: number, alpha: number, color: string, filled: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      if (filled) {
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();
    };

    // 渲染循环
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (!reducedMotion) {
          p.life++;
          p.swayPhase += p.swaySpeed;
          p.rotation += p.rotSpeed;

          const sway = Math.sin(p.swayPhase) * p.swayAmplitude;
          p.x += p.vx + sway;
          p.y += p.vy;

          // 鼠标推开斥力物理
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 110;

            if (dist < repelRadius && dist > 0) {
              const force = (1 - dist / repelRadius) * 1.8;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }

          // 淡入与淡出曲线
          if (p.life < 60) {
            p.alpha = (p.life / 60) * p.maxAlpha;
          } else if (p.life > p.maxLife - 60) {
            p.alpha = Math.max(0, ((p.maxLife - p.life) / 60) * p.maxAlpha);
          } else {
            p.alpha = p.maxAlpha;
          }
        } else {
          p.alpha = 0.25;
        }

        if (p.kind === 'leaf') {
          drawLeaf(p.x, p.y, p.size, p.rotation, p.alpha, p.color);
        } else if (p.kind === 'bubble') {
          drawBubble(p.x, p.y, p.size / 2, p.alpha, p.color);
        } else if (p.kind === 'heart') {
          drawHeart(p.x, p.y, p.size, p.alpha, p.color);
        } else if (p.kind === 'circle') {
          drawCircle(p.x, p.y, p.size / 2, p.alpha, p.color, false);
        } else {
          drawCircle(p.x, p.y, Math.max(2, p.size / 4), p.alpha, p.color, true);
        }

        if (!reducedMotion && (p.life >= p.maxLife || p.y < -50 || p.y > height + 50 || p.x < -50 || p.x > width + 50)) {
          particles.splice(i, 1);
        }
      }

      if (!reducedMotion && particles.length < 7 && Math.random() < 0.02) {
        particles.push(createParticle());
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: reducedMotion ? 0.4 : 1 }}
    />
  );
});
