import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as lilGui from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

@Component({
  selector: 'app-lesson-twenty-three',
  templateUrl: './lesson-twenty-three.component.html',
  styleUrls: ['./lesson-twenty-three.component.css']
})
export class LessonTwentyThreeComponent implements OnInit, AfterViewInit {


  // Debug variables
  private gui = new lilGui.GUI({width: 500}).hide();


  // Loading Manager
  private loadingManager = new THREE.LoadingManager();
  private mixer!: THREE.AnimationMixer;
  // Models
  private gltfLoader = new GLTFLoader(this.loadingManager);
  private duck = this.gltfLoader.load(
    '../../assets/models/Fox/glTF/Fox.gltf',
    (gltf) => {

      this.mixer = new THREE.AnimationMixer(gltf.scene);
      const action = this.mixer.clipAction(gltf.animations[2]);
      action.play();
      gltf.scene.scale.set(0.025, 0.025, 0.025);
      this.scene.add(gltf.scene);
      return;
    }
  );
  // Textures
  private textureLoader = new THREE.TextureLoader(this.loadingManager);

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
  private floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: '#444444',
      metalness: 0,
      roughness: 0.5
    })
  )

  //Lights
  private ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  private directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);


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

  }

  private setRayCaster() {


  }

  /*
  * modify the objects
  *
  */
  private modifyObjects() {
    //Adjust Object Positions
    this.floor.rotation.x = -Math.PI * 0.5;
    // Scale

    // Rotation

    // Textures


    // Lights
    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    this.directionalLight.shadow.camera.far = 15
    this.directionalLight.shadow.camera.left = -7
    this.directionalLight.shadow.camera.top = 7
    this.directionalLight.shadow.camera.right = 7
    this.directionalLight.shadow.camera.bottom = -7
    this.directionalLight.position.set(5, 5, 5)
    // Shadows
    this.floor.receiveShadow = true;
    // Cast shadows

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
    this.camera.position.set(2, 2, 2);

  }

  /*
   * Add Controls
  */
  private modifyControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.target.set(0, 0.75, 0);
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
    // Raycaster
    this.setRayCaster();

    // Camera
    this.modifyCamera();

    //Add Objects to the scene

    this.scene.add(this.camera);
    this.scene.add(this.floor);
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
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
  private previousTime = 0;

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousTime;
    this.previousTime = elapsedTime;
    // Update Camera
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Must change component
    let component: LessonTwentyThreeComponent = this;
    (function render() {

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
