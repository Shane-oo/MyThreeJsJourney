import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as lilGui from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextBufferGeometry, TextGeometry} from "three/examples/jsm/geometries/TextGeometry";

@Component({
  selector: 'app-lesson-thirteen',
  templateUrl: './lesson-thirteen.component.html',
  styleUrls: ['./lesson-thirteen.component.css']
})
export class LessonThirteenComponent implements OnInit, AfterViewInit {


  // Debug variables

  // Loading Manager
  private loadingManager = new THREE.LoadingManager();
  // Textures
  private textureLoader = new THREE.TextureLoader(this.loadingManager);
  private matcapTexture = this.textureLoader.load('../../assets/images/matcaps/8.png');
  // Fonts
  private fontLoader = new FontLoader();

  // Axes Helper
  private axesHelper = new THREE.AxesHelper();
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


  // Light objects

  // Initialise renderer
  private renderer!: THREE.WebGLRenderer;
  // Initialise scene
  private scene!: THREE.Scene;

  /*
   * Loading Manager Functions
  */
  private setLoadingManager() {
    // Font Loader
    this.fontLoader.load('../../assets/fonts/ethnocentric_font.json',
      (font: Font) => {
        const textGeometry = new TextGeometry(
          'Shane Monck', {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4
          }
        )
        /*textGeometry.computeBoundingBox();
        textGeometry.translate(
          // 0.02 = bevelSize
          -(textGeometry.boundingBox!.max.x - 0.02) * 0.5,
          -(textGeometry.boundingBox!.max.y - 0.02) * 0.5,
          -(textGeometry.boundingBox!.max.z - 0.02) * 0.5
        );*/
        textGeometry.center();
        const material = new THREE.MeshMatcapMaterial({matcap: this.matcapTexture});
        const text = new THREE.Mesh(textGeometry, material);
        this.scene.add(text);
        const donutGeometry = new THREE.TorusGeometry(0.2, 0.2, 20, 45);


        for (let i = 0; i < 300; i++) {
          const donut = new THREE.Mesh(donutGeometry, material);

          donut.position.x = (Math.random() - 0.5) * 10;
          donut.position.y = (Math.random() - 0.5) * 10;
          donut.position.z = (Math.random() - 0.5) * 10;

          donut.rotation.x = Math.random() * Math.PI;
          donut.rotation.y = Math.random() * Math.PI;
          const scale = Math.random();
          donut.scale.set(scale,scale,scale);
          this.scene.add(donut);
        }
      });

  }

  /*
   * Set Geometry Attribute on geometry
   */
  private setGeometryAttributes() {
    // Set Geometry attribute

  }

  /*
  * Modifify the objects
  *
  */
  private modifiyObjects() {
    //Position

    // Scale

    // Rotation

    // Textures

  }

  /*
 * Modifify the scene
 *
 */
  private modifiyScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('black');


  }

  /*
 * Modifify the camera
 *
 */
  private modifiyCamera() {
    this.camera.position.set(1, 1, 3);

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
    /*  this.gui.add(this.mesh.position, 'y')
        .min(-3)
        .max(3)
        .step(0.01)
        .name('elevation');*/

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
    this.modifiyObjects();
    // Scene
    this.modifiyScene();

    // Camera
    this.modifiyCamera();

    //Add Objects to the scene

    this.scene.add(this.camera);
    // this.scene.add(this.axesHelper);
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

  private animateCube() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    // Update Objects

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
    // Must change component
    let component: LessonThirteenComponent = this;
    (function render() {
      //console.log('tick');
      requestAnimationFrame(render);
      // Call animation Functions
      component.animateCube();

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
