'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: 'slow' | 'fast';
  waveOpacity?: number;
  [key: string]: any;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className,
  containerClassName,
  colors = ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee'],
  waveWidth = 50,
  backgroundFill = 'black',
  blur = 10,
  speed = 'fast',
  waveOpacity = 0.5,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Detect Safari for performance optimization
    setIsSafari(
      typeof window !== 'undefined' &&
        navigator.userAgent.includes('Safari') &&
        !navigator.userAgent.includes('Chrome')
    );
  }, []);

  const getSpeed = () => {
    switch (speed) {
      case 'slow':
        return 0.001;
      case 'fast':
        return 0.002;
      default:
        return 0.001;
    }
  };

  // Simplex noise implementation
  class SimplexNoise {
    private grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
    ];
    private p: number[] = [];
    private perm: number[] = [];

    constructor() {
      for (let i = 0; i < 256; i++) {
        this.p[i] = Math.floor(Math.random() * 256);
      }
      for (let i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
      }
    }

    private dot(g: number[], x: number, y: number) {
      return g[0] * x + g[1] * y;
    }

    noise(xin: number, yin: number): number {
      let n0, n1, n2;
      const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
      const s = (xin + yin) * F2;
      const i = Math.floor(xin + s);
      const j = Math.floor(yin + s);
      const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
      const t = (i + j) * G2;
      const X0 = i - t;
      const Y0 = j - t;
      const x0 = xin - X0;
      const y0 = yin - Y0;

      let i1, j1;
      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } else {
        i1 = 0;
        j1 = 1;
      }

      const x1 = x0 - i1 + G2;
      const y1 = y0 - j1 + G2;
      const x2 = x0 - 1.0 + 2.0 * G2;
      const y2 = y0 - 1.0 + 2.0 * G2;

      const ii = i & 255;
      const jj = j & 255;
      const gi0 = this.perm[ii + this.perm[jj]] % 12;
      const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
      const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;

      let t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 < 0) {
        n0 = 0.0;
      } else {
        t0 *= t0;
        n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
      }

      let t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 < 0) {
        n1 = 0.0;
      } else {
        t1 *= t1;
        n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
      }

      let t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 < 0) {
        n2 = 0.0;
      } else {
        t2 *= t2;
        n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
      }

      return 70.0 * (n0 + n1 + n2);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    const noise = new SimplexNoise();

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawWave = (
      ctx: CanvasRenderingContext2D,
      color: string,
      yOffset: number,
      amplitude: number,
      frequency: number,
      time: number
    ) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = waveOpacity;

      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x < canvas.width; x += 5) {
        const noiseValue = noise.noise(x * 0.01 * frequency, time + yOffset);
        const y = canvas.height / 2 + noiseValue * amplitude + yOffset;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw multiple waves
      colors.forEach((color, i) => {
        drawWave(
          ctx,
          color,
          i * 30 - 100,
          waveWidth + i * 10,
          0.5 + i * 0.1,
          time + i * 0.5
        );
      });

      time += getSpeed();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [backgroundFill, blur, colors, waveOpacity, waveWidth, speed]);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-full',
        containerClassName
      )}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{
          filter: `blur(${blur}px)`,
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      />
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
};

