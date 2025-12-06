uniform sampler2D uSceneTexture;
uniform vec2 uResolution;
uniform float uLensingStrength;
uniform vec2 uLensCenter;

varying vec2 vUv;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // Distance from lens center
    vec2 toCenter = uv - uLensCenter;
    float dist = length(toCenter);

    // Lens equation (barrel distortion)
    float lensEffect = 1.0 - smoothstep(0.0, 0.5, dist);
    float displacement = lensEffect * uLensingStrength;

    // Apply radial displacement (magnification)
    vec2 direction = normalize(toCenter);
    vec2 distortedUV = uv - (direction * displacement * 0.1);

    // Sample with distorted coordinates
    vec4 color = texture2D(uSceneTexture, distortedUV);

    gl_FragColor = color;
}
