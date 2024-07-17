import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as lilGui from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import firefliesVertex from '../../../assets/shaders/portalScene/fireflies/vertex.glsl';
// @ts-ignore
import firefliesFragment from '../../../assets/shaders/portalScene/fireflies/fragment.glsl';
// @ts-ignore
import portalVertex from '../../../assets/shaders/portalScene/portal/vertex.glsl';
// @ts-ignore
import portalFragment from '../../../assets/shaders/portalScene/portal/fragment.glsl';

@Component({
             selector: 'app-lesson-thirty-eight',
             templateUrl: './lesson-thirty-eight.component.html',
             styleUrls: ['./lesson-thirty-eight.component.css']
           })
export class LessonThirtyEightComponent implements OnInit, AfterViewInit {
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
  private camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
  private controls!: OrbitControls;

  // Stats
  private stats: Stats = new Stats();

  // Initialise renderer
  private renderer!: THREE.WebGLRenderer;


  // Initialise scene
  private scene!: THREE.Scene;

  //Initialise object variables
  private oldElapsedTime = 0;
  private deltaTime: number = 0;


  // Lights

  // gui
  private gui = new lilGui.GUI({width: 200});
  private debugObject = {
    clearColor: '#414135',
    portalColorStart: '#000019',
    portalColorEnd: '#63dbfd'
  };

  // Texture
  private textureLoader = new THREE.TextureLoader();
  // Draco Loader
  private dracoLoader = new DRACOLoader();

  // GLTF Loader
  private gltfLoader = new GLTFLoader();


  // Textures
  private bakedTexture = this.textureLoader.load('/assets/models/portal/baked.jpg');
  // Baked Material
  private bakedMaterial = new THREE.MeshBasicMaterial({map: this.bakedTexture});
  // Pole Light Material
  private poleLightMaterial = new THREE.MeshBasicMaterial({color: 0xffffbd});
  // Portal Light Material
  private portalLightMaterial = new THREE.ShaderMaterial({
                                                           uniforms: {
                                                             uTime: {value: 0},
                                                             uColorStart: {value: new THREE.Color(this.debugObject.portalColorStart)},
                                                             uColorEnd: {value: new THREE.Color(this.debugObject.portalColorEnd)}
                                                           },
                                                           vertexShader: portalVertex,
                                                           fragmentShader: portalFragment,
                                                           side: THREE.DoubleSide
                                                         });


  // Fireflies
  // Geometry
  private fireFliesGeometry = new THREE.BufferGeometry();
  private fireFliesCount = 30;
  private fireFliesPositionArray = new Float32Array(this.fireFliesCount * 3);
  private scaleArray = new Float32Array(this.fireFliesCount);

  // Material
  private fireFliesMaterial = new THREE.ShaderMaterial({
                                                         depthWrite: false,
                                                         blending: THREE.AdditiveBlending,
                                                         transparent: true,
                                                         uniforms: {
                                                           uTime: {value: 0},
                                                           uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
                                                           uSize: {value: 100}
                                                         },
                                                         vertexShader: firefliesVertex,
                                                         fragmentShader: firefliesFragment
                                                       });
  // Points
  private fireFlies = new THREE.Points(this.fireFliesGeometry, this.fireFliesMaterial);


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

