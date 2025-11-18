import React from 'react';

export const CinematicDivider: React.FC = () => (
  <div className="cinematic-divider">
    <div className="divider-depth-layer depth-1" />
    <div className="divider-depth-layer depth-2" />
    <div className="divider-depth-layer depth-3" />
    <div className="divider-depth-layer depth-4" />
    <div className="divider-depth-layer depth-5" />
    <div className="cinematic-glow-top" />
    <div className="cinematic-glow-bottom" />
    <div className="cinematic-glow-center" />
  </div>
);
