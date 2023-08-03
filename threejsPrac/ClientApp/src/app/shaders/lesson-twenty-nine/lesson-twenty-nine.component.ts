import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//@ts-ignore
import vertexShader from '../../../assets/shaders/water/vertex.glsl';
//@ts-ignore
import fragmentShader from '../../../assets/shaders/water/fragment.glsl';

import * as lilGui from 'lil-gui';
@Component({
             selector: 'app-lesson-twenty-nine',
             templateUrl: './lesson-twenty-nine.component.html',
             styleUrls: ['./lesson-twenty-nine.component.css']
           })
export class LessonTwentyNineComponent implements OnInit, AfterViewInit {
  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();
  // gui
  private gui = new lilGui.GUI({width: 300});
  private debugObject = {
    depthColor: '#186691',
    surfaceColor: '#9bd8ff'
  };
  private width = window.innerWidth;

  //test mesh
  private height = window.innerHeight;
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

  // textures
  private textureLoader = new THREE.TextureLoader();

  // geometry
  private waterGeometry = new THREE.PlaneGeometry(3, 3, 512, 512);

  // material
  private waterMaterial = new THREE.ShaderMaterial({
                                                     vertexShader: vertexShader,
                                                     fragmentShader: fragmentShader,
                                                     uniforms: {
                                                       uTime: {value: 0},

                                                       uBigWavesSpeed: {value: 0.75},
                                                       uBigWavesElevation: {value: 0.2},
                                                       uBigWavesFrequency: {value: new THREE.Vector2(4, 1.5)},

                                                       uSmallWavesElevation: {value: 0.15},
                                                       uSmallWavesFrequency: {value: 3},
                                                       uSmallWavesSpeed: {value: 0.2},
                                                       uSmallIterations: {value: 4.0},

                                                       uDepthColor: {value: new THREE.Color(this.debugObject.depthColor)},
                                                       uSurfaceColor: {value: new THREE.Color(this.debugObject.surfaceColor)},
                                                       uColorOffset: {value: 0.08},
                                                       uColorMultiplier: {value: 5.0}


                                                     }
                                                   });
  // mesh
  private water = new THREE.Mesh(this.waterGeometry, this.waterMaterial);


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
    this.gui.destroy();
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

  /*
  * modify the objects
  *
  */
  private modifyObjects() {

    this.water.rotation.x = -Math.PI * 0.5;
  }

  private modifyPhysics() {

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
    this.camera.position.set(1, 1, 1);

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

    this.gui.add(this.waterMaterial.uniforms.uBigWavesElevation, 'value')
        .min(0)
        .max(1)
        .step(0.001)
        .name('uBigWavesElevation');
    this.gui.add(this.waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
        .min(0)
        .max(10)
        .step(0.001)
        .name('uBigWavesFrequencyX');
    this.gui.add(this.waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
        .min(0)
        .max(10)
        .step(0.001)
        .name('uBigWavesFrequencyY');
    this.gui.add(this.waterMaterial.uniforms.uBigWavesSpeed, 'value')
        .min(0.1)
        .max(4)
        .step(0.001)
        .name('uBigWavesSpeed');

    this.gui.addColor(this.debugObject, 'depthColor').onChange(() => {
      this.waterMaterial.uniforms.uDepthColor.value.set(this.debugObject.depthColor);
    });

    this.gui.addColor(this.debugObject, 'surfaceColor').onChange(() => {
      this.waterMaterial.uniforms.uSurfaceColor.value.set(this.debugObject.surfaceColor);
    });

    this.gui.add(this.waterMaterial.uniforms.uColorOffset, 'value')
        .min(0)
        .max(1)
        .step(0.001)
        .name('uColorOffset');
    this.gui.add(this.waterMaterial.uniforms.uColorMultiplier, 'value')
        .min(0)
        .max(10)
        .step(0.001)
        .name('uColorMultiplier');

    this.gui.add(this.waterMaterial.uniforms.uSmallWavesElevation, 'value')
        .min(0)
        .max(1)
        .step(0.001)
        .name('uSmallWavesElevation');
    this.gui.add(this.waterMaterial.uniforms.uSmallWavesFrequency, 'value')
        .min(0)
        .max(30)
        .step(0.001)
        .name('uSmallWavesFrequency');
    this.gui.add(this.waterMaterial.uniforms.uSmallWavesSpeed, 'value')
        .min(0)
        .max(4)
        .step(0.001)
        .name('uSmallWavesSpeed');
    this.gui.add(this.waterMaterial.uniforms.uSmallIterations, 'value')
        .min(0)
        .max(5)
        .step(1)
        .name('uSmallIterations');
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
    //Physics
    this.modifyPhysics();
    // Camera
    this.modifyCamera();

    //Add Objects to the scene

    this.scene.add(this.camera);
    this.scene.add(this.water);
    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();


  }

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;

    // Update Water
    this.waterMaterial.uniforms.uTime.value = elapsedTime;
    // Update Material

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

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setSize(this.width, this.height);
    // Activate shadow map
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Must change component
    let component: LessonTwentyNineComponent = this;
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
