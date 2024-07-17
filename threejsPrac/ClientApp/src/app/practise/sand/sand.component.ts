import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as lilGui from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshBasicMaterial, RepeatWrapping, SRGBColorSpace, Vector3 } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

@Component({
             selector: 'app-sand',
             templateUrl: './sand.component.html',
             styleUrls: ['./sand.component.css']
           })
export class SandComponent implements OnInit, AfterViewInit {
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
  private directionalLight = new THREE.DirectionalLight(0xffffff, 15.0);

  // gui
  private gui = new lilGui.GUI({width: 200});
  private debugObject = {};

  // Texture
  private textureLoader = new THREE.TextureLoader();
  // Textures
  private sandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_albedo.jpg');
  private normalSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_normal.jpg');
  private displacementSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_height.jpg');
  private roughnessSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_roughness.jpg');
  private aoSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_ao.jpg');

  // GLTF Loader
  private gltfLoader = new GLTFLoader();


  // Planes
  private planeGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);
  private planeMaterial1 = new THREE.MeshStandardMaterial({map: this.sandMap});
  private planeMaterial2 = new THREE.MeshStandardMaterial({
                                                            map: this.sandMap,
                                                            normalMap: this.normalSandMap
                                                          });
  private planeMaterial3 = new THREE.MeshStandardMaterial({
                                                            map: this.sandMap,
                                                            normalMap: this.normalSandMap,
                                                            displacementMap: this.displacementSandMap,
                                                            displacementScale: 0.15
                                                          });
  private planeMaterial4 = new THREE.MeshStandardMaterial({
                                                            map: this.sandMap,
                                                            normalMap: this.normalSandMap,
                                                            displacementMap: this.displacementSandMap,
                                                            displacementScale: 0.15,
                                                            roughnessMap: this.roughnessSandMap,
                                                            roughness: 1.0
                                                          });
  private planeMaterial5 = new THREE.MeshStandardMaterial({
                                                            map: this.sandMap,
                                                            normalMap: this.normalSandMap,
                                                            displacementMap: this.displacementSandMap,
                                                            displacementScale: 0.15,
                                                            roughnessMap: this.roughnessSandMap,
                                                            roughness: 1.0,
                                                            aoMap: this.aoSandMap,
                                                            aoMapIntensity: 100
                                                          });

  private plane1 = new THREE.Mesh(this.planeGeometry, this.planeMaterial1);
  private plane2 = new THREE.Mesh(this.planeGeometry, this.planeMaterial2);
  private plane3 = new THREE.Mesh(this.planeGeometry, this.planeMaterial3);
  private plane4 = new THREE.Mesh(this.planeGeometry, this.planeMaterial4);
  private plane5 = new THREE.Mesh(this.planeGeometry, this.planeMaterial5);

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

  }


  /*
   * Set Geometry Attribute on geometry
   */
  private setGeometryAttributes() {
    // Set Geometry attribute

  }

  private modifyTextures() {

  }


  /*
  * modify the objects
  *
  */
  private modifyObjects() {

    // Modify Light
    this.directionalLight.position.set(10, 20, 3);

    // add second uvs for ao map
    this.plane5.geometry.attributes.uv2 = this.plane5.geometry.attributes.uv;

    this.plane2.position.x += 3;
    this.plane3.position.x += 6;
    this.plane4.position.x += 9;
    this.plane5.position.x += 12;

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
    this.camera.position.set(1, 0, 10);
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

    this.createStats();

    //Add Objects to the scene

    this.scene.add(this.camera);
    this.scene.add(this.directionalLight);

    this.scene.add(this.plane1);
    this.scene.add(this.plane2);
    this.scene.add(this.plane3);
    this.scene.add(this.plane4);
    this.scene.add(this.plane5);
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
    this.renderer.setClearColor(new THREE.Color('grey'));

    // Must change component
    let component: SandComponent = this;
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

}
