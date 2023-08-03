import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as lilGui from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper";

@Component({
  selector: 'app-lesson-sixteen',
  templateUrl: './lesson-sixteen.component.html',
  styleUrls: ['./lesson-sixteen.component.css']
})
export class LessonSixteenComponent implements OnInit, AfterViewInit {


  // Debug variables
  private gui = new lilGui.GUI();
  // Loading Manager
  private loadingManager = new THREE.LoadingManager();
  // Textures
  private textureLoader = new THREE.TextureLoader(this.loadingManager);
  private bakedShadow = this.textureLoader.load('../../assets/images/bakedShadows/bakedShadow.jpg');
  private simpleShadow = this.textureLoader.load('../../assets/images/bakedShadows/simpleShadow.jpg');

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
    new THREE.SphereGeometry(0.5, 32, 32),
    this.material
  );

  private plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    this.material
  );

  private sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      alphaMap: this.simpleShadow
    })
  )

  // Light objects
  private ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  private directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  private spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
  private pointLight = new THREE.PointLight(0xffffff, 0.3);
  // Helpers
  private directionalLightCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
  private spotLightCameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera);
  private pointLightCameraHelper = new THREE.CameraHelper(this.pointLight.shadow.camera);
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
    //Adjust Object Positions
    this.plane.rotation.x = -Math.PI * 0.5;
    this.plane.position.y = -0.5

    // Scale

    // Rotation
    this.sphereShadow.rotation.x = -Math.PI * 0.5;
    this.sphereShadow.position.y = this.plane.position.y + 0.01;
    // Textures
    this.material.roughness = 0.7;

    // Lights
    this.directionalLight.position.set(2, 2, -1);
    this.spotLight.position.set(0, 2, 2);
    this.pointLight.position.set(-1, 1, 0);
    // Shadows
    // Cast shadows
    this.directionalLight.castShadow = true;
    this.sphere.castShadow = true;

    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;

    this.directionalLight.shadow.camera.top = 2;
    this.directionalLight.shadow.camera.right = 2
    this.directionalLight.shadow.camera.bottom = -2;
    this.directionalLight.shadow.camera.left = -2;
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 6;
    //this.directionalLight.shadow.radius = 10;
    // spot light
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.fov = 30;
    this.spotLight.shadow.camera.near = 1;
    this.spotLight.shadow.camera.far = 6;

    //point light
    this.pointLight.castShadow = true;
    this.pointLight.shadow.mapSize.width = 1024;
    this.pointLight.shadow.mapSize.height = 1024;
    this.pointLight.shadow.camera.near = 0.1;
    this.pointLight.shadow.camera.far = 5;
    // ReceiveShadows
    this.plane.receiveShadow = true;


    this.directionalLightCameraHelper.visible = false;
    this.spotLightCameraHelper.visible = false;
    this.pointLightCameraHelper.visible = false;
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
    this.gui.add(this.ambientLight, 'intensity')
      .min(0)
      .max(1)
      .step(0.001);
    this.gui.add(this.directionalLight, 'intensity')
      .min(0)
      .max(1)
      .step(0.001);
    this.gui.add(this.directionalLight.position, 'x')
      .min(-5)
      .max(5)
      .step(0.001);
    this.gui.add(this.directionalLight.position, 'y')
      .min(-5)
      .max(5)
      .step(0.001);
    this.gui.add(this.directionalLight.position, 'z')
      .min(-5)
      .max(5)
      .step(0.001);

    this.gui.add(this.material, 'metalness')
      .min(0)
      .max(1)
      .step(0.001);
    this.gui.add(this.material, 'roughness')
      .min(0)
      .max(1)
      .step(0.001);
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
      this.spotLight,
      this.spotLight.target,
      this.pointLight
    );
    this.scene.add(this.sphereShadow);
    this.scene.add(this.sphere, this.plane);
    this.scene.add(this.camera);
    this.scene.add(this.directionalLightCameraHelper);
    this.scene.add(this.spotLightCameraHelper);
    this.scene.add(this.pointLightCameraHelper);
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

    // Update the sphere
    this.sphere.position.x = Math.cos(elapsedTime) * 1.5;
    this.sphere.position.z = Math.sin(elapsedTime) * 1.5;
    this.sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    // Update the shadow
    this.sphereShadow.position.x = this.sphere.position.x;
    this.sphereShadow.position.z = this.sphere.position.z
    this.sphereShadow.material.opacity = (1 - this.sphere.position.y) * 0.5;
    // Update Camera

    // Update Controls
    this.controls.update();
    this.directionalLightCameraHelper.update();
    this.spotLightCameraHelper.update();
    this.pointLightCameraHelper.update();
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
    this.renderer.shadowMap.enabled = false;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    // Must change component
    let component: LessonSixteenComponent = this;
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
