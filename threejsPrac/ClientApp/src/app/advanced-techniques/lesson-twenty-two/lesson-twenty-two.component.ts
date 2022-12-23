import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as lilGui from "lil-gui";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from 'cannon';

@Component({
  selector: 'app-lesson-twenty-two',
  templateUrl: './lesson-twenty-two.component.html',
  styleUrls: ['./lesson-twenty-two.component.css']
})
export class LessonTwentyTwoComponent implements OnInit, AfterViewInit {
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

  // Debug variables
  private gui = new lilGui.GUI({width: 200});
  private debugObject = {
    createSphere: () => {
      this.createSphere(Math.random() * 0.5,
        new THREE.Vector3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3))
    },
    createBox: () => {
      this.createBox(Math.random(), Math.random(), Math.random(),
        new THREE.Vector3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3))
    },
    reset: () => {
      for (let i = 1; i < this.objectsToUpdate.length; i++) {
        this.objectsToUpdate[i].body.removeEventListener('collide',this.playHitSound);
        this.world.remove(this.objectsToUpdate[i].body);
        this.scene.remove(this.objectsToUpdate[i].mesh);
      }
      this.objectsToUpdate.splice(0,this.objectsToUpdate.length);
    }
  };

  // Loading Manager
  private loadingManager = new THREE.LoadingManager();
  // Textures
  private textureLoader = new THREE.TextureLoader(this.loadingManager);
  private cubeTextureLoader = new THREE.CubeTextureLoader();

  private environmentMapTexture = this.cubeTextureLoader.load([
    './../assets/images/environmentMaps2/0/px.png',
    './../assets/images/environmentMaps2/0/nx.png',
    './../assets/images/environmentMaps2/0/py.png',
    './../assets/images/environmentMaps2/0/ny.png',
    './../assets/images/environmentMaps2/0/pz.png',
    './../assets/images/environmentMaps2/0/nz.png',
  ]);

  private hitSound = new Audio('../../assets/sounds/hit.mp3');
  private playHitSound = (collision: any) => {

    const impactStrength = collision.contact.getImpactVelocityAlongNormal();
    if (impactStrength > 1.5) {
      this.hitSound.volume = Math.random();
      this.hitSound.currentTime = 0;
      this.hitSound.play().then(r => {

      });
    }
  }
  //Physics
  private world = new CANNON.World();

  private defaultMaterial = new CANNON.Material('default');

  private defaultContactMaterial = new CANNON.ContactMaterial(
    this.defaultMaterial,
    this.defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.7
    }
  );

  // Sphere


  private floorShape = new CANNON.Plane();
  private floorBody = new CANNON.Body();


  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  // Initialise global variables
  // Initialise camera variables

  private camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
  private controls!: OrbitControls;

  //Initialise object variables


  private floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: '#777777',
      metalness: 0.3,
      roughness: 0.4,
      envMap: this.environmentMapTexture,
      envMapIntensity: 0.5
    })
  );

  private ambientLight = new THREE.AmbientLight(0xffffff, 0.7);

  private directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);


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

  /*
  * modify the objects
  *
  */
  private modifyObjects() {

    //Adjust Object Positions


    this.floor.receiveShadow = true
    this.floor.rotation.x = -Math.PI * 0.5;

    //Lights
    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    this.directionalLight.shadow.camera.far = 15
    this.directionalLight.shadow.camera.left = -7
    this.directionalLight.shadow.camera.top = 7
    this.directionalLight.shadow.camera.right = 7
    this.directionalLight.shadow.camera.bottom = -7
    this.directionalLight.position.set(5, 5, 5)
  }


  private modifyPhysics() {


    // Rotate floor body
    this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
    this.floorBody.mass = 0;
    this.floorBody.addShape(this.floorShape);

    this.world.gravity.set(0, -9.81, 0);
    this.world.addBody(this.floorBody);

    // Apply force on sphere

    this.world.defaultContactMaterial = this.defaultContactMaterial;
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;
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
    this.camera.position.set(-3, 3, 3);

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
    this.gui.add(this.debugObject, "createSphere");
    this.gui.add(this.debugObject, "createBox");
    this.gui.add(this.debugObject,"reset");
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
    this.scene.add(this.floor);
    this.scene.add(this.directionalLight, this.ambientLight);
    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();

    this.createSphere(0.5, new THREE.Vector3(0, 3, 0));

  }

  private parameters = {
    mesh: new THREE.Mesh(),
    body: new CANNON.Body()
  };

  private sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
  private sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: this.environmentMapTexture
  });
  private objectsToUpdate = [this.parameters];
  private createSphere = (radius: number, position: THREE.Vector3) => {
    // THREE.js mesh
    const mesh = new THREE.Mesh(
      this.sphereGeometry,
      this.sphereMaterial
    );
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position);
    this.scene.add(mesh);

    // Cannon js body
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: shape,
      material: this.defaultMaterial
    });
    body.position.x = position.x;
    body.position.y = position.y;
    body.position.z = position.z;
    body.addEventListener('collide', this.playHitSound);


    this.world.addBody(body);
    // Save in objectsToupdate
    this.objectsToUpdate.push({
      mesh,
      body
    });
  }


  private boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  private boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: this.environmentMapTexture
  });

  private createBox = (width: number, height: number, depth: number, position: THREE.Vector3) => {
    // THREE.js mesh
    const mesh = new THREE.Mesh(
      this.boxGeometry,
      this.boxMaterial
    );
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    this.scene.add(mesh);

    // Cannon js body
    const boxVector = new CANNON.Vec3(width * .5, height * .5, depth * .5)
    const shape = new CANNON.Box(boxVector);
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: shape,
      material: this.defaultMaterial
    });
    body.position.x = position.x;
    body.position.y = position.y;
    body.position.z = position.z;

    body.addEventListener('collide', this.playHitSound);
    this.world.addBody(body);
    // Save in objectsToupdate
    this.objectsToUpdate.push({
      mesh,
      body
    });
  }
  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();
  private oldElapsedTime = 0;

  private animateObjects() {
    // Time
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;
    // Update Objects

    // Update Camera


    // Update Controls
    this.controls.update();
    // Update physics world

    this.world.step(1 / 60, deltaTime, 3);

    for (let i = 1; i < this.objectsToUpdate.length; i++) {
      this.objectsToUpdate[i].mesh.position.x = this.objectsToUpdate[i].body.position.x;
      this.objectsToUpdate[i].mesh.position.y = this.objectsToUpdate[i].body.position.y;
      this.objectsToUpdate[i].mesh.position.z = this.objectsToUpdate[i].body.position.z;

      this.objectsToUpdate[i].mesh.rotation.x = this.objectsToUpdate[i].body.quaternion.x;
      this.objectsToUpdate[i].mesh.rotation.y = this.objectsToUpdate[i].body.quaternion.y;
      this.objectsToUpdate[i].mesh.rotation.z = this.objectsToUpdate[i].body.quaternion.z;
    }

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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Must change component
    let component: LessonTwentyTwoComponent = this;
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
