//uniform mat4 projectionMatrix;// transform the coordinates into the clip space coordinates
//uniform mat4 viewMatrix;// apply transofrmations relative to the camera (position, rotation,fov,near,far)
//uniform mat4 modelMatrix;// apply transofrimations relative to the Mesh (position, rotation,scale)
// uniform mat4 modelViewMatrix // shorter version where viewMatrix and modelMatrix are combined
uniform vec2 uFrequency;
uniform float uTime;

//attribute vec3 position;
//attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

void main(){


  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;


  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  // gl_Position   (vec4)
  // already exists
  // we need to assign it
  // will contain the position of the vertex on the screen
  // each matrix will transform the position until we get the final clip space coordinates
  gl_Position = projectedPosition;

  vUv = uv;
  vElevation = elevation;
}
