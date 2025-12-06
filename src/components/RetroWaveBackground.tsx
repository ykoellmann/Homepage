import React, { useEffect, useRef } from 'react';
import './RetroWaveBackground.css';

export const RetroWaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars with no flickering
    const stars: Array<{ x: number; y: number; size: number; opacity: number; twinkleSpeed: number; phase: number }> = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Shooting stars
    const shootingStars: Array<{ x: number; y: number; speed: number; length: number; angle: number; active: boolean; timer: number }> = [];
    for (let i = 0; i < 3; i++) {
      shootingStars.push({
        x: canvas.width + 100,
        y: Math.random() * canvas.height * 0.4,
        speed: 0,
        length: 0,
        angle: 0,
        active: false,
        timer: Math.random() * 300 + 100,
      });
    }

    let animationFrame = 0;

    const animate = () => {
      animationFrame++;

      // Draw stars
      stars.forEach(star => {
        star.phase += star.twinkleSpeed;
        const currentOpacity = star.opacity * (0.7 + Math.sin(star.phase) * 0.3);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#fff';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw shooting stars
      shootingStars.forEach(star => {
        if (!star.active) {
          star.timer--;
          if (star.timer <= 0) {
            star.active = true;
            star.x = canvas.width + 100;
            star.y = Math.random() * canvas.height * 0.4;
            star.speed = Math.random() * 3 + 5;
            star.length = Math.random() * 60 + 40;
            star.angle = Math.random() * 0.3 + 0.1;
          }
        } else {
          star.x -= star.speed;
          star.y += star.speed * star.angle;

          const gradient = ctx.createLinearGradient(star.x, star.y, star.x + star.length, star.y);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x + star.length, star.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();

          if (star.x + star.length < 0) {
            star.active = false;
            star.timer = Math.random() * 300 + 100;
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="retro-wave-background">
      {/* Sky Gradient */}
      <div className="retro-sky-gradient" />

      {/* Canvas for stars */}
      <canvas ref={canvasRef} className="stars-canvas" />

      {/* Sun with improved design */}
      <div className="retro-sun-container">
        {/* Outer glow rings */}
        <div className="sun-ring sun-ring-1" />
        <div className="sun-ring sun-ring-2" />
        <div className="sun-ring sun-ring-3" />

        {/* Main sun body */}
        <div className="retro-sun">
          <div className="sun-inner-glow" />

          {/* Horizontal stripes with stagger */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="sun-stripe"
              style={{
                top: `${i * 5}%`,
                height: '5%',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        {/* Sun reflection */}
        <div className="sun-reflection" />
      </div>

      {/* Mountain Layers with curves */}
      <div className="mountains-container">
        <svg className="mountain-svg mountain-far" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path d="M0,400 L0,250 Q150,200 300,220 T600,180 T900,200 T1200,230 L1200,400 Z" />
        </svg>
        <svg className="mountain-svg mountain-mid" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path d="M0,400 L0,280 Q200,240 400,260 T800,240 T1200,270 L1200,400 Z" />
        </svg>
        <svg className="mountain-svg mountain-near" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path d="M0,400 L0,300 Q150,270 300,285 T600,270 T900,280 T1200,295 L1200,400 Z" />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${30 + Math.random() * 20}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Dynamic Grid System */}
      <div className="retro-grid-system">
        <svg className="grid-svg" viewBox="0 0 1200 800" preserveAspectRatio="none">
          {/* Vertical lines with wave */}
          {[...Array(24)].map((_, i) => {
            const x = (i * 50);
            return (
              <path
                key={`v-${i}`}
                className="grid-line grid-vertical"
                d={`M ${x} 0 Q ${x + 10} 200 ${x} 400 T ${x} 800`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            );
          })}

          {/* Horizontal lines with perspective curve */}
          {[...Array(16)].map((_, i) => {
            const y = 200 + (i * 40);
            const curve = i * 5;
            return (
              <path
                key={`h-${i}`}
                className="grid-line grid-horizontal"
                d={`M 0 ${y} Q 300 ${y + curve} 600 ${y} T 1200 ${y}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            );
          })}
        </svg>

        {/* Grid glow effects */}
        <div className="grid-glow-bottom" />
        <div className="grid-intersection-glow" />
      </div>

      {/* Waves/Energy lines */}
      <div className="energy-waves">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="energy-wave"
            style={{
              top: `${50 + i * 8}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Atmospheric effects */}
      <div className="atmosphere-layer atmosphere-1" />
      <div className="atmosphere-layer atmosphere-2" />
      <div className="atmosphere-layer atmosphere-3" />

      {/* Scan lines */}
      <div className="retro-scanlines" />

      {/* Vignette */}
      <div className="vignette" />

      {/* Chromatic aberration subtle effect */}
      <div className="chromatic-effect" />
    </div>
  );
};
