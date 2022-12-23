import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as lilGui from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-lesson-seventeen',
  templateUrl: './lesson-seventeen.component.html',
  styleUrls: ['./lesson-seventeen.component.css']
})
export class LessonSeventeenComponent implements OnInit, AfterViewInit {


  // Debug variables
  private gui = new lilGui.GUI();
  // Fog
  private fog = new THREE.Fog('#262837', 1, 15);
  // Loading Manager
  private loadingManager = new THREE.LoadingManager();
  // Textures
  private textureLoader = new THREE.TextureLoader(this.loadingManager);
  // Load all the door textures
  private doorColorTexture = this.textureLoader.load('../../assets/images/door/color.jpg');
  private doorAlphaTexture = this.textureLoader.load('../../assets/images/door/alpha.jpg');
  private doorHeightTexture = this.textureLoader.load('../../assets/images/door/height.jpg');
  private doorNormalTexture = this.textureLoader.load('../../assets/images/door/normal.jpg');
  private doorMetalnessTexture = this.textureLoader.load('../../assets/images/door/metalness.jpg');
  private doorRoughnessTexture = this.textureLoader.load('../../assets/images/door/roughness.jpg');
  private doorAmbientOcclusionTexture = this.textureLoader.load('../../assets/images/door/ambientOcclusion.jpg');

  // Load all the brick textures
  private bricksColorTexture = this.textureLoader.load('../../assets/images/bricks/color.jpg');
  private bricksAmbientOcclusionTexture = this.textureLoader.load('../../assets/images/bricks/ambientOcclusion.jpg');
  private bricksNormalTexture = this.textureLoader.load('../../assets/images/bricks/normal.jpg');
  private bricksRoughnessTexture = this.textureLoader.load('../../assets/images/bricks/roughness.jpg');
  // Load all the grass textures
  private grassColorTexture = this.textureLoader.load('../../assets/images/grass/color.jpg');
  private grassAmbientOcclusionTexture = this.textureLoader.load('../../assets/images/grass/ambientOcclusion.jpg');
  private grassNormalTexture = this.textureLoader.load('../../assets/images/grass/normal.jpg');
  private grassRoughnessTexture = this.textureLoader.load('../../assets/images/grass/roughness.jpg');


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


