uniform sampler2D normalMap1;
uniform sampler2D normalMap2;
varying vec2 vUv;

void main(void)
{
  vec3 n1 = texture2D(normalMap1,vUv).xyz * 2.0 -1.0;
  vec3 n2 = texture2D(normalMap2,vUv).xyz *2.0 -1.0;
  vec3 r = normalize(vec3(n1.xy + n2.xy, n1.z));
  gl_FragColor = vec4(r*0.5 + 0.5, 1.0) ;
}
