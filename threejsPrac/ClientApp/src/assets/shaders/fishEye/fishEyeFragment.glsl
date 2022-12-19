uniform sampler2D tDiffuse;
varying vec3 vUV;
varying vec2 vUVDot;

void main() {
    vec3 uv = dot(vUVDot, vUVDot) * vec3(-0.5, -0.5, -1.0) + vUV;
    gl_FragColor = texture2DProj(tDiffuse, uv);
}
