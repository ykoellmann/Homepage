// @ts-nocheck
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// Import shaders as strings
import vertexShader from '../../../shaders/glass.vert.glsl?raw';
import lensingFragmentShader from '../../../shaders/lensing.frag.glsl?raw';

export interface LensingMaterialProps {
  sceneTexture: THREE.Texture;
  resolution: THREE.Vector2;
  lensingStrength?: number;
  lensCenter?: THREE.Vector2;
}

export const LensingMaterial = shaderMaterial(
  {
    uSceneTexture: new THREE.Texture(),
    uResolution: new THREE.Vector2(1, 1),
    uLensingStrength: 0.3,
    uLensCenter: new THREE.Vector2(0.5, 0.5),
  },
  vertexShader,
  lensingFragmentShader
);

extend({ LensingMaterial });

// TypeScript Module Augmentation
declare global {
  namespace JSX {
    interface IntrinsicElements {
      lensingMaterial: any;
    }
  }
}
