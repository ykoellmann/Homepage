varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vEyeVector;
varying vec2 vUv;

void main() {
    vUv = uv;

    // World-space Position
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    // World-space Normal
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    // Eye Vector (Camera to Vertex)
    vEyeVector = normalize(worldPosition.xyz - cameraPosition);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
