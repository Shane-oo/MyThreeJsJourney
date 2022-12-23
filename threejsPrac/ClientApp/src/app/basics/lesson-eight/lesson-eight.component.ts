import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-lesson-eight',
  templateUrl: './lesson-eight.component.html',
  styleUrls: ['./lesson-eight.component.css']
})
export class LessonEightComponent implements OnInit, AfterViewInit {

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
      this.canvas.requestFullscreen();
    }
    else {
      document.exitFullscreen();
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

  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshBasicMaterial({ color: 'red' });
  private mesh: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);


  // Initialise renderer 
  private renderer!: THREE.WebGLRenderer;
  // Initialise scence
  private scene!: THREE.Scene;

  /*
  * Modifify the objects
  *
  */
  private modifiyObjects() {
    //Position

    // Scale 

    // Rotation

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
    this.camera.lookAt(this.mesh.position);

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
  * Create the scene
  *
  */
  private createScene() {
    // Objects 
    this.modifiyObjects();
    // Scene   
    this.modifiyScene();

    // Camera  
    this.modifiyCamera();

    //Add Objects to the scene

    this.scene.add(this.mesh);
    this.scene.add(this.camera);

    // Call add Controls to canvas
    this.modifyControls();
  }

  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();

  private animateCube() {
    // Time 
    const elapsedTime = this.clock.getElapsedTime();
    //this.mesh.rotation.y = elapsedTime;

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

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

    this.renderer.setSize(this.width, this.height);
    // Must change component
    let component: LessonEightComponent = this;
    (function render() {
      //console.log('tick');
      requestAnimationFrame(render);
      // Call animation Functions 
      component.animateCube();

      // render renderer
      component.renderer.render(component.scene, component.camera);
    }());
  }

  constructor() { }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    // call needed functions
    this.createScene();
    this.startRenderingLoop();
  }

}



