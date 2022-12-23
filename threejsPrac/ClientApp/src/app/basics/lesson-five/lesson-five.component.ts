import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";

@Component({
  selector: 'app-lesson-five',
  templateUrl: './lesson-five.component.html',
  styleUrls: ['./lesson-five.component.css']
})
export class LessonFiveComponent implements OnInit, AfterViewInit {

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

  // Initialise group1
  private group1 = new THREE.Group();
  private cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color:'blue'})
  );
  private cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'green' })
  );
  private cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'purple' })
  );
  // Axes helper 
  private axesHelper = new THREE.AxesHelper(2);
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
    this.mesh.position.set(0.7, -0.6, 1);
    // Scale 
    this.mesh.scale.set(2, 0.5, 0.5);
    // Rotation
    this.mesh.rotation.reorder('YXZ');
    this.mesh.rotation.x = Math.PI * 0.25;
    this.mesh.rotation.y = Math.PI * 0.25;

    
    // modify group
    this.cube2.position.x = -2;
    this.cube3.position.x = 2;
    this.group1.add(this.cube1);
    this.group1.add(this.cube2);
    this.group1.add(this.cube3);

    this.group1.position.y = 1;
    this.group1.scale.z = 2;
    this.group1.rotation.y = 1;
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
    this.scene.add(this.axesHelper);
    this.scene.add(this.group1);
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
    let component: LessonFiveComponent = this;
    (function render() {
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
