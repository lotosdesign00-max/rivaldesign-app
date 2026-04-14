import React, { useEffect, useRef } from "react";

function Sparkles({ x, y, th }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = 200;
    canvas.height = 200;
    
    const particles = Array.from({ length: 20 }, () => ({
      x: 100,
      y: 100,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      size: Math.random() * 4 + 2,
      life: 1,
      decay: Math.random() * 0.03 + 0.02,
    }));
    
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= p.decay;
        
        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.fillStyle = th.accent;
          ctx.shadowColor = th.accent;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
      
      if (alive) {
        raf = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    draw();
    
    return () => cancelAnimationFrame(raf);
  }, [th]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        left: x - 100,
        top: y - 100,
        width: 200,
        height: 200,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}

export default Sparkles;
