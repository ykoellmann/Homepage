// @ts-nocheck
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// Import shaders as strings
import vertexShader from '../../../shaders/glass.vert.glsl?raw';
import fragmentShader from '../../../shaders/glass.frag.glsl?raw';

export interface RefractionMaterialProps {
  sceneTexture: THREE.Texture;
  resolution: THREE.Vector2;
  ior?: number;
  chromaticAberration?: number;
  reflectivity?: number;
  thickness?: number;
  tint?: THREE.Color;
  time?: number;
}

export const RefractionMaterial = shaderMaterial(
  {
    // Custom uniforms
    uSceneTexture: new THREE.Texture(),
    uResolution: new THREE.Vector2(1, 1),
    uIOR: 1.5,
    uChromaticAberration: 0.02,
    uReflectivity: 3.0,
    uThickness: 0.1,
    uTint: new THREE.Color(1, 1, 1),
    uTime: 0,

    // Three.js standard uniforms to prevent errors
    diffuse: new THREE.Color(0xffffff),
    opacity: 1.0,
    map: null,
    alphaMap: null,
    uvTransform: new THREE.Matrix3(),
  },
  vertexShader,
  fragmentShader
);

extend({ RefractionMaterial });

// TypeScript Module Augmentation
declare global {
  namespace JSX {
    interface IntrinsicElements {
      refractionMaterial: any;
    }
  }
}
