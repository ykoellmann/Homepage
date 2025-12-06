import { useEffect, useRef, useState } from 'react';

export interface GlassEffectConfig {
  ior?: number;
  chromaticAberration?: number;
  reflectivity?: number;
  thickness?: number;
  tint?: string;
  animateOnHover?: boolean;
}

export const useGlassEffect = (config: GlassEffectConfig = {}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [bounds, setBounds] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const updateBounds = () => {
      setBounds(elementRef.current?.getBoundingClientRect() || null);
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);

    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const handleMouseEnter = () => {
    if (config.animateOnHover) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (config.animateOnHover) {
      setIsHovered(false);
    }
  };

  return {
    elementRef,
    isHovered,
    bounds,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    config: {
      ior: config.ior ?? 1.5,
      chromaticAberration: config.chromaticAberration ?? 0.02,
      reflectivity: config.reflectivity ?? 3.0,
      thickness: isHovered ? (config.thickness ?? 0.1) * 1.2 : (config.thickness ?? 0.1),
      tint: config.tint ?? '#ffffff',
    },
  };
};
