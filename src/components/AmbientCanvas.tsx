import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { AmbientParticle, ParticleKind } from '../types';
import { AtmosphereMode } from '../utils/motion';

export interface AmbientCanvasHandle {
  triggerBreeze: () => void;
  spawnRipple?: (x: number, y: number) => void;
  spawnPigmentBloom?: (x: number, y: number, mode: AtmosphereMode) => void;
}

interface AmbientCanvasProps {
  reducedMotion?: boolean;
  atmosphere?: AtmosphereMode;
  zenMode?: boolean;
}

interface MistRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const AmbientCanvas = forwardRef<AmbientCanvasHandle, AmbientCanvasProps>(
  ({ reducedMotion = false, atmosphere = 'mist', zenMode = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<AmbientParticle[]>([]);
    const ripplesRef = useRef<MistRipple[]>([]);
    const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
      x: -1000,
      y: -1000,
      active: false,
    });
    const windBoostRef = useRef<number>(0);
    const atmosphereRef = useRef<AtmosphereMode>(atmosphere);
    const animFrameIdRef = useRef<number | null>(null);

    atmosphereRef.current = atmosphere;

    const getPaletteColor = (kind: ParticleKind, mode: AtmosphereMode) => {
      if (mode === 'warm') {
        if (kind === 'heart') return 'rgba(232, 180, 140, 0.85)';
        if (kind === 'circle' || kind === 'dot') return 'rgba(218, 202, 180, 0.65)';
        if (kind === 'bubble') return 'rgba(184, 200, 186, 0.72)';
        return 'rgba(167, 196, 178, 0.76)';
      }
      if (mode === 'celadon') {
        if (kind === 'heart') return 'rgba(246, 220, 203, 0.85)';
        if (kind === 'circle' || kind === 'dot') return 'rgba(180, 210, 204, 0.65)';
        return 'rgba(138, 184, 173, 0.76)';
      }
      // 默认 mist
      if (kind === 'heart') return 'rgba(246, 220, 203, 0.85)';
      if (kind === 'circle' || kind === 'dot') return 'rgba(199, 217, 214, 0.6)';
      if (kind === 'leaf') return 'rgba(167, 207, 195, 0.75)';
      return 'rgba(167, 207, 195, 0.7)';
    };

    // 创建粒子辅助函数
    const createParticle = (
      x?: number,
      y?: number,
      preferredKind?: ParticleKind,
      customVx?: number,
      customVy?: number
    ): AmbientParticle => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const kinds: ParticleKind[] = ['bubble', 'leaf', 'circle', 'dot', 'heart'];
      const kind = preferredKind || kinds[Math.floor(Math.random() * kinds.length)];

      const px = x !== undefined ? x : Math.random() * width;
      const py = y !== undefined ? y : kind === 'leaf' ? -20 : height + 20;

      const color = getPaletteColor(kind, atmosphereRef.current);

      const isRising = kind === 'bubble' || kind === 'circle' || kind === 'dot';
      const baseVy =
        customVy !== undefined
          ? customVy
          : isRising
          ? -(0.28 + Math.random() * 0.38)
          : 0.32 + Math.random() * 0.42;
      const baseVx = customVx !== undefined ? customVx : (Math.random() - 0.5) * 0.28;
      const size =
        kind === 'leaf'
          ? 12 + Math.random() * 8
          : kind === 'heart'
          ? 10 + Math.random() * 6
          : 6 + Math.random() * 10;

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
        maxAlpha: 0.38 + Math.random() * 0.42,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.014,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.018,
        swayAmplitude: 0.35 + Math.random() * 0.55,
        life: 0,
        maxLife: 420 + Math.random() * 520,
      };
    };

    const spawnRippleAt = (x: number, y: number) => {
      if (reducedMotion) return;
      const color =
        atmosphereRef.current === 'warm'
          ? 'rgba(232, 180, 140, 0.36)'
          : 'rgba(167, 207, 195, 0.38)';
      ripplesRef.current.push({
        x,
        y,
        radius: 6,
        maxRadius: 56 + Math.random() * 24,
        alpha: 0.36,
        color,
      });
    };

    // 暴露「起风了」微彩蛋指令 (Breeze Mode)
    useImperativeHandle(ref, () => ({
      triggerBreeze: () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        windBoostRef.current = 1.65;

        const count = 14;
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            const kind: ParticleKind = Math.random() > 0.32 ? 'leaf' : 'bubble';
            const startX = Math.random() * (width * 0.65);
            const startY = kind === 'leaf' ? -10 : height + 10;
            const p = createParticle(
              startX,
              startY,
              kind,
              1.1 + Math.random() * 1.4,
              kind === 'leaf' ? 0.55 + Math.random() * 0.55 : -0.95 - Math.random() * 0.75
            );
            p.maxLife = 620;
            p.swayAmplitude = 1.15;
            particlesRef.current.push(p);
          }, i * 65);
        }
      },
      spawnRipple: spawnRippleAt,
      spawnPigmentBloom: (x: number, y: number, mode: AtmosphereMode) => {
        if (reducedMotion) return;
        const ringColor =
          mode === 'warm'
            ? 'rgba(232, 180, 140, 0.42)'
            : mode === 'celadon'
            ? 'rgba(138, 184, 173, 0.42)'
            : 'rgba(167, 207, 195, 0.42)';

        // 扩散两层柔和涟漪环
        ripplesRef.current.push(
          { x, y, radius: 10, maxRadius: 120, alpha: 0.45, color: ringColor },
          { x, y, radius: 4, maxRadius: 210, alpha: 0.3, color: ringColor }
        );

        // 沿墨滴向四周轻柔散逸水彩微粒
        const kinds: ParticleKind[] = ['bubble', 'leaf', 'circle', 'dot'];
        for (let i = 0; i < 12; i++) {
          const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.4;
          const speed = 0.85 + Math.random() * 1.1;
          const kind = kinds[i % kinds.length];
          const p = createParticle(
            x,
            y,
            kind,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
          );
          p.color = getPaletteColor(kind, mode);
          p.maxLife = 240 + Math.random() * 160;
          p.maxAlpha = 0.55;
          particlesRef.current.push(p);
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = window.innerWidth;
      let height = window.innerHeight;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);

      const updateCanvasSize = () => {
        if (!canvas) return;
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);

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

      // 彩蛋：点击空白处生成轻柔涟漪环 + 2~3 个微小气泡或落叶
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button, a, input, select, textarea, [role="button"]')) {
          return;
        }

        spawnRippleAt(e.clientX, e.clientY);

        const spawnCount = Math.floor(Math.random() * 2) + 2;
        const spawnType: ParticleKind = Math.random() > 0.45 ? 'leaf' : 'bubble';
        for (let i = 0; i < spawnCount; i++) {
          const offsetX = (Math.random() - 0.5) * 34;
          const offsetY = (Math.random() - 0.5) * 34;
          const p = createParticle(e.clientX + offsetX, e.clientY + offsetY, spawnType);
          p.alpha = 0.08;
          p.vx = (Math.random() - 0.5) * 0.75;
          p.vy =
            spawnType === 'bubble'
              ? -(0.75 + Math.random() * 0.55)
              : 0.55 + Math.random() * 0.55;
          particlesRef.current.push(p);
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('click', handleClick);

      const drawLeaf = (x: number, y: number, size: number, angle: number, alpha: number, color: string) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.25;
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

      const drawCircle = (
        x: number,
        y: number,
        radius: number,
        alpha: number,
        color: string,
        filled: boolean
      ) => {
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
        const ripples = ripplesRef.current;
        const mouse = mouseRef.current;

        // 衰减全局微风推力
        if (windBoostRef.current > 0.01) {
          windBoostRef.current *= 0.988;
        } else {
          windBoostRef.current = 0;
        }

        // 绘制点击水波纹
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += (r.maxRadius - r.radius) * 0.065;
          r.alpha *= 0.945;

          ctx.save();
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = r.color;
          ctx.globalAlpha = r.alpha;
          ctx.lineWidth = 1.1;
          ctx.stroke();
          ctx.restore();

          if (r.alpha < 0.01 || r.radius >= r.maxRadius - 0.5) {
            ripples.splice(i, 1);
          }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];

          if (!reducedMotion) {
            p.life++;
            p.swayPhase += p.swaySpeed;
            p.rotation += p.rotSpeed + windBoostRef.current * 0.015;

            const sway = Math.sin(p.swayPhase) * p.swayAmplitude;
            p.x += p.vx + sway + windBoostRef.current * 0.7;
            p.y += p.vy - windBoostRef.current * 0.12;

            // 鼠标推开斥力物理
            if (mouse.active) {
              const dx = p.x - mouse.x;
              const dy = p.y - mouse.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const repelRadius = 115;

              if (dist < repelRadius && dist > 0) {
                const force = (1 - dist / repelRadius) * 1.65;
                p.x += (dx / dist) * force;
                p.y += (dy / dist) * force;
              }
            }

            // 淡入与淡出曲线
            if (p.life < 65) {
              p.alpha = (p.life / 65) * p.maxAlpha;
            } else if (p.life > p.maxLife - 65) {
              p.alpha = Math.max(0, ((p.maxLife - p.life) / 65) * p.maxAlpha);
            } else {
              p.alpha = p.maxAlpha;
            }
          } else {
            p.alpha = 0.22;
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

          if (
            !reducedMotion &&
            (p.life >= p.maxLife || p.y < -60 || p.y > height + 60 || p.x < -60 || p.x > width + 60)
          ) {
            particles.splice(i, 1);
          }
        }

        if (!reducedMotion && particles.length < 7 && Math.random() < 0.022) {
          particles.push(createParticle());
        }

        animFrameIdRef.current = requestAnimationFrame(render);
      };

      render();

      return () => {
        if (animFrameIdRef.current) {
          cancelAnimationFrame(animFrameIdRef.current);
        }
        window.removeEventListener('resize', updateCanvasSize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('click', handleClick);
      };
    }, [reducedMotion]);

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
        style={{ opacity: zenMode ? 0.25 : reducedMotion ? 0.38 : 1 }}
      />
    );
  }
);
