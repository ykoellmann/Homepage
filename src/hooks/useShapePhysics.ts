import { useState, useEffect, useRef } from 'react';

export interface Shape {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  deformX: number;
  deformY: number;
  squash: number;
}

const INITIAL_SHAPES: Shape[] = [
  { id: 1, x: 8, y: 8, vx: 0.0375, vy: 0.03, size: 120, rotation: 0, deformX: 0, deformY: 0, squash: 0 },
  { id: 2, x: 88, y: 25, vx: -0.03, vy: 0.045, size: 80, rotation: 45, deformX: 0, deformY: 0, squash: 0 },
  { id: 3, x: 15, y: 45, vx: 0.045, vy: -0.0375, size: 100, rotation: 90, deformX: 0, deformY: 0, squash: 0 },
  { id: 4, x: 80, y: 65, vx: -0.025, vy: 0.025, size: 60, rotation: 135, deformX: 0, deformY: 0, squash: 0 },
  { id: 5, x: 92, y: 85, vx: 0.035, vy: -0.04, size: 90, rotation: 180, deformX: 0, deformY: 0, squash: 0 },
  { id: 6, x: 25, y: 35, vx: -0.04, vy: 0.035, size: 70, rotation: 225, deformX: 0, deformY: 0, squash: 0 },
  { id: 7, x: 5, y: 70, vx: 0.0325, vy: -0.0325, size: 110, rotation: 270, deformX: 0, deformY: 0, squash: 0 },
  { id: 8, x: 70, y: 55, vx: -0.0275, vy: -0.03, size: 75, rotation: 315, deformX: 0, deformY: 0, squash: 0 },
  { id: 9, x: 45, y: 15, vx: 0.035, vy: 0.04, size: 95, rotation: 22, deformX: 0, deformY: 0, squash: 0 },
  { id: 10, x: 60, y: 78, vx: -0.038, vy: -0.032, size: 85, rotation: 160, deformX: 0, deformY: 0, squash: 0 },
  { id: 11, x: 35, y: 90, vx: 0.042, vy: -0.035, size: 65, rotation: 280, deformX: 0, deformY: 0, squash: 0 },
];

interface UseShapePhysicsOptions {
  enabled: boolean;
  mousePosition: { x: number; y: number };
}

export const useShapePhysics = ({ enabled, mousePosition }: UseShapePhysicsOptions) => {
  const [shapes, setShapes] = useState<Shape[]>(INITIAL_SHAPES);
  const mousePositionRef = useRef(mousePosition);

  // Update mouse position ref
  useEffect(() => {
    mousePositionRef.current = mousePosition;
  }, [mousePosition]);

  // Physics simulation
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setShapes(prevShapes => {
        return prevShapes.map(shape => {
          let newX = shape.x + shape.vx;
          let newY = shape.y + shape.vy;
          let newVx = shape.vx;
          let newVy = shape.vy;
          let newRotation = shape.rotation + 0.5;
          let newSquash = shape.squash;
          let newDeformX = shape.deformX;
          let newDeformY = shape.deformY;

          // Track if we hit a wall
          let hitWall = false;
          let wallDirection = { x: 0, y: 0 };

          // Bounce off edges with squash effect
          if (newX <= 2 || newX >= 98) {
            newVx = -newVx;
            newX = newX <= 2 ? 2 : 98;
            hitWall = true;
            wallDirection.x = newX <= 2 ? 1 : -1;
            // Squash in X direction on horizontal wall impact
            newSquash = Math.min(1, Math.abs(shape.vx) * 3);
            newDeformX = wallDirection.x * 0.5;
          }
          if (newY <= 2 || newY >= 98) {
            newVy = -newVy;
            newY = newY <= 2 ? 2 : 98;
            hitWall = true;
            wallDirection.y = newY <= 2 ? 1 : -1;
            // Squash in Y direction on vertical wall impact
            newSquash = Math.max(newSquash, Math.abs(shape.vy) * 3);
            newDeformY = wallDirection.y * 0.5;
          }

          // Mouse repulsion with deformation
          const mousePos = mousePositionRef.current;
          const shapeScreenX = (shape.x / 100) * window.innerWidth;
          const shapeScreenY = (shape.y / 100) * window.innerHeight;
          const dx = shapeScreenX - mousePos.x;
          const dy = shapeScreenY - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repulsionRadius = 200;

          if (distance < repulsionRadius && distance > 0) {
            const force = ((repulsionRadius - distance) / repulsionRadius) * 4;
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * force;
            const pushY = Math.sin(angle) * force;

            // Convert screen space push to percentage space
            newVx += (pushX / window.innerWidth) * 100;
            newVy += (pushY / window.innerHeight) * 100;

            // Deform away from mouse
            const deformStrength = ((repulsionRadius - distance) / repulsionRadius) * 0.8;
            newDeformX += Math.cos(angle) * deformStrength;
            newDeformY += Math.sin(angle) * deformStrength;
          }

          // Apply damping
          newVx *= 0.9925;
          newVy *= 0.9925;

          // Limit speed
          const speed = Math.sqrt(newVx * newVx + newVy * newVy);
          const maxSpeed = 0.6;
          if (speed > maxSpeed) {
            newVx = (newVx / speed) * maxSpeed;
            newVy = (newVy / speed) * maxSpeed;
          }

          // Maintain minimum speed
          const minSpeed = 0.02;
          if (speed < minSpeed && speed > 0) {
            newVx = (newVx / speed) * minSpeed;
            newVy = (newVy / speed) * minSpeed;
          }

          // Motion-based deformation (stretch in direction of movement)
          if (!hitWall) {
            const velocityMagnitude = Math.sqrt(newVx * newVx + newVy * newVy);
            const stretchFactor = Math.min(velocityMagnitude * 2, 0.5);

            // Normalize velocity for direction
            if (velocityMagnitude > 0.01) {
              const dirX = newVx / velocityMagnitude;
              const dirY = newVy / velocityMagnitude;

              // Add stretch in movement direction
              newDeformX += dirX * stretchFactor * 0.3;
              newDeformY += dirY * stretchFactor * 0.3;
            }
          }

          // Gradually return to original shape (elastic recovery)
          newSquash *= 0.85;
          newDeformX *= 0.90;
          newDeformY *= 0.90;

          // Clamp deformation values
          newDeformX = Math.max(-1, Math.min(1, newDeformX));
          newDeformY = Math.max(-1, Math.min(1, newDeformY));
          newSquash = Math.max(0, Math.min(1, newSquash));

          return {
            ...shape,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
            deformX: newDeformX,
            deformY: newDeformY,
            squash: newSquash
          };
        });
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [enabled]);

  return shapes;
};
