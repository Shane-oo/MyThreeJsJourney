import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit, AfterViewInit {

  // Get Canvas
  @ViewChild('canvas')
  private canvasRef!: ElementRef;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  // Initialise global variables
  // Initialise camera variables
  private camera!: THREE.PerspectiveCamera;
  //Initialise object variables 
  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshBasicMaterial({ color: 'red' });
  private mesh: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  // Initialise renderer
  private renderer!: THREE.WebGLRenderer;
  // Initialise scence
  private scene!: THREE.Scene;

  /*
  * Create the scene
  *
  */
  private createScene() {
    // Scene 
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('black');
    this.scene.add(this.mesh);
    // Camera  
    this.camera = new THREE.PerspectiveCamera(75, 800 / 600);
    this.camera.position.z = 3;
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
    let component: TemplateComponent = this;
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
