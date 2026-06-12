import { useEffect, useRef } from "react";

interface Bolt {
  points: { x: number; y: number }[];
  opacity: number;
  life: number;
  maxLife: number;
  width: number;
}

const ElectricBolts = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boltsRef = useRef<Bolt[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const createBolt = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const side = Math.random();
      let sx: number, sy: number, ex: number, ey: number;

      if (side < 0.25) {
        sx = Math.random() * w; sy = 0;
        ex = sx + (Math.random() - 0.5) * w * 0.6; ey = h * (0.4 + Math.random() * 0.6);
      } else if (side < 0.5) {
        sx = Math.random() * w; sy = h;
        ex = sx + (Math.random() - 0.5) * w * 0.6; ey = h * (0 + Math.random() * 0.5);
      } else if (side < 0.75) {
        sx = 0; sy = Math.random() * h;
        ex = w * (0.3 + Math.random() * 0.7); ey = sy + (Math.random() - 0.5) * h * 0.6;
      } else {
        sx = w; sy = Math.random() * h;
        ex = w * (0 + Math.random() * 0.7); ey = sy + (Math.random() - 0.5) * h * 0.6;
      }

      const points: { x: number; y: number }[] = [{ x: sx, y: sy }];
      const segments = 6 + Math.floor(Math.random() * 6);
      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const mx = sx + (ex - sx) * t + (Math.random() - 0.5) * 60;
        const my = sy + (ey - sy) * t + (Math.random() - 0.5) * 40;
        points.push({ x: mx, y: my });
      }

      const maxLife = 12 + Math.random() * 18;
      boltsRef.current.push({ points, opacity: 1, life: 0, maxLife, width: 1 + Math.random() * 1.5 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // Spawn new bolts randomly
      if (Math.random() < 0.06) createBolt();

      const bolts = boltsRef.current;
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.life++;
        const progress = b.life / b.maxLife;
        b.opacity = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;

        if (b.life >= b.maxLife) {
          bolts.splice(i, 1);
          continue;
        }

        // Main bolt
        ctx.beginPath();
        ctx.moveTo(b.points[0].x, b.points[0].y);
        for (let j = 1; j < b.points.length; j++) {
          ctx.lineTo(b.points[j].x, b.points[j].y);
        }
        ctx.strokeStyle = `hsla(192, 82%, 55%, ${b.opacity * 0.5})`;
        ctx.lineWidth = b.width;
        ctx.stroke();

        // Glow layer
        ctx.beginPath();
        ctx.moveTo(b.points[0].x, b.points[0].y);
        for (let j = 1; j < b.points.length; j++) {
          ctx.lineTo(b.points[j].x, b.points[j].y);
        }
        ctx.strokeStyle = `hsla(192, 82%, 65%, ${b.opacity * 0.2})`;
        ctx.lineWidth = b.width + 4;
        ctx.stroke();

        // Small branches
        if (progress < 0.3) {
          for (let j = 1; j < b.points.length - 1; j++) {
            if (Math.random() < 0.15) {
              const bp = b.points[j];
              const bex = bp.x + (Math.random() - 0.5) * 30;
              const bey = bp.y + (Math.random() - 0.5) * 20;
              ctx.beginPath();
              ctx.moveTo(bp.x, bp.y);
              ctx.lineTo(bex, bey);
              ctx.strokeStyle = `hsla(192, 82%, 60%, ${b.opacity * 0.3})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
};

export default ElectricBolts;
