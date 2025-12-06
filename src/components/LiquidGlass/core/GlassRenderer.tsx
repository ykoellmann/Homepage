// @ts-nocheck
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
// Import and register the material
import '../materials/RefractionMaterial';

interface GlassRendererProps {
  children: React.ReactNode;
  ior?: number;
  chromaticAberration?: number;
  reflectivity?: number;
  thickness?: number;
  tint?: string;
}

export const GlassRenderer: React.FC<GlassRendererProps> = ({
  children,
  ior = 1.5,
  chromaticAberration = 0.02,
  reflectivity = 3.0,
  thickness = 0.1,
  tint = '#ffffff',
}) => {
  const { gl, scene, camera, size } = useThree();

  // Frame Buffer Object for Background Capture
  const fbo = useMemo(() => {
    return new THREE.WebGLRenderTarget(
      size.width * Math.min(window.devicePixelRatio, 2),
      size.height * Math.min(window.devicePixelRatio, 2),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );
  }, [size]);

  const materialRef = useRef<any>();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      fbo.dispose();
    };
  }, [fbo]);

  useFrame((state) => {
    if (!materialRef.current) return;

    // Check if material is properly initialized
    const material = materialRef.current.material;
    if (!material || !material.uniforms) return;

    try {
      // 1. Render Scene without Glass-Object to FBO
      materialRef.current.visible = false;
      gl.setRenderTarget(fbo);
      gl.render(scene, camera);
      gl.setRenderTarget(null);
      materialRef.current.visible = true;

      // 2. Update Material Uniforms
      const uniforms = material.uniforms;

      // Safely update uniforms only if they exist
      if (uniforms.uSceneTexture) {
        uniforms.uSceneTexture.value = fbo.texture;
      }

      if (uniforms.uResolution && uniforms.uResolution.value) {
        uniforms.uResolution.value.set(size.width, size.height);
      }

      if (uniforms.uTime) {
        uniforms.uTime.value = state.clock.elapsedTime;
      }
    } catch (error) {
      // Silently fail to prevent crashes
      console.warn('GlassRenderer: Failed to update uniforms', error);
    }
  });

  return (
    <mesh ref={materialRef}>
      {children}
      <refractionMaterial
        uIOR={ior}
        uChromaticAberration={chromaticAberration}
        uReflectivity={reflectivity}
        uThickness={thickness}
        uTint={new THREE.Color(tint)}
      />
    </mesh>
  );
};
