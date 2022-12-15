import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//@ts-ignore
import modifiedVertexShader from '../../assets/shaders/modifiedMaterials/vertex.glsl';
//@ts-ignore
import depthMaterialVertexShader from '../../assets/shaders/modifiedMaterials/depthMaterialVertex.glsl';
//@ts-ignore
import modifiedCommon from '../../assets/shaders/modifiedMaterials/modifiedCommon.glsl';
//@ts-ignore
import modifiedNormalVertex from '../../assets/shaders/modifiedMaterials/modifiedNormalVertex.glsl';
import * as lilGui from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
             selector: 'app-lesson-thirty-one',
             templateUrl: './lesson-thirty-one.component.html',
             styleUrls: ['./lesson-thirty-one.component.css']
           })
export class LessonThirtyOneComponent implements OnInit, AfterViewInit {
  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();
  private width = window.innerWidth;

  //test mesh
  private height = window.innerHeight;
  // Get Canvas
  @ViewChild('canvas')
  private canvasRef!: ElementRef;
  private camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
  private controls!: OrbitControls;

  // Initialise global variables
  // Initialise camera variables
  // Initialise renderer
  private renderer!: THREE.WebGLRenderer;
  // Initialise scene
  private scene!: THREE.Scene;

  //Initialise object variables
  private oldElapsedTime = 0;

  // textures
  private textureLoader = new THREE.TextureLoader();
  private gltfLoader = new GLTFLoader();
  private cubeTextureLoader = new THREE.CubeTextureLoader;

  // Environment Map
  private environmentMap = this.cubeTextureLoader.load([
                                                         '../../assets/images/environmentMaps/0/px.jpg',
                                                         '../../assets/images/environmentMaps/0/nx.jpg',
                                                         '../../assets/images/environmentMaps/0/py.jpg',
                                                         '../../assets/images/environmentMaps/0/ny.jpg',
                                                         '../../assets/images/environmentMaps/0/pz.jpg',
                                                         '../../assets/images/environmentMaps/0/nz.jpg'
                                                       ]);

  // geometry
  private geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);

  // material
  // Textures
  private mapTexture = this.textureLoader.load('../../assets/models/LeePerrySmith/color.jpg');
  private normalTexture = this.textureLoader.load('../../assets/models/LeePerrySmith/normal.jpg');

  private material = new THREE.MeshStandardMaterial({
                                                      map: this.mapTexture,
                                                      normalMap: this.normalTexture
                                                    });

  private depthMaterial = new THREE.MeshDepthMaterial({
                                                        depthPacking: THREE.RGBADepthPacking
                                                      });

  // Lights
  private directionalLight = new THREE.DirectionalLight('#ffffff', 3);

  // Plane
  private plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(15, 15, 15),
    new THREE.MeshStandardMaterial()
  );
  // gui
  private gui = new lilGui.GUI({width: 200});
  private customUniforms = {
    uTime: {value: 0}
  };

  constructor() {

  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Window) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    // Update Camera
    this.camera.aspect = this.width / this.height;
    // Alert Camera needs to update projection Matrix
    this.camera.updateProjectionMatrix();
    // Update render
    this.renderer.setSize(this.width, this.height);
    // Incase pixel ratio changes when moving screens
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


  }

  @HostListener('dblclick', ['$event'])
  onDblClick(event: MouseEvent) {
    if(!document.fullscreenElement) {
      this.canvas.requestFullscreen().then(r => {
        console.log('fullscreen');
      });
    } else {
      document.exitFullscreen().then(r => {
        console.log('exit fullscreen');
      });
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    // call needed functions
    this.createScene();
    this.startRenderingLoop();
  }

  // Update All Materials
  private updateAllMaterials = () => {
    this.scene.traverse((child) => {
      if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMapIntensity = 1;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  };

  /*
   * Loading Manager Functions
  */
  private setLoadingManager() {
  }

  private LoadModels() {
    this.gltfLoader.load('../../assets/models/LeePerrySmith/LeePerrySmith.glb',
                         (gltf) => {
                           //Model
                           const mesh = gltf.scene.children[0] as THREE.Mesh;
                           mesh.rotation.y = Math.PI * 0.5;
                           mesh.material = this.material;
                           mesh.customDepthMaterial = this.depthMaterial;
                           this.scene.add(mesh);

                           this.updateAllMaterials();
                         });
  }

  /*
   * Set Geometry Attribute on geometry
   */
  private setGeometryAttributes() {
    // Set Geometry attribute

  }

  /*
  * modify the objects
  *
  */
  private modifyObjects() {

    this.plane.rotation.y = Math.PI;
    this.plane.position.y = -5;
    this.plane.position.z = 5;

    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.normalBias = 0.05;
    this.directionalLight.position.set(0.25, 2, -2.25);

    this.material.onBeforeCompile = (shader) => {

      shader.uniforms.uTime = this.customUniforms.uTime;

      shader.vertexShader = shader.vertexShader.replace('#include <common>',
                                                        modifiedCommon);

      shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>',
                                                        modifiedNormalVertex);

      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
                                                        modifiedVertexShader);
    };


    this.depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.customUniforms.uTime;
      shader.vertexShader = shader.vertexShader.replace('#include <common>',
                                                        modifiedCommon);
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
                                                        depthMaterialVertexShader);
    };
  }

  private modifyPhysics() {

  }

  /*
 * modify the scene
 *
 */
  private modifyScene() {
    this.scene = new THREE.Scene();
    this.environmentMap.encoding = THREE.sRGBEncoding;
    this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;

    this.mapTexture.encoding = THREE.sRGBEncoding;
  }

  /*
 * modify the camera
 *
 */
  private modifyCamera() {
    this.camera.position.set(24, 0, 1);

  }

  /*
   * Add Controls
  */
  private modifyControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    //controls.target.y = 2;
    this.controls.enableDamping = true;
  }

  /*
     * Add Debug Tweaks
     *
    */
  private modifyDebugGUI() {


  }

  /*
  * Create the scene
  *
  */
  private createScene() {
    // Loading Manager
    this.setLoadingManager();

    // Geometry
    this.setGeometryAttributes();
    // Objects
    this.modifyObjects();
    // Scene
    this.modifyScene();
    //Physics
    this.modifyPhysics();
    // Camera
    this.modifyCamera();
    // Models
    this.LoadModels();
    //Add Objects to the scene

    this.scene.add(this.camera);
    this.scene.add(this.directionalLight);
    this.scene.add(this.plane);
    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();


  }

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;
    // Update Material
    this.customUniforms.uTime.value = elapsedTime;

    // Update Camera


    // Update Controls
    this.controls.update();
    // Update physics world


  }

  /*
  * Start The Renderer
  *
  */
  private startRenderingLoop() {
    // Renderer
    // use canvas element in template

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setSize(this.width, this.height);
    // Activate shadow map
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    // Must change component
    let component: LessonThirtyOneComponent = this;
    (function render() {
      //console.log('tick');
      requestAnimationFrame(render);
      // Call animation Functions
      component.animateObjects();

      // render renderer
      component.renderer.render(component.scene, component.camera);
    }());
  }

}
