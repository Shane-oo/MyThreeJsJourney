import * as THREE from "three";

// @ts-ignore
import twoNormalMapFragmentShader from '../../../assets/shaders/cladding/twoNormalMapFragmentShader.glsl';
// @ts-ignore
import vertexShader from '../../../assets/shaders/cladding/vertexShader.glsl';

export class CustomMeshStandardMaterial extends THREE.MeshStandardMaterial {
  constructor(normalMap1: THREE.Texture, normalMap2: THREE.Texture, parameters?: THREE.MeshStandardMaterialParameters) {
    super(parameters);
    this.onBeforeCompile = (shader) => {

      // Define the uniforms used by the custom shader
      shader.uniforms.normalMap1 = {value: normalMap1};
      shader.uniforms.normalMap2 = {value: normalMap2};

      // Custom shader
        shader.vertexShader = vertexShader;
        shader.fragmentShader = twoNormalMapFragmentShader;

/*      shader.fragmentShader.replace('#include <normal_fragment_begin>',
        [

          ''
        ].join('\n')
      );
      this.userData.shader = shader;

      console.log(shader.fragmentShader)*/

    }


  }
}
