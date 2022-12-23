import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-lesson-seven',
  templateUrl: './lesson-seven.component.html',
  styleUrls: ['./lesson-seven.component.css']
})
export class LessonSevenComponent implements OnInit, AfterViewInit {

  private width = 800;
  private height = 600;
  // Cursor
  private cursor = {
    x: 0,
    y:0
  };

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent): void {
    this.cursor.x = event.clientX / this.width - 0.5;
    this.cursor.y = -( event.clientY / this.height - 0.5);
    
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
  private controls!:OrbitControls;
  //private aspectRatio = 800 / 600;
  //private camera = new THREE.OrthographicCamera(
  //  -1 * this.aspectRatio,
  //  1 * this.aspectRatio,
  //  1,
  //  -1,
  //  0.1,
  //  100);
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
    //this.camera.position.x = Math.sin(this.cursor.x * Math.PI * 2) * 2;
    //this.camera.position.z = Math.cos(this.cursor.x * Math.PI * 2)*2;
    //this.camera.position.y = this.cursor.y * 5;

    //this.camera.lookAt(this.mesh.position);

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
    this.renderer.setSize(800, 600);
    // Must change component
    let component: LessonSevenComponent = this;
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



