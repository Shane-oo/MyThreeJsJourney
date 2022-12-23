import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as lilGui from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

@Component({
             selector: 'app-lesson-thirty-three',
             templateUrl: './lesson-thirty-three.component.html',
             styleUrls: ['./lesson-thirty-three.component.css']
           })
export class LessonThirtyThreeComponent implements OnInit, AfterViewInit {
  /*
   * Animate the cube
   *
   */
  public clock = new THREE.Clock();
  private width = window.innerWidth;
  private height = window.innerHeight;

  private pixelRatio: number = 0;
  // Get Canvas
  @ViewChild('canvas')
  private canvasRef!: ElementRef;
  private camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
  private controls!: OrbitControls;


  // Initialise renderer
  private renderer!: THREE.WebGLRenderer;


  // Initialise scene
  private scene!: THREE.Scene;

  //Initialise object variables
  private oldElapsedTime = 0;
  private deltaTime: number = 0;


  // Test Meshes
  private cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial()
  );
  private torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
    new THREE.MeshStandardMaterial()
  );
  private sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
  );
  private floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial()
  );

  // Lights
  private directionalLight = new THREE.DirectionalLight('#ffffff', 1);


  // gui
  private gui = new lilGui.GUI({width: 200});


  // Texture
  private textureLoader = new THREE.TextureLoader();
  private displacementTexture = this.textureLoader.load('../../assets/images/displacementMap.png');

  // Stats
  private stats: Stats = Stats();

  private cameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);


  // Shader
  private shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256);

  private shaderMaterial = new THREE.ShaderMaterial({
                                                      precision: 'lowp',
                                                      uniforms:
                                                        {
                                                          uDisplacementTexture: {value: this.displacementTexture}
                                                        },
                                                      vertexShader: `
         #define DISPLACEMENT_STRENGTH 1.5
         uniform sampler2D uDisplacementTexture;


         varying vec3 vColor;
         void main()
         {
              // Position
             vec4 modelPosition = modelMatrix * vec4(position, 1.0);
             float elevation = texture2D(uDisplacementTexture, uv).r;
             modelPosition.y += clamp(elevation,0.5,1.0) * DISPLACEMENT_STRENGTH;
             gl_Position = projectionMatrix * viewMatrix * modelPosition;

             // Color
             float colorElevation = max(elevation,0.25);

             vec3 depthColor = vec3(1.0, 0.1, 0.1);
             vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
             vec3 color = mix(depthColor,surfaceColor,elevation);

             vColor = color;

         }
     `, fragmentShader: `


         varying vec3 vColor;

         void main()
         {


             gl_FragColor = vec4(vColor, 1.0);
         }
     `
                                                    });

  private shaderMesh = new THREE.Mesh(this.shaderGeometry, this.shaderMaterial);

  constructor() {

  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

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
    if(!document.fullscreenElement) {
      this.canvas.requestFullscreen().then(r => {
        console.log('fullscreen');
      });
    } else {
      document.exitFullscreen().then(r => {
        console.log('exit fullscreen');
      });
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // call needed functions
    this.createScene();
    this.startRenderingLoop();

  }

  ngOnDestroy() {
    this.scene.remove(this.cube);
    this.cube.geometry.dispose();
    this.cube.material.dispose();

    this.scene.remove(this.sphere);
    this.sphere.geometry.dispose();
    this.sphere.material.dispose();

    this.scene.remove(this.torusKnot);
    this.torusKnot.geometry.dispose();
    this.torusKnot.material.dispose();

    this.scene.remove(this.floor);
    this.floor.geometry.dispose();
    this.floor.material.dispose();

    this.scene.remove(this.directionalLight);
    this.directionalLight.dispose();

    this.displacementTexture.dispose();

    this.scene.remove(this.camera);
    this.gui.destroy();

    this.stats.domElement.remove();

  }

  private setEffectComposer() {

  }

  /*
   * Loading Manager Functions
  */
  private setLoadingManager() {
  }

  private LoadModels() {

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
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.normalBias = 0.05;
    this.directionalLight.position.set(0.25, 3, 2.25);

    // Optimise shadow
    this.directionalLight.shadow.camera.top = 3;
    this.directionalLight.shadow.camera.right = 6;
    this.directionalLight.shadow.camera.left = -6;
    this.directionalLight.shadow.camera.bottom = -3;
    this.directionalLight.shadow.camera.far = 10;


    this.cube.castShadow = true;
    this.cube.receiveShadow = false;
    this.cube.position.set(-5, 0, 0);

    this.torusKnot.castShadow = true;
    this.torusKnot.receiveShadow = false;

    this.sphere.position.set(5, 0, 0);
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = false;

    this.floor.position.set(0, -2, 0);
    this.floor.rotation.x = -Math.PI * 0.5;
    this.floor.castShadow = false;
    this.floor.receiveShadow = true;

    this.shaderMesh.rotation.x = -Math.PI * 0.5;
    this.shaderMesh.position.set(0, -2, 0);
  }

  private modifyPhysics() {

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
    this.camera.position.set(2, 2, 6);

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

  private createStats() {
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  private addMutualizedGeometries() {
    // merged geometry
    /*    const geometries = [];
        for(let i = 0; i < 50; i++) {

          const geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
          geometry.translate(
            (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10
          );
          geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
          geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);

          geometries.push(geometry);
        }
        const mergedGeometries = BufferGeometryUtils.mergeBufferGeometries(geometries);


        const material = new THREE.MeshNormalMaterial();

        const mesh = new THREE.Mesh(mergedGeometries, material);
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;

        mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
        mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;
        this.scene.add(mesh);*/

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.InstancedMesh(geometry, material, 50);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(mesh);
    for(let i = 0; i < 50; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );

      const quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0));

      const matrix = new THREE.Matrix4();
      matrix.makeRotationFromQuaternion(quaternion);
      matrix.setPosition(position);

      mesh.setMatrixAt(i, matrix);
    }

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

    // Models
    this.LoadModels();

    this.createStats();

    this.addMutualizedGeometries();
    //Add Objects to the scene

    this.scene.add(this.camera);

    this.scene.add(this.cube);
    this.scene.add(this.torusKnot);
    this.scene.add(this.sphere);
    this.scene.add(this.floor);
    this.scene.add(this.shaderMesh);

    this.scene.add(this.directionalLight);
    //this.scene.add(this.cameraHelper);
    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();


  }

  // Keep a performant native Javascript code especially in the tick function
  private animateObjects() {
    this.stats.begin();

    // Time
    const elapsedTime = this.clock.getElapsedTime();
    this.deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;
    // Update Meshes
    this.torusKnot.rotation.y = elapsedTime * 0.1;

    // Update Camera


    // Update Controls
    this.controls.update();
    // Update physics world

    //this.cameraHelper.update();

    this.stats.end();

  }

  /*
  * Start The Renderer
  *
  */
  private startRenderingLoop() {
    // Renderer
    // use canvas element in template

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true, powerPreference: 'high-performance'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.pixelRatio = this.renderer.getPixelRatio();

    this.renderer.setSize(this.width, this.height);
    // Activate shadow map
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    // Optimise Renderer shadow map
    // Only update the shadow once i.e. a non moving sun
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;

    // Must change component
    let component: LessonThirtyThreeComponent = this;
    //console.log(this.renderer.info)


    // Post Processing
    this.setEffectComposer();

    (function render() {
      //console.log('tick');

      requestAnimationFrame(render);

      // Call animation Functions
      component.animateObjects();

      // render renderer

      component.renderer.render(component.scene, component.camera);
      //component.effectComposer.render();

    }());
  }

}
