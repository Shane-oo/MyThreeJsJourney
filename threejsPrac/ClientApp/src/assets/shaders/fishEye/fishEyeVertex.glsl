
uniform float strength;
uniform float height;
uniform float aspectRatio;
uniform float cylindricalRatio;


varying vec3 vUV;
varying vec2 vUVDot;

void main() {
    gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));

    float scaledHeight = strength * height;
    float cylAspectRatio = aspectRatio * cylindricalRatio;
    float aspectDiagSq = aspectRatio * aspectRatio + 1.0;
    float diagSq = scaledHeight * scaledHeight * aspectDiagSq;
    vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));

    float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;
    float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);

    vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;
    vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);
    vUV.xy += uv;
}
