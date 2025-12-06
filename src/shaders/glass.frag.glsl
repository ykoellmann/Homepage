uniform sampler2D uSceneTexture;
uniform vec2 uResolution;
uniform float uIOR;
uniform float uChromaticAberration;
uniform float uReflectivity;
uniform float uThickness;
uniform vec3 uTint;
uniform float uTime;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vEyeVector;
varying vec2 vUv;

// Fresnel for realistic reflections
float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
    float fresnelFactor = abs(dot(eyeVector, worldNormal));
    float inversefresnelFactor = 1.0 - fresnelFactor;
    return pow(inversefresnelFactor, power);
}

void main() {
    // Refraction Vector
    vec3 refracted = refract(vEyeVector, vWorldNormal, 1.0 / uIOR);

    // Screen Space Coordinates
    vec2 screenUv = gl_FragCoord.xy / uResolution;

    // Chromatic Aberration (RGB Split)
    vec2 refractionOffset = refracted.xy * uThickness;

    float aberration = uChromaticAberration;
    vec2 rOffset = refractionOffset * (1.0 + aberration);
    vec2 gOffset = refractionOffset;
    vec2 bOffset = refractionOffset * (1.0 - aberration);

    float r = texture2D(uSceneTexture, screenUv + rOffset).r;
    float g = texture2D(uSceneTexture, screenUv + gOffset).g;
    float b = texture2D(uSceneTexture, screenUv + bOffset).b;

    vec3 refractedColor = vec3(r, g, b);

    // Fresnel Effect
    float fresnelValue = fresnel(vEyeVector, vWorldNormal, uReflectivity);
    vec3 reflectionColor = vec3(1.0);

    // Combine Refraction + Reflection
    vec3 finalColor = mix(refractedColor, reflectionColor, fresnelValue);

    // Apply Tint
    finalColor *= uTint;

    gl_FragColor = vec4(finalColor, 1.0);
}
