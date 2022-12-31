uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;
varying vec2 vUv;

#pragma glslify: perlinFunction = require(../../perlin/perlin.glsl)

void main() {
    // Displace the UV
    vec2 displacedUv = vUv + perlinFunction(vec3(vUv * 5.0, uTime * 0.3));

    // Perlin noise
    float strength = perlinFunction(vec3(displacedUv * 5.0, uTime * 0.2));

    // OuterGlow
    float outerGlow = distance(vUv, vec2(0.5)) * 5.0 - 1.4;
    strength += outerGlow;

    strength += step(-0.2, strength) * 0.8;

    // Clamp the Values
    strength = clamp(strength, 0.0, 1.0);

    // Final Color
    vec3 color = mix(uColorStart, uColorEnd, strength);

    gl_FragColor = vec4(color, 1.0);
}