    this.fireFliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);

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

  ngOnDestroy() {
    //todo


    this.scene.remove(this.camera);
    this.gui.destroy();

    this.stats.dom.remove();

  }

  private setEffectComposer() {

  }

  /*
   * Loading Manager Functions
  */
  private setLoadingManager() {
    this.dracoLoader.setDecoderPath('/assets/loaders/draco/');
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  private LoadModels() {
    this.gltfLoader.load('/assets/models/portal/portal.glb',
                         (gltf) => {

                           const bakedMesh = gltf.scene.children.find(c => c.name === 'baked') as THREE.Mesh;
                           const portalLightMesh = gltf.scene.children.find(c => c.name === 'portalLight') as THREE.Mesh;
                           const poleLightAMesh = gltf.scene.children.find(c => c.name === 'poleLightA') as THREE.Mesh;
                           const poleLightBMesh = gltf.scene.children.find(c => c.name === 'poleLightB') as THREE.Mesh;


                           bakedMesh.material = this.bakedMaterial;
                           poleLightAMesh.material = this.poleLightMaterial;
                           poleLightBMesh.material = this.poleLightMaterial;
                           portalLightMesh.material = this.portalLightMaterial;

                           this.scene.add(gltf.scene);
                         });
  }


  /*
   * Set Geometry Attribute on geometry
   */
  private setGeometryAttributes() {
    // Set Geometry attribute

  }

  private modifyTextures() {
    this.bakedTexture.flipY = false;
    this.bakedTexture.colorSpace = THREE.SRGBColorSpace;
  }


  /*
  * modify the objects
  *
  */
  private modifyObjects() {
    this.createFireFlies();
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
    this.camera.position.set(1.3, 4.2, 5.4);
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
    this.gui.close();

    this.gui.addColor(this.debugObject, 'clearColor').onChange(() => {
      this.renderer.setClearColor(this.debugObject.clearColor);
    });
    this.gui.add(this.fireFliesMaterial.uniforms.uSize, 'value')
        .min(0)
        .max(500)
        .step(1)
        .name('firefliesSize');
    this.gui.addColor(this.debugObject, 'portalColorStart').onChange(() => {
      this.portalLightMaterial.uniforms.uColorStart.value.set(this.debugObject.portalColorStart);
    });
    this.gui.addColor(this.debugObject, 'portalColorEnd').onChange(() => {
      this.portalLightMaterial.uniforms.uColorEnd.value.set(this.debugObject.portalColorEnd);
    });
  }

  private createStats() {
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }


  /*
  * Create the scene
  *
  */
  private createScene() {
    this.modifyTextures();
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

    this.createStats();

    //Add Objects to the scene

    this.scene.add(this.camera);

    this.scene.add(this.fireFlies);

    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();


  }

  // Keep a performant native Javascript code especially in the tick function
  private animateObjects() {
    this.stats.begin();

    // Time
    const elapsedTime = this.clock.getElapsedTime();
    this.deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;
    // Update Shaders
    this.fireFliesMaterial.uniforms.uTime.value = elapsedTime;
    this.portalLightMaterial.uniforms.uTime.value = elapsedTime;

    // Update Camera


    // Update Controls
    this.controls.update();
    // Update physics world

    //this.cameraHelper.update();

    this.stats.end();


  }


  /*
  * Start The Renderer
  *
  */
  private startRenderingLoop() {
    // Renderer
    // use canvas element in template

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true, powerPreference: 'high-performance'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.pixelRatio = this.renderer.getPixelRatio();

    this.renderer.setSize(this.width, this.height);
    // Activate shadow map
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Output Encoding
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Optimise Renderer shadow map
    // Only update the shadow once i.e. a non moving sun
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;


    //Clear Color
    this.renderer.setClearColor(this.debugObject.clearColor);

    // Must change component
    let component: LessonThirtyEightComponent = this;
    //console.log(this.renderer.info)


    // Post Processing
    this.setEffectComposer();

    (function render() {
      //console.log('tick');

      requestAnimationFrame(render);

      // Call animation Functions
      component.animateObjects();

      // render renderer

      component.renderer.render(component.scene, component.camera);
      //component.effectComposer.render();

    }());
  }

  private createFireFlies() {
    for(let i = 0; i < this.fireFliesCount; i++) {
      this.fireFliesPositionArray[i * 3] = (Math.random() - 0.5) * 4;
      this.fireFliesPositionArray[i * 3 + 1] = Math.random() * 1.5;
      this.fireFliesPositionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

      this.scaleArray[i] = Math.random();
    }
    this.fireFliesGeometry.setAttribute('position', new THREE.BufferAttribute(this.fireFliesPositionArray, 3));
    this.fireFliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(this.scaleArray, 1));
  }

}
