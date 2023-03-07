import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { Mesh, MeshStandardMaterial, RepeatWrapping, sRGBEncoding } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as lilGui from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

//@ts-ignore
import { LoopSubdivision } from 'three-subdivide';

@Component({
             selector: 'app-roof',
             templateUrl: './roof.component.html',
             styleUrls: ['./roof.component.css']
           })
export class RoofComponent implements OnInit, AfterViewInit {
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
  private directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  private directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 0.2);
  private directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
  private directionalLight2Helper = new THREE.DirectionalLightHelper(this.directionalLight2, 0.2);

  // gui
  private gui = new lilGui.GUI({width: 1000});
  private debugObject = {
    showSimplePlanes: false,
    showOnlyDiffuseMapRoof: true,
    showDiffuseAndNormalMapRoof: true,
    wireframeForDiffuseAndNormalMapRoof: false,
    wireframeForDisplacementMapRoof: false
  };
  // GLTF Loader
  private gltfLoader = new GLTFLoader();
  // Texture
  private textureLoader = new THREE.TextureLoader();
  // Textures
  private roofMap = this.textureLoader.load('/assets/images/roof/profRoof/TexturesCom_Metal_Corrugated_512_albedo.jpg');
  private roofNormalMap = this.textureLoader.load('/assets/images/roof/profRoof/TexturesCom_Metal_Corrugated_512_normal.jpg');
  private displacementMap = this.textureLoader.load('/assets/images/roof/profRoof/TexturesCom_Metal_Corrugated_512_height.jpg');
  private roughnessMap = this.textureLoader.load('/assets/images/roof/profRoof/TexturesCom_Metal_Corrugated_512_roughness.jpg');
  private metallicMap = this.textureLoader.load('/assets/images/roof/profRoof/TexturesCom_Metal_Corrugated_512_metallic.jpg');
  private aoMap = this.textureLoader.load('/assets/images/roof/profRoof/TexturesCom_Metal_Corrugated_512_ao.jpg');
  // Materials
  private material1 = new THREE.MeshStandardMaterial({map: this.roofMap, side: THREE.DoubleSide});
  private material2 = new THREE.MeshStandardMaterial({
                                                       map: this.roofMap,
                                                       side: THREE.DoubleSide,
                                                       normalMap: this.roofNormalMap
                                                     });
  private material3 = new THREE.MeshStandardMaterial({
                                                       map: this.roofMap,
                                                       side: THREE.DoubleSide,
                                                       normalMap: this.roofNormalMap,
                                                       displacementMap: this.displacementMap,
                                                       displacementScale: 0.3
                                                     });
  private material4 = new THREE.MeshStandardMaterial({
                                                       map: this.roofMap,
                                                       side: THREE.DoubleSide,
                                                       normalMap: this.roofNormalMap,
                                                       displacementMap: this.displacementMap,
                                                       displacementScale: 0.3,
                                                       roughnessMap: this.roughnessMap
                                                     });
  private material5 = new THREE.MeshStandardMaterial({
                                                       map: this.roofMap,
                                                       side: THREE.DoubleSide,
                                                       normalMap: this.roofNormalMap,
                                                       displacementMap: this.displacementMap,
                                                       displacementScale: 0.3,
                                                       roughnessMap: this.roughnessMap,
                                                       metalnessMap: this.metallicMap
                                                     });
  private material6 = new THREE.MeshStandardMaterial({
                                                       map: this.roofMap,
                                                       side: THREE.DoubleSide,
                                                       normalMap: this.roofNormalMap,
                                                       displacementMap: this.displacementMap,
                                                       displacementScale: 0.3,
                                                       roughnessMap: this.roughnessMap,
                                                       metalnessMap: this.metallicMap,
                                                       aoMap: this.aoMap
                                                     });
  // Planes
  private planeGeometry = new THREE.PlaneBufferGeometry(2, 2, 512, 512);
  private plane1 = new THREE.Mesh(this.planeGeometry, this.material1);
  private plane2 = new THREE.Mesh(this.planeGeometry, this.material2);
  private plane3 = new THREE.Mesh(this.planeGeometry, this.material3);
  private plane4 = new THREE.Mesh(this.planeGeometry, this.material4);
  private plane5 = new THREE.Mesh(this.planeGeometry, this.material5);
  private plane6 = new THREE.Mesh(this.planeGeometry, this.material6);


  private roof1 = new THREE.Mesh();
  private roof2 = new THREE.Mesh();
  private roof3 = new THREE.Mesh();

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

    this.stats.domElement.remove();

  }

  private showSimplePlanes = (value: boolean) => {

    //todo hide roofs
    if(this.plane1 && this.plane2 && this.plane3 && this.plane4 && this.plane5) {
      this.plane1.visible = value;
      this.plane2.visible = value;
      this.plane3.visible = value;
      this.plane4.visible = value;
      this.plane5.visible = value;
      this.plane6.visible = value;

    }

  };

  private setEffectComposer() {

  }

  /*
   * Loading Manager Functions
  */
  private setLoadingManager() {

  }

  private LoadModels() {

    this.gltfLoader.load('/assets/models/prac/Roof.gltf',
                         (gltf) => {
                                                      console.log(gltf);
                                                      const roof = gltf.scene.children[0] as Mesh;
                                                      this.roof1 = new THREE.Mesh(roof.geometry, this.material1);

                                                      this.scene.add(this.roof1);

                                                      this.roof2 = new THREE.Mesh(roof.geometry, this.material2);
                                                      this.roof2.position.z += 15;
                                                      this.scene.add(this.roof2);


                                                      const iterations = 3;
                                                      const params = {
                                                        split:          true,       // optional, default: true
                                                        uvSmooth:       true,      // optional, default: false
                                                        preserveEdges:  false,      // optional, default: false
                                                        flatOnly:       true,      // optional, default: false
                                                        maxTriangles:   Infinity,   // optional, default: Infinity
                                                      };

                                                      const subDividedGeometry = LoopSubdivision.modify(roof.geometry,iterations,params);

                                                      this.roof3 = new THREE.Mesh(subDividedGeometry, this.material3);
                                                      this.roof3.position.z += 30;
                                                      this.scene.add(this.roof3);

                         });
  }

  /*
   * Set Geometry Attribute on geometry
   */
  private setGeometryAttributes() {
    // Set Geometry attribute

  }

  private modifyTextures() {
        this.roofMap.wrapS = this.roofMap.wrapT = RepeatWrapping;
        this.roofMap.anisotropy = 4;
        this.roofMap.flipY = false;
        this.roofMap.repeat.set(2, 2);
        this.roofMap.offset.set(0, 0);
        this.roofMap.encoding = sRGBEncoding;

        this.roofNormalMap.wrapS = this.roofNormalMap.wrapT = RepeatWrapping;
        this.roofNormalMap.anisotropy = 4;
        this.roofNormalMap.flipY = false;
        this.roofNormalMap.repeat.set(2, 2);
        this.roofNormalMap.offset.set(0, 0);


        this.displacementMap.wrapS = this.displacementMap.wrapT = RepeatWrapping;
        this.displacementMap.anisotropy = 4;
        this.displacementMap.flipY = false;
        this.displacementMap.repeat.set(2, 2);
        this.displacementMap.offset.set(0, 0);
        this.displacementMap.encoding = sRGBEncoding;


        this.roughnessMap.wrapS = this.roughnessMap.wrapT = RepeatWrapping;
        this.roughnessMap.anisotropy = 4;
        this.roughnessMap.flipY = false;
        this.roughnessMap.repeat.set(2, 2);
        this.roughnessMap.offset.set(0, 0);
        this.roughnessMap.encoding = sRGBEncoding;

        this.metallicMap.wrapS = this.metallicMap.wrapT = RepeatWrapping;
        this.metallicMap.anisotropy = 4;
        this.metallicMap.flipY = false;
        this.metallicMap.repeat.set(2, 2);
        this.metallicMap.offset.set(0, 0);
        this.metallicMap.encoding = sRGBEncoding;

  }


  /*
  * modify the objects
  *
  */
  private modifyObjects() {
    this.plane6.geometry.attributes.uv2 = this.plane6.geometry.attributes.uv;

    // Modify Light
    this.directionalLight.position.set(0, 50, 0);
    this.directionalLight2.position.set(12, 1, 10);
    this.plane2.position.x += 3;
    this.plane3.position.x += 6;
    this.plane4.position.x += 9;
    this.plane5.position.x += 12;
    this.plane6.position.x += 15;

    // Roof Material
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
    // this.camera.position.set(1.42, 28.9, 33.3);
    //this.camera.position.set(0, 25, 0);
    this.camera.position.set(1, 0, 10);

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
    //   this.gui.close();

    this.showSimplePlanes(true);
    this.gui.add(this.debugObject, 'showSimplePlanes').onChange((value: boolean) => {
      this.showSimplePlanes(value);
    });

    this.gui.add(this.debugObject, 'showOnlyDiffuseMapRoof').onChange((value: boolean) => {
      this.roof1.visible = value;
    });

    this.gui.add(this.debugObject, 'showDiffuseAndNormalMapRoof').onChange((value: boolean) => {
      this.roof2.visible = value;
    });
    this.gui.add(this.debugObject, 'wireframeForDiffuseAndNormalMapRoof').onChange((value: boolean) => {
      const mat = this.roof2.material as MeshStandardMaterial;
      mat.wireframe = value;
    });
    this.gui.add(this.debugObject, 'wireframeForDisplacementMapRoof').onChange((value: boolean) => {
      const mat = this.roof3.material as MeshStandardMaterial;
      mat.wireframe = value;
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
    this.LoadModels();

    this.createStats();

    //Add Objects to the scene

    this.scene.add(this.camera);
    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLightHelper);
    this.scene.add(this.directionalLight2);
    this.scene.add(this.directionalLight2Helper);
    this.scene.add(this.plane1);
    this.scene.add(this.plane2);
    this.scene.add(this.plane3);
    this.scene.add(this.plane4);
    this.scene.add(this.plane5);
    this.scene.add(this.plane6);
    this.showSimplePlanes(false);
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

    this.stats.end();
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
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // Optimise Renderer shadow map
    // Only update the shadow once i.e. a non moving sun
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;


    //Clear Color
    this.renderer.setClearColor(new THREE.Color('grey'));

    // Must change component
    let component: RoofComponent = this;
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
