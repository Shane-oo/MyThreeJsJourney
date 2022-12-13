import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as lilGui from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
             selector: 'app-practise',
             templateUrl: './practise.component.html',
             styleUrls: ['./practise.component.css']
           })
export class PractiseComponent implements OnInit, AfterViewInit {
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

  private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
  private material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({color:'red'});
  private mesh: THREE.Mesh = new THREE.Mesh(this.geometry,this.material);

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
    this.scene.add(this.mesh);
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
    this.pixelRatio = this.renderer.getPixelRatio();

    this.renderer.setSize(this.width, this.height);

    // Must change component
    let component: PractiseComponent = this;
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

