import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import gsap from 'gsap';
@Component({
  selector: 'app-lesson-six',
  templateUrl: './lesson-six.component.html',
  styleUrls: ['./lesson-six.component.css']
})
export class LessonSixComponent implements OnInit, AfterViewInit {
  
  // Get Canvas 
  @ViewChild('canvas')
  private canvasRef!: ElementRef;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  // Initialise global variables
  // Initialise camera variables
  private camera = new THREE.PerspectiveCamera(75, 800 / 600);
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
    //this.camera.lookAt(this.mesh.position);
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
  }

  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();

  private animateCube() {

    //gsap.to(this.mesh.position, { duration: 1, delay: 1, x: 2 });

    // Time 
    const elapsedTime = this.clock.getElapsedTime();
    
    // One revolution per second
    //this.mesh.rotation.y = elapsedTime * (Math.PI * 2);
    this.camera.position.y = Math.sin(elapsedTime);
    this.camera.position.x = Math.cos(elapsedTime);
    this.camera.lookAt(this.mesh.position);

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
    let component: LessonSixComponent = this;
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



