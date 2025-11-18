import React from 'react';
import type { Shape } from '../hooks/useShapePhysics';

interface AnimatedBackgroundProps {
  shapes: Shape[];
  isMobile: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ shapes, isMobile }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Animated Grid Lines */}
      <div className="hero-grid-container">
        <div className="hero-grid" />
      </div>

      {/* Interactive Geometric Shapes - Hidden on Mobile */}
      {!isMobile && (
        <div className="geometric-shapes">
          {shapes.map((shape, index) => {
            // Calculate fluid deformation effects
            const squashScale = 1 - shape.squash * 0.3;
            const scaleX = (1 + shape.deformX * 0.4) * squashScale;
            const scaleY = (1 + shape.deformY * 0.4) * squashScale;

            // Calculate border-radius for liquid-like effect
            const baseRadius = 30;
            const radiusVariation = 40;
            const r1 = baseRadius + radiusVariation * (0.5 + shape.deformX * 0.5 + shape.deformY * 0.3);
            const r2 = baseRadius + radiusVariation * (0.5 - shape.deformX * 0.3 + shape.deformY * 0.5);
            const r3 = baseRadius + radiusVariation * (0.5 + shape.deformX * 0.4 - shape.deformY * 0.4);
            const r4 = baseRadius + radiusVariation * (0.5 - shape.deformX * 0.5 - shape.deformY * 0.3);

            return (
              <div
                key={shape.id}
                className={`shape shape-interactive shape-style-${(index % 4) + 1}`}
                style={{
                  left: `${shape.x}%`,
                  top: `${shape.y}%`,
                  width: `${shape.size}px`,
                  height: `${shape.size}px`,
                  transform: `translate(-50%, -50%) rotate(${shape.rotation}deg) scale(${scaleX}, ${scaleY})`,
                  borderRadius: `${r1}% ${r2}% ${r3}% ${r4}%`,
                  transition: 'none',
                  animationDelay: `${index * 1.5}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Animated Lines */}
      <div className="animated-lines">
        <div className="line line-1" />
        <div className="line line-2" />
        <div className="line line-3" />
        <div className="line line-4" />
      </div>
    </div>
  );
};