  private house = new THREE.Group();
  private graves = new THREE.Group();
  // Walls
  private walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
      map: this.bricksColorTexture,
      aoMap: this.bricksAmbientOcclusionTexture,
      normalMap: this.bricksNormalTexture,
      roughnessMap: this.bricksRoughnessTexture
    })
  );
  private roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({color: '#b35f45'})
  );
  private door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: this.doorColorTexture,
      transparent: true,
      alphaMap: this.doorAlphaTexture,
      aoMap: this.doorAmbientOcclusionTexture,
      displacementMap: this.doorHeightTexture,
      displacementScale: 0.1,
      normalMap: this.doorNormalTexture,
      metalnessMap: this.doorMetalnessTexture,
      roughnessMap: this.doorRoughnessTexture
    })
  );
  // Add bushes and use the same geometry and same material
  private bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
  private bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'});
  private bush1 = new THREE.Mesh(this.bushGeometry, this.bushMaterial);
  private bush2 = new THREE.Mesh(this.bushGeometry, this.bushMaterial);
  private bush3 = new THREE.Mesh(this.bushGeometry, this.bushMaterial);
  private bush4 = new THREE.Mesh(this.bushGeometry, this.bushMaterial);
  // one geometry and material for all the grave meshes
  private graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
  private graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'});


  private floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      map: this.grassColorTexture,
      aoMap: this.grassAmbientOcclusionTexture,
      normalMap: this.grassNormalTexture,
      roughnessMap: this.grassRoughnessTexture
    })
  );


  // Light objects
  private ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
  private doorLight = new THREE.PointLight('#ff7d46', 1, 7);
  private moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);

  // Ghost Lights
  private ghost1 = new THREE.PointLight('#62c42d', 2, 3);
  private ghost2 = new THREE.PointLight('#64ccd4', 2, 3);
  private ghost3 = new THREE.PointLight('#149efc', 2, 3);
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
    this.door.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(this.door.geometry.attributes.uv.array, 2)
    );
    this.walls.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(this.walls.geometry.attributes.uv.array, 2)
    );
    this.floor.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(this.floor.geometry.attributes.uv.array, 2)
    );
  }

  // Add all the graves to the scene around the house
  private addGraves() {
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 6;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const grave = new THREE.Mesh(this.graveGeometry, this.graveMaterial);
      grave.position.set(x, 0.3, z);
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      // Make grave have shadow
      grave.castShadow = true;
      this.graves.add(grave);
    }
  }

  private editFloor() {
    this.grassColorTexture.repeat.set(8, 8);
    this.grassNormalTexture.repeat.set(8, 8);
    this.grassAmbientOcclusionTexture.repeat.set(8, 8);
    this.grassRoughnessTexture.repeat.set(8, 8);

    this.grassColorTexture.wrapS = THREE.RepeatWrapping;
    this.grassNormalTexture.wrapS = THREE.RepeatWrapping;
    this.grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    this.grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
    this.grassColorTexture.wrapT = THREE.RepeatWrapping;
    this.grassNormalTexture.wrapT = THREE.RepeatWrapping;
    this.grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
    this.grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
  }

  /*
  * modify the objects
  *
  */
  private modifyObjects() {
    //Adjust Object Positions
    this.walls.position.y = 1.25
    this.roof.rotation.y = Math.PI * 0.25;
    this.roof.position.y = 2.5 + 0.5;
    this.door.position.y = 1;
    this.door.position.z = 2 + 0.01;

    // Bushes
    this.bush1.scale.set(0.5, 0.5, 0.5);
    this.bush1.position.set(0.8, 0.2, 2.2);
    this.bush2.scale.set(0.4, 0.4, 0.4);
    this.bush2.position.set(1.4, 0.1, 2.1);
    this.bush3.scale.set(0.4, 0.4, 0.4);
    this.bush3.position.set(-0.8, 0.1, 2.2);
    this.bush4.scale.set(0.15, 0.15, 0.15);
    this.bush4.position.set(-1, 0.05, 2.6);
    this.floor.rotation.x = -Math.PI * 0.5;
    this.floor.position.y = 0;

    // Scale

    // Rotation

    // Textures


    // Lights
    this.moonLight.position.set(4, 5, -2);
    // position above door
    this.doorLight.position.set(0, 2.2, 2.7);
    // Shadows
    // cast shadows
    this.moonLight.castShadow = true;
    this.doorLight.castShadow = true;
    this.ghost1.castShadow = true;
    this.ghost2.castShadow = true;
    this.ghost3.castShadow = true;
    this.walls.castShadow = true;
    this.bush1.castShadow = true;
    this.bush2.castShadow = true;
    this.bush3.castShadow = true;
    //receive shadows
    this.floor.receiveShadow = true;

    // Optimize shadows
    this.moonLight.shadow.mapSize.width = 256;
    this.moonLight.shadow.mapSize.height = 256;
    this.moonLight.shadow.camera.far = 7;

    this.ghost1.shadow.mapSize.width = 256;
    this.ghost1.shadow.mapSize.height = 256;
    this.ghost1.shadow.camera.far = 7;
    this.ghost2.shadow.mapSize.width = 256;
    this.ghost2.shadow.mapSize.height = 256;
    this.ghost2.shadow.camera.far = 7;
    this.ghost3.shadow.mapSize.width = 256;
    this.ghost3.shadow.mapSize.height = 256;
    this.ghost3.shadow.camera.far = 7;

  }

  /*
 * modify the scene
 *
 */
  private modifyScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#262837');
  }

  /*
 * modify the camera
 *
 */
  private modifyCamera() {
    this.camera.position.set(4, 2, 5);

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
    this.gui.add(this.ambientLight, 'intensity')
      .min(0)
      .max(1)
      .step(0.001);
    this.gui.add(this.moonLight, 'intensity')
      .min(0)
      .max(1)
      .step(0.001);
    this.gui.add(this.moonLight.position, 'x')
      .min(-5)
      .max(5)
      .step(0.001);
    this.gui.add(this.moonLight.position, 'y')
      .min(-5)
      .max(5)
      .step(0.001);
    this.gui.add(this.moonLight.position, 'z')
      .min(-5)
      .max(5)
      .step(0.001);

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
    // Add Objects to the group
    this.house.add(this.walls);
    this.house.add(this.roof);
    this.house.add(this.door);
    this.house.add(this.bush1, this.bush2, this.bush3, this.bush4);
    this.house.add(this.doorLight);
    // Graves
    this.addGraves();
    //Add Objects to the scene
    this.scene.add(this.ambientLight,
      this.moonLight,
      this.ghost1,
      this.ghost2,
      this.ghost3
    );

    this.editFloor();
    this.scene.add(this.floor);
    this.scene.add(this.house);
    this.scene.add(this.graves);
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

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    // Update Objects


    // Update Camera
    // Animate Ghosts
    const ghost1Angle = elapsedTime * 0.5;
    this.ghost1.position.set(
      Math.cos(ghost1Angle) * 4,
      Math.sin(elapsedTime * 3),
      Math.sin(ghost1Angle) * 4
    );
    const ghost2Angle = -elapsedTime * 0.32;
    this.ghost2.position.set(
      Math.cos(ghost2Angle) * 5,
      Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2.5),
      Math.sin(ghost1Angle) * 4
    );
    const ghost3Angle = -elapsedTime * 0.32;
    this.ghost3.position.set(
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32)),
      Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2),
      Math.sin(ghost3Angle) * 4 + (7 + Math.sin(elapsedTime * 0.5))
    );
    // Update Controls
    this.controls.update();

  }

  /*
  * Start The Renderer
  *
  */
  private startRenderingLoop() {
    // fog has to be the first thing called
    this.scene.fog = this.fog;
    // Renderer
    // use canvas element in template

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Change the clearColor of the render, cant see edges
    this.renderer.setClearColor('#262837', 0);
    this.renderer.setSize(this.width, this.height);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type =THREE.PCFSoftShadowMap;
    // Must change component
    let component: LessonSeventeenComponent = this;
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
