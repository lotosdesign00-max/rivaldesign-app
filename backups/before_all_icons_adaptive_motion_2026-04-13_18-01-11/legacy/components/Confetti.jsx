import React, { useEffect, useRef } from "react";

function Confetti({ active, accent }) {
  const canRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: -10,
      vx: (Math.random() - 0.5) * 5, vy: Math.random() * 5 + 2,
      rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 10,
      w: Math.random() * 12 + 4, h: Math.random() * 7 + 3,
      color: [accent, "#fff", "#fbbf24", "#f472b6", "#34d399", "#60a5fa"][Math.floor(Math.random() * 6)],
      life: 1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV; p.life -= 0.007;
        if (p.life > 0 && p.y < canvas.height) {
          alive = true;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
          ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });
      if (alive) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active, accent]);
  return <canvas ref={canRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }} />;
}

export default Confetti;
