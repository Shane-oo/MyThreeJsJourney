import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as lilGui from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-lesson-nineteen',
  templateUrl: './lesson-nineteen.component.html',
  styleUrls: ['./lesson-nineteen.component.css']
})
export class LessonNineteenComponent implements OnInit, AfterViewInit {


  // Debug variables
  private gui = new lilGui.GUI({width: 500});


  // Loading Manager
  private loadingManager = new THREE.LoadingManager();
  // Textures
  private textureLoader = new THREE.TextureLoader(this.loadingManager);
//../../assets/images/bakedShadows/bakedShadow.jpg
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
  // Points Material


  // Light objects

  // Helpers

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

    // Scale

    // Rotation

    // Textures


    // Lights

    // Shadows
    // Cast shadows

    // spot light


    //point light

    // ReceiveShadows


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
    this.camera.position.set(3, 2, -0.5);

  }

  /*
   * Add Controls
  */
  private modifyControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    //controls.target.y = 2;
    this.controls.enableDamping = true;
  }


  private parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
  };
  private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
  private material: THREE.PointsMaterial = new THREE.PointsMaterial();
  private points: THREE.Points = new THREE.Points();

  private generateGalaxy = () => {


    if (this.points !== null) {
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.points);
    }

    const positions = new Float32Array(this.parameters.count * 3);
    const colors = new Float32Array(this.parameters.count * 3);
    const colorInside = new THREE.Color(this.parameters.insideColor);
    const colorOutside = new THREE.Color(this.parameters.outsideColor);

    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * this.parameters.radius;
      const spinAngle = radius * this.parameters.spin;
      const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2;

      const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
      const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;


      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside,radius/this.parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.material = new THREE.PointsMaterial({
      size: this.parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
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

  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    // Update Objects

    // Update Camera
    //this.points.rotation.z = elapsedTime *0.01;
    this.points.rotation.y = elapsedTime *0.1;

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
    // Activate shadow map

    // Must change component
    let component: LessonNineteenComponent = this;
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
