import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as lilGui from 'lil-gui';
import { gsap } from 'gsap';

//@ts-ignore
import overlayVertexShader from '../../../assets/shaders/Overlay/vertex.glsl';
//@ts-ignore
import overlayFragmentShader from '../../../assets/shaders/Overlay/fragment.glsl';


@Component({
             selector: 'app-lesson-thirty-four',
             templateUrl: './lesson-thirty-four.component.html',
             styleUrls: ['./lesson-thirty-four.component.css']
           })
export class LessonThirtyFourComponent implements OnInit, AfterViewInit {
  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();
  private width = window.innerWidth;
  private height = window.innerHeight;

  private pixelRatio: number = 0;
  // Get Loading Bar
  @ViewChild('loadingBar')
  private loadingBarElement!: ElementRef;
  // Get Canvas
  @ViewChild('canvas')
  private canvasRef!: ElementRef;


  private camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
  private controls!: OrbitControls;

  // Initialise global variables
  // Initialise camera variables
  // Initialise renderer
  private renderer!: THREE.WebGLRenderer;


  // Initialise scene
  private scene!: THREE.Scene;

  //Initialise object variables
  private oldElapsedTime = 0;
  private deltaTime: number = 0;


  // Plane
  private overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  private overlayMaterial = new THREE.ShaderMaterial({
                                                       uniforms: {
                                                         uAlpha: {value: 1}
                                                       },
                                                       transparent: true,
                                                       vertexShader: overlayVertexShader,
                                                       fragmentShader: overlayFragmentShader
                                                     });
  private overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial);


  // Loaders
  private loadingManager = new THREE.LoadingManager(() => {
                                                      gsap.delayedCall(0.5, () => {
                                                        gsap.to(this.overlayMaterial.uniforms.uAlpha, {duration: 3, value: 0, delay: 1});
                                                        this.loadingBar.classList.add('ended');
                                                        this.loadingBar.style.transform = '';
                                                      });

                                                    },
                                                    (itemUrl, itemsLoaded, itemsTotal) => {
                                                      const progressRatio = itemsLoaded / itemsTotal;
                                                      this.loadingBar.style.transform = `scaleX(${progressRatio})`;

                                                    },
                                                    (ex) => {
                                                      console.log('error: ', ex);
                                                    });

  private gltfLoader = new GLTFLoader(this.loadingManager);
  private cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager);

  // Environment Map
  private environmentMap = this.cubeTextureLoader.load([
                                                         'assets/images/environmentMaps/0/px.jpg',
                                                         'assets/images/environmentMaps/0/nx.jpg',
                                                         'assets/images/environmentMaps/0/py.jpg',
                                                         'assets/images/environmentMaps/0/ny.jpg',
                                                         'assets/images/environmentMaps/0/pz.jpg',
                                                         'assets/images/environmentMaps/0/nz.jpg'
                                                       ]);


  // Lights
  private directionalLight = new THREE.DirectionalLight('#ffffff', 3);


  // gui
  private gui = new lilGui.GUI({width: 200});
  private debugObject = {
    envMapIntensity: 2.5
  };

  constructor() {

  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private get loadingBar(): HTMLDivElement {
    return this.loadingBarElement.nativeElement;
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
        child.material.envMapIntensity = this.debugObject.envMapIntensity;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  };

  private setEffectComposer() {

  }

  /*
   * Loading Manager Functions
  */
  private setLoadingManager() {
  }

  private LoadModels() {
    this.gltfLoader.load('assets/models/FlightHelmet/glTF/FlightHelmet.gltf',
                         (gltf) => {
                           //Model
                           gltf.scene.scale.set(10, 10, 10);
                           gltf.scene.position.set(0, -4, 0);
                           gltf.scene.rotation.y = Math.PI * 0.5;
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


    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.mapSize.set(1024, 1024);

    this.directionalLight.shadow.normalBias = 0.05;
    this.directionalLight.position.set(0.25, 3, -2.25);


  }

  private modifyPhysics() {

  }

  /*
 * modify the scene
 *
 */
  private modifyScene() {
    this.scene = new THREE.Scene();
    this.environmentMap.colorSpace = THREE.SRGBColorSpace;
    this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;

  }

  /*
 * modify the camera
 *
 */
  private modifyCamera() {
    this.camera.position.set(4, 1, -4);

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
    this.scene.add(this.overlay);
    //Physics
    this.modifyPhysics();
    // Camera
    this.modifyCamera();

    // Models
    this.LoadModels();
    //Add Objects to the scene

    this.scene.add(this.camera);
    this.scene.add(this.directionalLight);

    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();


  }

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    this.deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;

    // Update Camera


    // Update Controls
    this.controls.update();
    // Update physics world


  }

  /*
  * Start The Renderer
  *
  */
  private startRenderingLoop() {
    // Renderer
    // use canvas element in template

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.pixelRatio = this.renderer.getPixelRatio();

    this.renderer.setSize(this.width, this.height);
    // Activate shadow map
    //this.renderer.physicallyCorrectLights = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 3;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Must change component
    let component: LessonThirtyFourComponent = this;


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
