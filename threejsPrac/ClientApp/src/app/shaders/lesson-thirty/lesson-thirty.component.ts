import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as lilGui from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//@ts-ignore
import vertexShader from '../../../assets/shaders/galaxy/vertex.glsl';
//@ts-ignore
import fragmentShader from '../../../assets/shaders/galaxy/fragment.glsl';

@Component({
             selector: 'app-lesson-thirty',
             templateUrl: './lesson-thirty.component.html',
             styleUrls: ['./lesson-thirty.component.css']
           })
export class LessonThirtyComponent implements OnInit, AfterViewInit {
  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();
  // gui
  private gui = new lilGui.GUI({width: 200});

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
  private pixelRatio: number = 1;
  // Initialise scene
  private scene!: THREE.Scene;

  //Initialise object variables
  private oldElapsedTime = 0;
  // Galaxy
  private parameters = {
    count: 200000,
    size: 0.005,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.5,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
  };
  private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
  private material: THREE.ShaderMaterial = new THREE.ShaderMaterial({
                                                                      depthWrite: false,
                                                                      blending: THREE.AdditiveBlending,
                                                                      vertexColors: true,
                                                                      vertexShader: vertexShader,
                                                                      fragmentShader: fragmentShader,
                                                                      uniforms: {
                                                                        uSize: {value: 30 * this.pixelRatio},
                                                                        uTime: {value: 0}
                                                                      }
                                                                    });

  private points: THREE.Points = new THREE.Points(this.geometry, this.material);

  private positions = new Float32Array(this.parameters.count * 3);
  private colors = new Float32Array(this.parameters.count * 3);
  private scales = new Float32Array(this.parameters.count);

  private randomness = new Float32Array(this.parameters.count * 3);

  private insideColor = new THREE.Color(this.parameters.insideColor);
  private outsideColor = new THREE.Color(this.parameters.outsideColor);

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

  private generateGalaxy = () => {


    if(this.points !== null) {
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.points);
    }


    for(let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * this.parameters.radius;
      const spinAngle = radius * this.parameters.spin;
      const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2;


      this.positions[i3] = Math.cos(branchAngle) * radius;
      this.positions[i3 + 1] = 0;
      this.positions[i3 + 2] = Math.sin(branchAngle) * radius;

      const randomX = Math.pow(Math.random(), this.parameters.randomnessPower)
                      * (Math.random() < 0.5 ? 1 : -1)
                      * this.parameters.randomness
                      * radius;
      const randomY = Math.pow(Math.random(), this.parameters.randomnessPower)
                      * (Math.random() < 0.5 ? 1 : -1)
                      * this.parameters.randomness
                      * radius;
      const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower)
                      * (Math.random() < 0.5 ? 1 : -1)
                      * this.parameters.randomness
                      * radius;

      this.randomness[i3] = randomX;
      this.randomness[i3 + 1] = randomY;
      this.randomness[i3 + 2] = randomZ;


      const mixedColor = this.insideColor.clone();
      mixedColor.lerp(this.outsideColor, radius / this.parameters.radius);

      this.colors[i3] = mixedColor.r;
      this.colors[i3 + 1] = mixedColor.g;
      this.colors[i3 + 2] = mixedColor.b;

      this.scales[i] = Math.random();
    }
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(this.scales, 1));
    this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(this.randomness, 3));

    this.scene.add(this.points);
  };

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
    this.camera.position.set(3, 3, 3);

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

    this.gui.add(this.parameters, 'count')
        .min(100)
        .max(1000000)
        .step(100)
        .onFinishChange(this.generateGalaxy);
    this.gui.add(this.parameters, 'size')
        .min(0.01)
        .max(0.1)
        .step(0.001)
        .onFinishChange(this.generateGalaxy);
    this.gui.add(this.parameters, 'radius')
        .min(0.01)
        .max(20)
        .step(0.01)
        .onFinishChange(this.generateGalaxy);
    this.gui.add(this.parameters, 'branches')
        .min(2)
        .max(30)
        .step(1)
        .onFinishChange(this.generateGalaxy);
    this.gui.add(this.parameters, 'spin')
        .min(-5)
        .max(5)
        .step(0.001)
        .onFinishChange(this.generateGalaxy);
    this.gui.add(this.parameters, 'randomness')
        .min(0)
        .max(2)
        .step(0.001)
        .onFinishChange(this.generateGalaxy);
    this.gui.add(this.parameters, 'randomnessPower')
        .min(1)
        .max(10)
        .step(0.001)
        .onFinishChange(this.generateGalaxy);
    this.gui.addColor(this.parameters, 'insideColor')
        .onFinishChange(this.generateGalaxy);
    this.gui.addColor(this.parameters, 'outsideColor')
        .onFinishChange(this.generateGalaxy);
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
    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();

    // generate galaxy
    this.generateGalaxy();
  }

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;

    // Update Material
    this.material.uniforms.uTime.value = elapsedTime;
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
    this.pixelRatio = this.renderer.getPixelRatio();

    this.renderer.setSize(this.width, this.height);

    // Must change component
    let component: LessonThirtyComponent = this;
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
