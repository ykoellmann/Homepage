import React from 'react';
import './GlassCard.css';

export interface GlassCardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  elevation?: number;
  glassType?: 'frosted' | 'crystal' | 'tinted';
  className?: string;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  header,
  footer,
  elevation = 2,
  glassType = 'frosted',
  className = '',
  style,
}) => {
  return (
    <div
      className={`glass-card glass-card-elevation-${elevation} glass-card-${glassType} ${className}`}
      style={style}
    >
      {/* Card Content */}
      <div className="card-content">
        {header && <div className="card-header">{header}</div>}
        <div className="card-body">{children}</div>
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    </div>
  );
};
