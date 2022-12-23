import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as lilGui from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-lesson-eighteen',
  templateUrl: './lesson-eighteen.component.html',
  styleUrls: ['./lesson-eighteen.component.css']
})
export class LessonEighteenComponent implements OnInit, AfterViewInit {


  // Debug variables
  private gui = new lilGui.GUI();
  // Loading Manager
  private loadingManager = new THREE.LoadingManager();
  // Textures
  private textureLoader = new THREE.TextureLoader(this.loadingManager);
  private particleTexture = this.textureLoader.load('../../assets/images/particles/2.png');
//../../assets/images/bakedShadows/bakedShadow.jpg
  private width = window.innerWidth;
  private height = window.innerHeight;

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
    if (!document.fullscreenElement) {
      this.canvas.requestFullscreen().then(r => {
        console.log("fullscreen")
      });
    } else {
      document.exitFullscreen().then(r => {
        console.log("exit fullscreen")
      });
    }
  }

  @HostListener('document:keypress', ['$event'])
  onHideEvent(event: KeyboardEvent) {
    if (event.key === 'h') {
      if (this.gui._hidden) {
        this.gui.show();
      } else {
        this.gui.hide();
      }
    }
  }

  // Get Canvas
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  // Initialise global variables
  // Initialise camera variables

  private camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
  private controls!: OrbitControls;

  //Initialise object variables
  // Points Material
  private particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    map: this.particleTexture,
    transparent: true,
    alphaMap: this.particleTexture,
    //alphaTest: 0.001
    //depthTest: false
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });

  // Particle Geometry
  private particlesGeometry = new THREE.BufferGeometry();

  // Points
  private particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);

  // Light objects

  // Helpers

  // Initialise renderer
  private renderer!: THREE.WebGLRenderer;
  // Initialise scene
  private scene!: THREE.Scene;

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
    let count = 20000;
    let positions = new Float32Array(count * 3);
    let colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }
    this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }

  /*
  * modify the objects
  *
  */
  private modifyObjects() {
    //Adjust Object Positions

    //this.particlesMaterial.color = new THREE.Color('#ff88cc');
    // Scale

    // Rotation

    // Textures


    // Lights

    // Shadows
    // Cast shadows

    //this.directionalLight.shadow.radius = 10;
    // spot light


    //point light

    // ReceiveShadows


  }

  /*
 * modify the scene
 *
 */
  private modifyScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('black');
  }

  /*
 * modify the camera
 *
 */
  private modifyCamera() {
    this.camera.position.set(0, 0, 3);

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

    // Camera
    this.modifyCamera();

    //Add Objects to the scene
    this.scene.add(this.particles);
    this.scene.add(this.camera);

    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();
  }

  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    // Update Objects
    this.particles.rotation.y = elapsedTime * 0.2;
    this.particles.rotation.z = -elapsedTime * .5;
    // Update Camera

    // Update Controls
    this.controls.update();

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

    // Must change component
    let component: LessonEighteenComponent = this;
    (function render() {
      //console.log('tick');
      requestAnimationFrame(render);
      // Call animation Functions
      component.animateObjects();

      // render renderer
      component.renderer.render(component.scene, component.camera);
    }());
  }

  constructor() {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    // call needed functions
    this.createScene();
    this.startRenderingLoop();
  }

}
