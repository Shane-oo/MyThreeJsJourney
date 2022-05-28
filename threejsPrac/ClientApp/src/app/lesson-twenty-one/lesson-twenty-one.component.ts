import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as lilGui from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Scroll} from "@angular/router";
import gsap from 'gsap';
@Component({
  selector: 'app-lesson-twenty-one',
  templateUrl: './lesson-twenty-one.component.html',
  styleUrls: ['./lesson-twenty-one.component.css']
})
export class LessonTwentyOneComponent implements OnInit, AfterViewInit {


  // Debug variables
  private gui = new lilGui.GUI({width: 250});
  private parameters = {
    materialColor: '#ffeded'
  };

  // Loading Manager
  private loadingManager = new THREE.LoadingManager();
  // Textures
  private textureLoader = new THREE.TextureLoader(this.loadingManager);
  private gradientTexture = this.textureLoader.load('../../assets/images/gradients/3.jpg');
  private gradientTexture2 = this.textureLoader.load('../../assets/images/gradients/5.jpg');

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
  // Group
  private cameraGroup = new THREE.Group();
  private camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.1, 100);

  //Initialise object variables

  // Particles
  private particlesCount = 200;
  private positions = new Float32Array(this.particlesCount * 3);
  private particlesGeometry = new THREE.BufferGeometry();
  private particlesMaterial = new THREE.PointsMaterial({
    color: this.parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
  });
  private particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);
  // Material
  private material = new THREE.MeshToonMaterial({
    color: this.parameters.materialColor,
    gradientMap: this.gradientTexture
  });
  // Meshes
  private mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    this.material
  );
  private mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    this.material
  );
  private mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    this.material
  );
  //Lights
  private directionalLight = new THREE.DirectionalLight('#ffffff', 1);
  // Initialise renderer
  private renderer = new THREE.WebGLRenderer({
    alpha: true
  });
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

  private objectsDistance = 4;

  /*
  * modify the objects
  *
  */
  private modifyObjects() {
    //Adjust Object Positions
    this.mesh1.position.y = 0;
    this.mesh2.position.y = -this.objectsDistance;
    this.mesh3.position.y = -this.objectsDistance * 2;

    this.mesh1.position.x = 2;
    this.mesh2.position.x = -2;
    this.mesh3.position.x = 2;

    // Scale

    // Rotation

    // Textures
    this.gradientTexture.magFilter = THREE.NearestFilter;
    this.gradientTexture2.magFilter = THREE.NearestFilter;


    // Lights
    this.directionalLight.position.set(1, 1, 0);

    //Particles
    for (let i = 0; i < this.particlesCount; i++) {
      this.positions[i * 3] = (Math.random() - 0.5) * 10;
      this.positions[i * 3 + 1] = this.objectsDistance * 0.5 - Math.random() * this.objectsDistance * this.sectionMeshes.length;
      this.positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

  }

  /*
 * modify the scene
 *
 */
  private modifyScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1e1a20');
  }

  /*
 * modify the camera
 *
 */
  private modifyCamera() {
    this.camera.position.set(0, 0, 6);

  }

  /*
   * Add Controls
  */
  private modifyControls() {
    //this.controls = new OrbitControls(this.camera, this.canvas);
    //controls.target.y = 2;
    //this.controls.enableDamping = true;
  }


  /*
     * Add Debug Tweaks
     *
    */
  private modifyDebugGUI() {
    this.gui.addColor(this.parameters, 'materialColor')
      .onChange(() => {
        this.material.color.set(this.parameters.materialColor);
        this.particlesMaterial.color.set(this.parameters.materialColor);
      });
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
    this.cameraGroup.add(this.camera);
    this.scene.add(this.cameraGroup);
    this.scene.add(this.mesh1, this.mesh2, this.mesh3);
    this.scene.add(this.directionalLight);
    this.scene.add(this.particles);
    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();

  }

  private scrollY = window.scrollY;
  private currentSection = 0;
  @HostListener('window:scroll', ['$event'])
  onScrollEvent(event: Scroll) {
    this.scrollY = window.scrollY;

    const newSection = Math.round(this.scrollY / this.height);
    if(newSection != this.currentSection){
      this.currentSection = newSection;
      gsap.to(
        this.sectionMeshes[this.currentSection].rotation,{
          duration:1.5,
          ease:'power2.inout',
          x:'+=6',
          y:'+=3',
          z:'+=1.5'
        }
      );
    }
  }

  private cursor = {
    x: 0,
    y: 0
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMoveEvent(event: MouseEvent) {
    this.cursor.x = event.clientX / this.width - 0.5;
    this.cursor.y = event.clientY / this.height - 0.5;
  }

  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();
  private previousTime = 0;
  private sectionMeshes = [this.mesh1, this.mesh2, this.mesh3];

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousTime;
    this.previousTime = elapsedTime;
    // Update Objects
    for (const mesh of this.sectionMeshes) {
      mesh.rotation.x += deltaTime * 0.1;
      mesh.rotation.y += deltaTime * 0.12;
    }
    // Update Camera
    this.camera.position.y = -this.scrollY / this.height * this.objectsDistance;

    const parallaxX = this.cursor.x * 0.5;
    const parallaxY = -this.cursor.y * 0.5;
    this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 3 * deltaTime;
    this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 3 * deltaTime;

  }

  /*
  * Start The Renderer
  *
  */
  private startRenderingLoop() {
    // Renderer
    // use canvas element in template

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setSize(this.width, this.height);
    // Activate shadow map

    // Must change component
    let component: LessonTwentyOneComponent = this;
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
