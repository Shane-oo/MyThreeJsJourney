import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as THREE from "three";
import {RepeatWrapping, sRGBEncoding} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import * as lilGui from "lil-gui";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import {CustomMeshStandardMaterial} from "./customMeshStandardMaterial";

@Component({
  selector: 'app-combine-maps',
  templateUrl: './combine-maps.component.html',
  styleUrls: ['./combine-maps.component.css']
})
export class CombineMapsComponent implements OnInit, AfterViewInit {
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
  private stats: Stats = Stats();

  // Initialise renderer
  private renderer!: THREE.WebGLRenderer;


  // Initialise scene
  private scene!: THREE.Scene;

  //Initialise object variables
  private oldElapsedTime = 0;
  private deltaTime: number = 0;


  // Lights
  private directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  private directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 2);

  private bulbLight = new THREE.PointLight('white', 0.00001, 100, 2);
  private hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);

  // gui
  private gui = new lilGui.GUI({width: 200});
  private debugObject = {
    claddingColourNormalMap: false,
    bumpMap: false,
    claddingProfileNormalMap: false

  };

  // Texture
  private textureLoader = new THREE.TextureLoader();
  // Textures
  //todo
  // load the timber diffuse map
  // load the timber normal map
  // load the cladding profile bump map, can we have a bump and normal?
  // if not try to have two normal maps, must use custom shader

  /* private sandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_albedo.jpg');
   private normalSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_normal.jpg');
   private displacementSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_height.jpg');
   private roughnessSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_roughness.jpg');
   private aoSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_ao.jpg');*/
  private claddingColourMap = this.textureLoader.load('/assets/images/cladding/CladdingColorTimber.jpeg');
  private claddingColourNormalMap = this.textureLoader.load('/assets/images/cladding/CladdingColorTimberNormalMap.jpeg');
  private claddingProfileBumpMap = this.textureLoader.load('/assets/images/cladding/CladdingProfileBumpMap.jpeg');
  private claddingProfileNormalMap = this.textureLoader.load('/assets/images/cladding/CladdingProfileNormalMap.jpeg');

  // GLTF Loader
  private gltfLoader = new GLTFLoader();
  // Floor
  private floorGeometry = new THREE.PlaneGeometry(1, 1, 1024, 1024);

  // Planes
  private material = new THREE.MeshStandardMaterial({map: this.claddingColourMap, side: THREE.DoubleSide});

  private customMaterial = new CustomMeshStandardMaterial(this.claddingColourNormalMap, this.claddingProfileNormalMap, {
    map: this.claddingColourMap, side: THREE.DoubleSide, normalMap:this.claddingColourNormalMap
  })

  private floorMesh = new THREE.Mesh(this.floorGeometry, this.customMaterial);


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
    if (!document.fullscreenElement) {
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

    this.stats.domElement.remove();

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
    this.claddingColourMap.wrapS = this.claddingColourMap.wrapT = RepeatWrapping;
    this.claddingColourMap.anisotropy = 4;
    this.claddingColourMap.flipY = false;
    this.claddingColourMap.repeat.set(0.73, 0.72);


    this.claddingColourNormalMap.repeat.set(0.73, 0.73)

    this.claddingColourMap.encoding = sRGBEncoding;

    this.claddingColourNormalMap.wrapS = this.claddingColourNormalMap.wrapT = RepeatWrapping;
    this.claddingColourNormalMap.anisotropy = 4;
    this.claddingColourNormalMap.flipY = false;


    this.claddingProfileBumpMap.repeat.set(3.5, 3.5)

    this.claddingProfileBumpMap.wrapS = this.claddingProfileBumpMap.wrapT = RepeatWrapping;
    this.claddingProfileBumpMap.anisotropy = 4;
    this.claddingProfileBumpMap.flipY = false;


    this.claddingProfileNormalMap.repeat.set(3, 3)

    this.claddingProfileNormalMap.wrapS = this.claddingProfileNormalMap.wrapT = RepeatWrapping;
    this.claddingProfileNormalMap.anisotropy = 4;
    this.claddingProfileNormalMap.flipY = false;
  }


  /*
  * modify the objects
  *
  */
  private modifyObjects() {


    // Modify Light
    this.bulbLight.position.set(0, 2, 0);
    this.directionalLight.position.set(0, 30, 0);
    this.bulbLight.castShadow = true;
    this.bulbLight.power = 5;

    this.floorMesh.rotateX(90);
    this.bulbLight.add(new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 8), new THREE.MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000
    })));

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
    this.camera.position.set(-0.003996128262643776, 1.4094405813695616, 2.2620812635855518);

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
    this.gui.add(this.debugObject, 'claddingColourNormalMap').onChange((value: boolean) => {
      if (value) {
        this.customMaterial.normalMap = this.claddingColourNormalMap;
      } else {
        this.customMaterial.normalMap = null;
      }
      this.floorMesh.material.needsUpdate = true;

    });

    this.gui.add(this.debugObject, 'bumpMap').onChange((value: boolean) => {
      if (value) {
        this.customMaterial.bumpMap = this.claddingProfileBumpMap;
      } else {
        this.customMaterial.bumpMap = null;
      }
      this.floorMesh.material.needsUpdate = true;

    });

    this.gui.add(this.debugObject, 'claddingProfileNormalMap').onChange((value: boolean) => {
      if (value) {
        this.customMaterial.normalMap = this.claddingProfileNormalMap;
      } else {
        this.customMaterial.normalMap = null;
      }
      this.floorMesh.material.needsUpdate = true;

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

    this.createStats();

    //Add Objects to the scene

    this.scene.add(this.camera);
    this.scene.add(this.bulbLight);
    //  this.scene.add(this.hemiLight);
    this.scene.add(this.directionalLight, this.directionalLightHelper);

    this.scene.add(this.floorMesh);

    /*
     this.scene.add(this.plane3);
     this.scene.add(this.plane4);
     this.scene.add(this.plane5);*/
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

    this.bulbLight.position.y = (Math.cos(elapsedTime) * 0.75 + 0.75) / 3 + 0.1;
    this.stats.end();
  }


  /*
  * Start The Renderer
  *
  */
  private startRenderingLoop() {
    // Renderer
    // use canvas element in template

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.pixelRatio = this.renderer.getPixelRatio();

    this.renderer.setSize(this.width, this.height);
    // Activate shadow map
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Output Encoding
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    // Optimise Renderer shadow map
    // Only update the shadow once i.e. a non moving sun
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;

    //Clear Color
    this.renderer.setClearColor(new THREE.Color('grey'));

    // Must change component
    let component: CombineMapsComponent = this;

    // Post Processing
    this.setEffectComposer();

    (function render() {
      //console.log('tick');

      requestAnimationFrame(render);

      // Call animation Functions
      component.animateObjects();

      // render renderer

      component.renderer.render(component.scene, component.camera);
    }());
  }

}
