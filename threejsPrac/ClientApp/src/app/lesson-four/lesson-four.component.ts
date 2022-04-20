import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";

@Component({
  selector: 'app-lesson-four',
  templateUrl: './lesson-four.component.html',
  styleUrls: ['./lesson-four.component.css']
})
export class LessonFourComponent implements OnInit, AfterViewInit {

  
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  private camera!: THREE.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }


  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshBasicMaterial({ color: 'red' });

  private mesh: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  /**
  * Create the scene
  *
  * @private
  * @memberof CubeComponent
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

 


  private startRenderingLoop() {
    // Renderer
    // use canvas element in template

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(800, 600);

  let component: LessonFourComponent = this;
    (function render() {
      requestAnimationFrame(render);
      
      component.renderer.render(component.scene, component.camera);
    }());
  }

  constructor() { }

  ngOnInit(): void {
    
  }
  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }
}
