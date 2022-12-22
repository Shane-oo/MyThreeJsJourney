import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as lilGui from 'lil-gui';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
//@ts-ignore
import tintVertexShader from '../../assets/shaders/tint/vertex.glsl';
//@ts-ignore
import tintFragmentShader from '../../assets/shaders/tint/fragment.glsl';
//@ts-ignore
import displacementVertex from '../../assets/shaders/displacementPass/vertex.glsl';
//@ts-ignore
import displacementFragment from '../../assets/shaders/displacementPass/fragment.glsl';

@Component({
             selector: 'app-lesson-thirty-two',
             templateUrl: './lesson-thirty-two.component.html',
             styleUrls: ['./lesson-thirty-two.component.css']
           })
export class LessonThirtyTwoComponent implements OnInit, AfterViewInit {
  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();
  private width = window.innerWidth;
  private height = window.innerHeight;

  private pixelRatio: number = 0;
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

  // material
  // Textures


  // Lights
  private directionalLight = new THREE.DirectionalLight('#ffffff', 3);


  // gui
  private gui = new lilGui.GUI({width: 200});
  private customUniforms = {
    uTime: {value: 0}
  };

  // Post Processing

  // Render Target
  // @ts-ignore
  private renderTarget = new THREE.WebGLRenderTarget(800, 600, {samples: this.pixelRatio === 1 ? 2 : 0});

  private effectComposer!: EffectComposer;
  private renderPass!: RenderPass;
  private gammaCorrectionPass: ShaderPass = new ShaderPass(GammaCorrectionShader);
  private dotScreenPass: DotScreenPass = new DotScreenPass();
  private glitchPass: GlitchPass = new GlitchPass();
  private rbgShiftPass: ShaderPass = new ShaderPass(RGBShiftShader);
  private unrealBloomPass: UnrealBloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 1, 0.6);

  private TintShader = {
    uniforms: {
      tDiffuse: {value: null},
      uTint: {value: new THREE.Vector3()}
    },
    vertexShader: tintVertexShader,
    fragmentShader: tintFragmentShader
  };


  private tintPass = new ShaderPass(this.TintShader);

  private DisplacementShader = {
    uniforms: {
      tDiffuse: {value: null},
      uNormalMap: {value: null},
      uTime: {value: 0}
    },
    vertexShader: displacementVertex,
    fragmentShader: displacementFragment
  };
  private displacementPass = new ShaderPass(this.DisplacementShader);

  private deltaTime: number = 0;

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

    // Update Effect Composer
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.effectComposer.setSize(this.width, this.height);

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
        child.material.envMapIntensity = 2.5;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  };

  private setEffectComposer() {


    this.effectComposer = new EffectComposer(this.renderer, this.renderTarget);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.effectComposer.setSize(this.width, this.height);

    this.renderPass = new RenderPass(this.scene, this.camera);

    this.effectComposer.addPass(this.renderPass);

    this.dotScreenPass.enabled = false;
    this.effectComposer.addPass(this.dotScreenPass);

    this.glitchPass.enabled = false;
    this.glitchPass.goWild = false;
    this.effectComposer.addPass(this.glitchPass);

    this.rbgShiftPass.enabled = false;
    this.effectComposer.addPass(this.rbgShiftPass);

    this.unrealBloomPass.enabled = false;
    this.effectComposer.addPass(this.unrealBloomPass);

    this.tintPass.enabled = true;
    this.effectComposer.addPass(this.tintPass);

    this.displacementPass.enabled = true;
    this.displacementPass.material.uniforms.uNormalMap.value = this.textureLoader.load(
      '../../assets/images/postProcessing/interfaceNormalMap.png');
    this.effectComposer.addPass(this.displacementPass);

    // make sure to go the gammaCorrectionPass last
    this.effectComposer.addPass(this.gammaCorrectionPass);
    console.log(this.pixelRatio);
    // I dont think I do antialias right
    if(this.pixelRatio === 1 && !this.renderer.capabilities.isWebGL2) {
      this.effectComposer.addPass(new SMAAPass(this.width, this.height));
    }

 //   this.displacementPass.renderToScreen = true;
  }

  /*
   * Loading Manager Functions
  */
  private setLoadingManager() {
  }

  private LoadModels() {
    this.gltfLoader.load('../../assets/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
                         (gltf) => {
                           //Model
                           gltf.scene.scale.set(2, 2, 2);
                           gltf.scene.rotation.y = Math.PI * 0.5;
                           this.scene.add(gltf.scene);

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


    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.normalBias = 0.05;
    this.directionalLight.position.set(0.25, 3, -2.25);


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

  }

  /*
 * modify the camera
 *
 */
  private modifyCamera() {
    this.camera.position.set(4, 1, -4);

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
    /*     this.gui.add(this.unrealBloomPass,'enabled');
         this.gui.add(this.unrealBloomPass,'strength').min(0).max(2).step(0.001);
        this.gui.add(this.unrealBloomPass,'radius').min(0).max(2).step(0.001);
        this.gui.add(this.unrealBloomPass,'threshold').min(0).max(1).step(0.001);
        this.gui.add(this.unrealBloomPass.resolution,'x').min(0).max(1000).step(1);
        this.gui.add(this.unrealBloomPass.resolution,'y').min(0).max(1000).step(1);*/


    this.gui.add(this.tintPass.material.uniforms.uTint.value, 'x').min(-1).max(1).step(0.001).name('red');
    this.gui.add(this.tintPass.material.uniforms.uTint.value, 'y').min(-1).max(1).step(0.001).name('green');
    this.gui.add(this.tintPass.material.uniforms.uTint.value, 'z').min(-1).max(1).step(0.001).name('blue');
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

    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();


  }

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    this.deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;
    // Update Passes
    this.displacementPass.material.uniforms.uTime.value = elapsedTime;

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

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.pixelRatio = this.renderer.getPixelRatio();

    this.renderer.setSize(this.width, this.height);
    // Activate shadow map
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    // Must change component
    let component: LessonThirtyTwoComponent = this;


    // Post Processing
    this.setEffectComposer();

    (function render() {
      //console.log('tick');

      requestAnimationFrame(render);

      // Call animation Functions
      component.animateObjects();

      // render renderer

      //  component.renderer.render(component.scene,component.camera);
      component.effectComposer.render();

    }());
  }

}
