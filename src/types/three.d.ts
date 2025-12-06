import { Object3DNode } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      planeGeometry: Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
      meshBasicMaterial: Object3DNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
      refractionMaterial: any;
      lensingMaterial: any;
    }
  }
}

export {};
