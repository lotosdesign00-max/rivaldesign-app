import React, { useEffect, useRef } from "react";

function Sparkles({ x, y, th }) {
  const canvasRef = useRef(null);
  const isMobilePerf = typeof document !== "undefined" && document.documentElement.dataset.rsMobile === "true";
  const size = isMobilePerf ? 128 : 200;
  const center = size / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, isMobilePerf ? 1.25 : 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles = Array.from({ length: isMobilePerf ? 9 : 20 }, () => ({
      x: center,
      y: center,
      vx: (Math.random() - 0.5) * (isMobilePerf ? 5.2 : 8),
      vy: (Math.random() - 0.5) * (isMobilePerf ? 5.2 : 8),
      size: Math.random() * 4 + 2,
      life: 1,
      decay: Math.random() * (isMobilePerf ? 0.05 : 0.03) + (isMobilePerf ? 0.035 : 0.02),
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += isMobilePerf ? 0.1 : 0.15;
        p.life -= p.decay;

        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.fillStyle = th.accent;
          if (!isMobilePerf) {
            ctx.shadowColor = th.accent;
            ctx.shadowBlur = 10;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        raf = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, size, size);
      }
    };

    draw();

    return () => cancelAnimationFrame(raf);
  }, [center, isMobilePerf, size, th.accent]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        left: x - center,
        top: y - center,
        width: size,
        height: size,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}

export default Sparkles;
