import React from 'react';
import './GlassButton.css';

export interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  glassIntensity?: 'subtle' | 'medium' | 'intense';
  enableLensing?: boolean;
  enableBloom?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  glassIntensity = 'medium',
  enableBloom = true,
  className = '',
  style,
}) => {
  return (
    <button
      className={`glass-button glass-button-${variant} glass-button-${size} glass-intensity-${glassIntensity} ${enableBloom ? 'glass-bloom' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};
