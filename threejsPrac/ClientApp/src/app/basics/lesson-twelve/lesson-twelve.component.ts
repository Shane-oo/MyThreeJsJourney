import {ThisReceiver} from '@angular/compiler';
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, HostListener} from '@angular/core';
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as lilGui from 'lil-gui';
import gsap from 'gsap';

@Component({
  selector: 'app-lesson-twelve',
  templateUrl: './lesson-twelve.component.html',
  styleUrls: ['./lesson-twelve.component.css']
})
export class LessonTwelveComponent implements OnInit, AfterViewInit {


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
  private doorColorTexture = this.textureLoader.load('../../assets/images/door/color.jpg');
  private doorAlphaTexture = this.textureLoader.load('../../assets/images/door/alpha.jpg');
  private doorHeightTexture = this.textureLoader.load('../../assets/images/door/height.jpg');
  private doorNormalTexture = this.textureLoader.load('../../assets/images/door/normal.jpg');
  private doorMetalnessTexture = this.textureLoader.load('../../assets/images/door/metalness.jpg');
  private doorRoughnessTexture = this.textureLoader.load('../../assets/images/door/roughness.jpg');
  private ambientOcclusionTexture = this.textureLoader.load('../../assets/images/door/ambientOcclusion.jpg');

  private matcapTexture = this.textureLoader.load('../../assets/images/matcaps/1.png');
  private gradientTexture = this.textureLoader.load('../../assets/images/gradients/5.jpg');

  private cubeTextureLoader = new THREE.CubeTextureLoader();
  private environmentMapTexture = this.cubeTextureLoader.load([
    '../../assets/images/environmentMaps/3/px.jpg',
    '../../assets/images/environmentMaps/3/nx.jpg',
    '../../assets/images/environmentMaps/3/py.jpg',
    '../../assets/images/environmentMaps/3/ny.jpg',
    '../../assets/images/environmentMaps/3/pz.jpg',
    '../../assets/images/environmentMaps/3/nz.jpg'
  ]);

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
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    this.material
  );
  private plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1,100,100),
    this.material
  );
  private torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
    this.material
  );

  // Light objects
  private ambientLight = new THREE.AmbientLight(0xffffff,0.5);
  private pointLight = new THREE.PointLight(0xffffff,0.5);
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
    this.sphere.geometry.setAttribute('uv2',
      new THREE.BufferAttribute(
        this.sphere.geometry.attributes.uv.array,2
      )
    );
    this.plane.geometry.setAttribute('uv2',
      new THREE.BufferAttribute(
        this.plane.geometry.attributes.uv.array,2
      )
    );
    this.torus.geometry.setAttribute('uv2',
      new THREE.BufferAttribute(
        this.torus.geometry.attributes.uv.array,2
      )
    );
  }

  /*
  * Modifify the objects
  *
  */
  private modifiyObjects() {
    //Position
    this.sphere.position.x = -1.5;
    this.torus.position.x = 1.5;

    this.pointLight.position.set(2,3,4);
    // Scale

    // Rotation

    // Textures
    //this.material.matcap = this.matcapTexture;
    //this.material.color = new THREE.Color(0x00ff00);
    //this.material.wireframe = true;
   // this.material.opacity = 0.5
    //this.material.transparent = true;
    //this.material.alphaMap = this.doorAlphaTexture;
    //this.material.side = THREE.DoubleSide;
    //this.material.flatShading = true;

    //this.material.shininess = 100;
   // this.material.specular = new THREE.Color('blue');
    //this.gradientTexture.minFilter = THREE.NearestFilter;
    //this.gradientTexture.magFilter = THREE.NearestFilter;
    //this.gradientTexture.generateMipmaps = false;
    //this.material.gradientMap = this.gradientTexture;
    this.material.metalness = 0.7;
    this.material.roughness = 0.0;

    /*this.material.map = this.doorColorTexture;
    this.material.aoMap = this.ambientOcclusionTexture;
    this.material.aoMapIntensity = 1;

    this.material.displacementMap = this.doorHeightTexture;
    this.material.displacementScale = 0.05;

    this.material.metalnessMap = this.doorMetalnessTexture;

    this.material.roughnessMap = this.doorRoughnessTexture;

    this.material.normalMap = this.doorNormalTexture;
    this.material.normalScale.set(0.5,0.5);

    this.material.transparent = true;
    this.material.alphaMap = this.doorAlphaTexture;*/

    this.material.envMap = this.environmentMapTexture;
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
    /*  this.gui.add(this.mesh.position, 'y')
        .min(-3)
        .max(3)
        .step(0.01)
        .name('elevation');*/

    /*this.gui.add(this.mesh, 'visible');
    this.gui.add(this.material, 'wireframe');

    this.gui.addColor(this.parameters, 'color')
      .onChange(() => {
        this.material.color.set(this.parameters.color);
      });*/
/*
    this.gui.add(this.parameters, 'spin')
      .name('Spin Cube');*/
    this.gui.add(this.material,'metalness')
      .min(0)
      .max(1)
      .step(0.001);
    this.gui.add(this.material,'roughness')
      .min(0)
      .max(1)
      .step(0.001);
    this.gui.add(this.material,'aoMapIntensity')
      .min(0)
      .max(10)
      .step(0.01);
    this.gui.add(this.material,'displacementScale')
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
    this.modifiyObjects();
    // Scene
    this.modifiyScene();

    // Camera
    this.modifiyCamera();

    //Add Objects to the scene

    this.scene.add(this.sphere, this.plane, this.torus,this.ambientLight,this.pointLight);
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

  private animateCube() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    // Update Objects
    this.sphere.rotation.y = 0.1 * elapsedTime;
    this.plane.rotation.y = 0.1 *elapsedTime;
    this.torus.rotation.y = 0.1 *elapsedTime;
    this.sphere.rotation.x = 0.15 * elapsedTime;
    this.plane.rotation.x = 0.15 *elapsedTime;
    this.torus.rotation.x = 0.15 *elapsedTime;
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
    let component: LessonTwelveComponent = this;
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
