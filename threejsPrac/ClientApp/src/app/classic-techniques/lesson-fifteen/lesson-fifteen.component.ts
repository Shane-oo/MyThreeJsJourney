import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as lilGui from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";

@Component({
  selector: 'app-lesson-fifteen',
  templateUrl: './lesson-fifteen.component.html',
  styleUrls: ['./lesson-fifteen.component.css']
})
export class LessonFifteenComponent implements OnInit, AfterViewInit {


  // Debug variables
  private gui = new lilGui.GUI();
  private parameters = {
    color: 0xff0000,
    spin: () => {
      // gsap.to(this.mesh.rotation, { duration: 1, y: this.mesh.rotation.y + Math.PI * 2 });
    }
  };
  // Loading Manager
  private loadingManager = new THREE.LoadingManager();
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
  private material = new THREE.MeshStandardMaterial();


  private sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    this.material
  );
  private cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    this.material
  );
  private torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
    this.material
  );
  private plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    this.material
  );

  // Light objects
  private ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  private directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
  private hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
  private pointLight = new THREE.PointLight(0xff900, 0.5, 10, 2);
  private rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
  private spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);

  // Helpers
  private hemisphereLightHelper = new THREE.HemisphereLightHelper(this.hemisphereLight,0.2);
  private directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight,0.2);
  private pointLightHelper = new THREE.PointLightHelper(this.pointLight,0.2);
  private spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
  private rectAreaLightHelper = new RectAreaLightHelper(this.rectAreaLight);
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

  /*
  * modify the objects
  *
  */
  private modifyObjects() {
    //Position
    this.sphere.position.x = -1.5;
    this.torus.position.x = 1.5;
    this.plane.rotation.x = -Math.PI * 0.5;
    this.plane.position.y = -0.65


    //this.pointLight.position.set(2, 3, 4);
    // Scale

    // Rotation

    // Textures
    this.material.roughness = 0.4;

    // Lights
    this.directionalLight.position.set(1, 0.25, 0);
    this.pointLight.position.set(1, -0.5, 1);

    this.rectAreaLight.position.set(-1.5, 0, 1.5);
    this.rectAreaLight.lookAt(new THREE.Vector3());

    this.spotLight.position.set(0, 2, 3);
    this.spotLight.target.position.x = -0.75;
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
    this.camera.position.set(1, 1, 2);

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
    this.modifyObjects();
    // Scene
    this.modifyScene();

    // Camera
    this.modifyCamera();

    //Add Objects to the scene
    this.scene.add(this.ambientLight,
      this.directionalLight,
      this.hemisphereLight,
      this.pointLight,
      this.rectAreaLight,
      this.spotLight,
      this.spotLight.target
    );
    this.scene.add(this.hemisphereLightHelper,
      this.directionalLightHelper,
      this.pointLightHelper,
      this.spotLightHelper,
      this.rectAreaLightHelper
      )
    this.scene.add(this.sphere, this.plane, this.torus, this.cube);
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
    this.sphere.rotation.y = 0.1 * elapsedTime;
    this.cube.rotation.y = 0.1 * elapsedTime;
    this.torus.rotation.y = 0.1 * elapsedTime;
    this.sphere.rotation.x = 0.15 * elapsedTime;
    this.cube.rotation.x = 0.15 * elapsedTime;
    this.torus.rotation.x = 0.15 * elapsedTime;
    // Update Camera

    // Update Controls
    this.controls.update();
    this.spotLightHelper.update()
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
    let component: LessonFifteenComponent = this;
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
