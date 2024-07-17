import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {RepeatWrapping, SRGBColorSpace} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as lilGui from 'lil-gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from "three/examples/jsm/libs/stats.module";

@Component({
             selector: 'app-tiles',
             templateUrl: './tiles.component.html',
             styleUrls: ['./tiles.component.css']
           })
export class TilesComponent implements OnInit, AfterViewInit {
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
  private directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  private directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 2);

  private bulbLight = new THREE.PointLight('white', 1, 100, 2);
  private hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);

  // gui
  private gui = new lilGui.GUI({width: 200});
  private debugObject = {
    colorMap: true,
    normalMap: false,
    roughnessMap: false,
    aoMap: false,
    displacementMap: false
  };

  // Texture
  private textureLoader = new THREE.TextureLoader();
  // Textures
  /* private sandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_albedo.jpg');
   private normalSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_normal.jpg');
   private displacementSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_height.jpg');
   private roughnessSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_roughness.jpg');
   private aoSandMap = this.textureLoader.load('/assets/images/sand/TexturesCom_Sand_Muddy2_2x2_512_ao.jpg');*/
  private tilesColourMap = this.textureLoader.load('/assets/images/tiles/TexturesCom_Tiles_Plain2_512_albedoNew2.jpg');
  private tilesNormalMap = this.textureLoader.load('/assets/images/tiles/TexturesCom_Tiles_Plain2_1K_normal.jpg');
  private tilesRoughnessMap = this.textureLoader.load('/assets/images/tiles/TexturesCom_Tiles_Plain2_512_roughnessNew.jpg');
  private tilesAoMap = this.textureLoader.load('/assets/images/tiles/TexturesCom_Tiles_Plain2_512_aoNew.jpg');
  private tilesHeightMap = this.textureLoader.load('/assets/images/tiles/TexturesCom_Tiles_Plain2_512_heightNew.jpg');

  // GLTF Loader
  private gltfLoader = new GLTFLoader();
  // Floor
  private floorGeometry = new THREE.PlaneGeometry(1, 1, 512, 512);

  // Planes
  private material = new THREE.MeshStandardMaterial({map: this.tilesColourMap, side: THREE.DoubleSide});


  private floorMesh = new THREE.Mesh(this.floorGeometry, this.material);


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
    this.tilesColourMap.wrapS = this.tilesColourMap.wrapT = RepeatWrapping;
    this.tilesColourMap.anisotropy = 4;
    this.tilesColourMap.flipY = false;
/*    this.tilesColourMap.repeat.set(2, 2);
    this.tilesColourMap.offset.set(0, 0);*/
    this.tilesColourMap.colorSpace = SRGBColorSpace;

    this.tilesNormalMap.wrapS = this.tilesNormalMap.wrapT = RepeatWrapping;
    this.tilesNormalMap.anisotropy = 4;
    this.tilesNormalMap.flipY = false;
    /*
        this.tilesNormalMap.repeat.set(2, 2);
        this.tilesNormalMap.offset.set(0, 0);
    */


    this.tilesRoughnessMap.wrapS = this.tilesRoughnessMap.wrapT = RepeatWrapping;
    this.tilesRoughnessMap.anisotropy = 4;
    this.tilesRoughnessMap.flipY = false;
/*    this.tilesRoughnessMap.repeat.set(2, 2);
    this.tilesRoughnessMap.offset.set(0, 0);*/

    this.tilesAoMap.wrapS = this.tilesAoMap.wrapT = RepeatWrapping;
    this.tilesAoMap.anisotropy = 4;
    this.tilesAoMap.flipY = false;
