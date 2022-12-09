//precision mediump float;// highp can have performance hit and might not work on some devices
// lowp can create bugs by the lack of precision
// we usually use mediump
uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main(){
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 2.0 + 0.5;
  // already exists
  // we need to assign it
  // will contain the color of the fragment
  gl_FragColor = textureColor;
}
