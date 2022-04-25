import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as lilGui from 'lil-gui';
import gsap from 'gsap';

//import imageSource from '/color.jpg';
@Component({
  selector: 'app-lesson-eleven',
  templateUrl: './lesson-eleven.component.html',
  styleUrls: ['./lesson-eleven.component.css']
})
export class LessonElevenComponent implements OnInit, AfterViewInit {


  // Debug variables 
  private gui = new lilGui.GUI();
  private parameters = {
    color: 0xff0000,
    spin: () => {
      gsap.to(this.mesh.rotation, { duration: 1, y: this.mesh.rotation.y + Math.PI * 2 });
    }
  };

  // Textures
  private textureLoader = new THREE.TextureLoader();
  private texture = this.textureLoader.load('../../assets/images/door/color.jpg',
    () => {
      console.log('load finished');
    },
    () => {
      console.log('progress');
    },
    () => {
      console.log('error');
    }
  );


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
  @HostListener('document:keypress', ['$event'])
  onHideEvent(event: KeyboardEvent) {
    if (event.key === 'h') {
      if (this.gui._hidden) {
        this.gui.show();
      }
      else {
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

  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshBasicMaterial({ map: this.texture });
  private mesh: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);


  // Initialise renderer 
  private renderer!: THREE.WebGLRenderer;
  // Initialise scence 
  private scene!: THREE.Scene;



  /*
   * Set Geometry Attribute on geometry
   */
  private setGeometryAttributes() {
    // Set Geometry attribute


  }
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
   * Add Debug Tweaks 
   *
  */
  private modifyDebugGUI() {
    this.gui.add(this.mesh.position, 'y')
      .min(-3)
      .max(3)
      .step(0.01)
      .name('elevation');

    this.gui.add(this.mesh, 'visible');
    this.gui.add(this.material, 'wireframe');

    this.gui.addColor(this.parameters, 'color')
      .onChange(() => {
        this.material.color.set(this.parameters.color);
      });

    this.gui.add(this.parameters, 'spin')
      .name('Spin Cube');
  }
  /*
  * Create the scene
  *
  */
  private createScene() {
   
    // Geometry
    this.setGeometryAttributes();
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

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setSize(this.width, this.height);
    // Must change component
    let component: LessonElevenComponent = this;
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