/*    this.tilesAoMap.repeat.set(2, 2);
    this.tilesAoMap.offset.set(0, 0);*/


    this.tilesHeightMap.wrapS = this.tilesHeightMap.wrapT = RepeatWrapping;
    this.tilesHeightMap.anisotropy = 4;
    this.tilesHeightMap.flipY = false;
    this.tilesHeightMap.repeat.set(2, 2);
    this.tilesHeightMap.offset.set(0, 0);

    /*
this.metallicMap.wrapS = this.metallicMap.wrapT = RepeatWrapping;
this.metallicMap.anisotropy = 4;
this.metallicMap.flipY = false;
this.metallicMap.repeat.set(2, 2);
this.metallicMap.offset.set(0, 0);
this.metallicMap.encoding = sRGBEncoding;*/
  }


  /*
  * modify the objects
  *
  */
  private modifyObjects() {
    // second uv set
    this.floorMesh.geometry.attributes.uv2 = this.floorMesh.geometry.attributes.uv;


    // Modify Light
    this.bulbLight.position.set(0, 2, 0);
    this.directionalLight.position.set(0, 30, 0);
    this.bulbLight.castShadow = true;
    this.bulbLight.power = 17;

    this.floorMesh.rotateX(90);
    this.bulbLight.add(new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 8), new THREE.MeshStandardMaterial({
                                                                                                              emissive: 0xffffee,
                                                                                                              emissiveIntensity: 1,
                                                                                                              color: 0x000000
                                                                                                            })));


    /*    // add second uvs for ao map
        this.plane5.geometry.attributes.uv2 = this.plane5.geometry.attributes.uv;

        this.plane3.position.x += 6;
        this.plane4.position.x += 9;
        this.plane5.position.x += 12;*/

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
    this.camera.position.set(-0.003996128262643776, 0.4094405813695616, 1.2620812635855518);

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
    this.gui.add(this.debugObject, 'colorMap').onChange((value: boolean) => {
      if(value) {
        this.material.map = this.tilesColourMap;
      } else {
        this.material.map = null;
      }
      this.floorMesh.material.needsUpdate = true;

    });
    this.gui.add(this.debugObject, 'normalMap').onChange((value: boolean) => {
      if(value) {
        this.material.normalMap = this.tilesNormalMap;
        this.material.normalScale = new THREE.Vector2(2, 2);

      } else {
        this.material.normalMap = null;
      }
      this.floorMesh.material.needsUpdate = true;

    });
    this.gui.add(this.debugObject, 'roughnessMap').onChange((value: boolean) => {
      if(value) {
        this.material.roughnessMap = this.tilesRoughnessMap;
        this.material.roughness = 0.9;

      } else {
        this.material.roughnessMap = null;
      }
      this.floorMesh.material.needsUpdate = true;

    });
    this.gui.add(this.debugObject, 'aoMap').onChange((value: boolean) => {
      if(value) {
        this.material.aoMap = this.tilesAoMap;
        this.material.aoMapIntensity = 1;

      } else {
        this.material.aoMap = null;
      }
      this.floorMesh.material.needsUpdate = true;

    });
    this.gui.add(this.debugObject, 'displacementMap').onChange((value: boolean) => {
      if(value) {
        this.material.displacementMap = this.tilesHeightMap;
        this.material.displacementScale = 0.01;

      } else {
        this.material.displacementMap = null;
      }
      this.floorMesh.material.needsUpdate = true;

    });

    /*  private debugObject = {
    colorMap:true,
    normalMap:false,
    roughnessMap:false,
    aoMap:false,
    displacementMap:false
  };*/
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
    // Update physics world

    //this.cameraHelper.update();
    //   this.renderer.toneMappingExposure = Math.pow( this.debugObject.exposure, 5.0 ); // to allow for very bright scenes.


    this.bulbLight.position.y = (Math.cos(elapsedTime) * 0.75 + 0.75) / 3 + 0.1;
    this.stats.end();

    // console.log(this.camera.position)
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


    /*
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = Math.pow(1.1, 5.0); // to allow for very bright scenes.
    */

    //Clear Color
    this.renderer.setClearColor(new THREE.Color('grey'));

    // Must change component
    let component: TilesComponent = this;
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
