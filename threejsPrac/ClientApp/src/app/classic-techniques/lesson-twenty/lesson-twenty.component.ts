import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as lilGui from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-lesson-twenty',
  templateUrl: './lesson-twenty.component.html',
  styleUrls: ['./lesson-twenty.component.css']
})
export class LessonTwentyComponent implements OnInit, AfterViewInit {


  // Debug variables
  private gui = new lilGui.GUI({width: 500}).hide();


  // Loading Manager
  private loadingManager = new THREE.LoadingManager();
  // Textures
  private textureLoader = new THREE.TextureLoader(this.loadingManager);

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

  private mouse = new THREE.Vector2();

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / this.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.height) * 2 + 1;

  }
  @HostListener('dblclick', ['$event'])
  onMouseClick(event: MouseEvent) {
      console.log('double')
      console.log(this.currentIntersect.object);
      //if(this.currentIntersect){
        if(this.currentIntersect.object === this.object1){
          this.object1.material.color.set('pink');

        }
        else if(this.currentIntersect.object === this.object2){
          this.object2.material.color.set('pink');

        }
        else{
          this.object3.material.color.set('pink');

        }
      //}
  }

  /*@HostListener('dblclick', ['$event'])
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
  }*/

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
  private object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({color: 'red'})
  );
  private object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({color: 'red'})
  );
  private object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({color: 'red'})
  );

  private raycaster = new THREE.Raycaster();

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

  private setRayCaster() {


  }

  /*
  * modify the objects
  *
  */
  private modifyObjects() {
    //Adjust Object Positions
    this.object1.position.x = -2;
    this.object3.position.x = 2;
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
    this.camera.position.set(0, 0, 3);

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
    // Raycaster
    this.setRayCaster();

    // Camera
    this.modifyCamera();

    //Add Objects to the scene

    this.scene.add(this.camera);
    this.scene.add(this.object1, this.object2, this.object3);
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
  private currentIntersect:any;
  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    // Update Objects
    this.object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    this.object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    this.object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;


    this.raycaster.setFromCamera(this.mouse,this.camera);

    const objectsToTest = [this.object1,this.object2,this.object3];
    //const intersects = this.raycaster.intersectObjects(objectsToTest);
    for(const object of objectsToTest){
      object.material.color.set('#ff0000');
      const intersects = this.raycaster.intersectObject(object);
      if(intersects.length!=0){
        if(!this.currentIntersect) {
            object.material.color.set('blue');
        }
        this.currentIntersect = intersects[0];
      }
      else{
        if(this.currentIntersect){
        }
        this.currentIntersect = null;
      }
    }

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

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.setSize(this.width, this.height);
    // Activate shadow map

    // Must change component
    let component: LessonTwentyComponent = this;
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
