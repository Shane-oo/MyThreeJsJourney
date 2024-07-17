import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as lilGui from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
//@ts-ignore
import distortionVertex from '../../assets/shaders/fishEye/fishEyeVertex.glsl';
//@ts-ignore
import distortionFragment from '../../assets/shaders/fishEye/fishEyeFragment.glsl';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

@Component({
             selector: 'app-practise',
             templateUrl: './practise.component.html',
             styleUrls: ['./practise.component.css']
           })
export class PractiseComponent implements OnInit, AfterViewInit {
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
  private camera = new THREE.PerspectiveCamera(100, this.width / this.height, 0.1, 100);
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


  // material
  // Textures


  // Lights
  private hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  private directionalLight = new THREE.DirectionalLight('#ffffff', 3);

  // gui
  private gui = new lilGui.GUI({width: 200});


  // effect Uniforms
  private customUniforms = {
    tDiffuse: {value: null},
    strength: {value: 0},
    height: {value: 1},
    aspectRatio: {value: 1},
    cylindricalRatio: {value: 1}
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
    this.gltfLoader.load('../../assets/models/houseModels/testingModelDoNotPublish.gltf',
                         (gltf) => {
                           //Model
                           // const mesh = gltf.scene.children as THREE.Mesh;

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


    this.hemiLight.color.setHSL(0.6, 1, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 50, 0);

    this.directionalLight.position.set(-1.28, 1.4, 1);
  }

  private modifyPhysics() {

  }

  /*
 * modify the scene
 *
 */
  private modifyScene() {
    this.scene = new THREE.Scene();
  }

  /*
 * modify the camera
 *
 */
  private modifyCamera() {
    this.camera.position.set(3.220455254532799, 2.7790831118327652, 0.07456144498879909);

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
    this.gui.add(this.camera, 'fov')
        .min(30)
        .max(100)
        .step(1).onChange(() => {
      this.camera.updateProjectionMatrix();
    });



  }
  private effectComposer!:EffectComposer;
  private renderPass!:RenderPass;

  private DistortionShader = {
    uniforms: {
      tDiffuse: {value: null},
      strength: {value: 0},
      height: {value: 1},
      aspectRatio: {value:1},
      cylindricalRatio: {value:1}
    },
    vertexShader: distortionVertex,
    fragmentShader: distortionFragment
  };
  private distortionPass = new ShaderPass(this.DistortionShader);


  private setEffectComposer() {


    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.effectComposer.setSize(this.width, this.height);

    this.renderPass = new RenderPass(this.scene, this.camera);

    this.effectComposer.addPass(this.renderPass);

    // Setup distortion effect;

    let horizontalFov = this.camera.fov;
    let strength = 0.5;
    let cylindricalRatio = 2;
    let height = Math.tan(THREE.MathUtils.degToRad(horizontalFov) / 2) / this.camera.aspect;

    this.camera.fov = Math.atan(height) * 2 * 180 / 3.142;
    this.camera.updateProjectionMatrix();

    this.distortionPass.material.uniforms.strength.value = strength;
    this.distortionPass.material.uniforms.height.value = height;
    this.distortionPass.material.uniforms.aspectRatio.value = this.camera.aspect;
    this.distortionPass.material.uniforms.cylindricalRatio.value = cylindricalRatio;


    this.effectComposer.addPass(this.distortionPass);
    this.distortionPass.renderToScreen = true;



    //this.dotScreenPass.enabled = false;
   // this.effectComposer.addPass(this.dotScreenPass);
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
    this.scene.add(this.hemiLight);
    this.scene.add(this.directionalLight);
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


    // Update Camera


    // Update Controls
    this.controls.update();
    // Update physics world

    //console.log(this.camera.position)
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
    //this.renderer.physicallyCorrectLights = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    // Must change component
    let component: PractiseComponent = this;

    // Post Processing
    this.setEffectComposer();

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
