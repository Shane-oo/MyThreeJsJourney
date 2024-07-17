import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {RepeatWrapping, SRGBColorSpace, Vector3} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as lilGui from 'lil-gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import modifiedVertexShader from '../../../assets/shaders/roof/modifiedVertex.glsl';
// @ts-ignore
import modifiedCommon from '../../../assets/shaders/roof/cubicPulse.glsl';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter';

@Component({
  selector: 'app-roof-roofier',
  templateUrl: './roof-roofier.component.html',
  styleUrls: ['./roof-roofier.component.css']
})
export class RoofRoofierComponent implements OnInit, AfterViewInit {
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
  private camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
  private controls!: OrbitControls;

  // Stats
  private stats: Stats = new Stats();

  // Initialise renderer
  private renderer!: THREE.WebGLRenderer;


  // Initialise scene
  private scene!: THREE.Scene;

  //Initialise object variables
  private oldElapsedTime = 0;
  private deltaTime: number = 0;


  // Lights
  private directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);

  // gui
  private gui = new lilGui.GUI({width: 200});
  private debugObject = {};

  // Texture
  private textureLoader = new THREE.TextureLoader();
  // Textures
  private roofMapTexture = this.textureLoader.load('/assets/images/roof/envMapRoof.jpg');
  private roofBumpMapTexture = this.textureLoader.load('/assets/images/roof/bumpMapRoof.jpg');
  private normalMapTexture = this.textureLoader.load('/assets/images/roof/normalRoofMap.bmp');


  // GLTF Loader
  private gltfLoader = new GLTFLoader();

  private roofMaterial = new THREE.MeshStandardMaterial({
    map: this.roofMapTexture,
    bumpMap: this.roofBumpMapTexture,
    normalMap: this.normalMapTexture,
    color: '#4B4C46'
  });
  private numberOfVertices = 0;


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
    if (!document.fullscreenElement) {
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
    //todo


    this.scene.remove(this.camera);
    this.gui.destroy();

    this.stats.dom.remove();

  }

  private setEffectComposer() {

  }

  /*
   * Loading Manager Functions
  */
  private setLoadingManager() {

  }

  private mergedMeshes: THREE.Mesh[] = [];

  private LoadModels() {
    // todo change
    this.gltfLoader.load('/assets/models/RoseWood/rosewood.gltf',
      (gltf) => {
        console.log(gltf);
        let roof = gltf.scene.children.find(c => c.name
          === '4D-ROOFING__ROOF-2') as THREE.Mesh;
        roof.material = this.roofMaterial;
        const matrix = roof.matrixWorld;
        const index = roof.geometry.index?.array as unknown as number[];
        const normal = new Vector3();
        const position = new Vector3();
        const normalDic = new Map<string, [THREE.BufferGeometry]>();
        let faces = 0;
        // Iterate over the faces of the geometry
        for (let i = 0, il = roof.geometry.index?.count || 0; i < il; i += 3) {
          // Get the vertex indices for the current face
          const a = roof.geometry.index!.getX(i);
          const b = roof.geometry.index!.getX(i + 1);
          const c = roof.geometry.index!.getX(i + 2);

          // Get the normals and positions for the three vertices of the face
          normal.fromBufferAttribute(roof.geometry.attributes.normal, a);
          position.fromBufferAttribute(roof.geometry.attributes.position, a);
          const vertex1 = new THREE.Vector3(-position.x, -position.y, position.z);

          normal.fromBufferAttribute(roof.geometry.attributes.normal, b);
          position.fromBufferAttribute(roof.geometry.attributes.position, b);
          const vertex2 = new THREE.Vector3(position.x, -position.y, position.z);

          normal.fromBufferAttribute(roof.geometry.attributes.normal, c);
          position.fromBufferAttribute(roof.geometry.attributes.position, c);
          const vertex3 = new THREE.Vector3(position.x, position.y, position.z);

          vertex1.applyMatrix4(matrix);
          vertex2.applyMatrix4(matrix);
          vertex3.applyMatrix4(matrix);

          // Create a new geometry and set its vertices to the three vertices of the face
          const triangleGeometry = new THREE.BufferGeometry();
          const vertices = new Float32Array([
            -vertex1.x, -vertex1.y, vertex1.z,
            vertex2.x, -vertex2.y, vertex2.z,
            vertex3.x, vertex3.y, vertex3.z
          ]);
          triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));


          const normalString = normal.x.toFixed(4)
            + ','
            + normal.y.toFixed(4)
            + ','
            + normal.z.toFixed(4);
          if (normal.y < 0) {
            continue;
          }
          if (normalDic.has(normalString)) {
            console.log(normal);
            const arr = normalDic.get(normalString);
            arr!.push(triangleGeometry);
          } else {
            normalDic.set(normalString, [triangleGeometry]);
          }
          //mesh.position.y +=10;
          faces++;
          //console.log(mesh.position)
        }
/*        BROKEN
normalDic.forEach((value, key) => {

          let mergedBuffer = BufferGeometryUtils.mergeBufferGeometries(value, true);
          mergedBuffer = BufferGeometryUtils.mergeVertices(mergedBuffer);
          const mesh = new THREE.Mesh(mergedBuffer, new MeshBasicMaterial(
            {
              color: this.randomColor(),
              side: THREE.DoubleSide
            }
          ));
          this.mergedMeshes.push(mesh);
          this.scene.add(mesh);
        });*/
        console.log(faces);
        console.log(normalDic);
        this.scene.add(gltf.scene);
      });
  }

  private randomColor(): number {
    let color = '0x';
    for (let i = 0; i < 6; i++) {
      const random = Math.random();
      const bit = (random * 16) | 0;
      color += bit.toString(16);
    }
    return +color;
  }

  /*
   * Set Geometry Attribute on geometry
   */
  private setGeometryAttributes() {
    // Set Geometry attribute

  }

  private modifyTextures() {
    this.roofMapTexture.wrapS = this.roofMapTexture.wrapT = RepeatWrapping;
    this.roofMapTexture.anisotropy = 4;
    this.roofMapTexture.flipY = false;
    this.roofMapTexture.repeat.set(2, 2);
    this.roofMapTexture.offset.set(0, 0);
    this.roofMapTexture.colorSpace = SRGBColorSpace;


    this.roofBumpMapTexture.wrapS = this.roofBumpMapTexture.wrapT = RepeatWrapping;
    this.roofBumpMapTexture.anisotropy = 4;
    this.roofBumpMapTexture.flipY = false;
    this.roofBumpMapTexture.repeat.set(2, 2);
    this.roofBumpMapTexture.offset.set(0, 0);
    this.roofBumpMapTexture.colorSpace = SRGBColorSpace;

    this.normalMapTexture.wrapS = this.roofBumpMapTexture.wrapT = RepeatWrapping;
    this.normalMapTexture.anisotropy = 4;
    this.normalMapTexture.flipY = false;
    this.normalMapTexture.repeat.set(2, 2);
    this.normalMapTexture.offset.set(0, 0);
    this.normalMapTexture.colorSpace = SRGBColorSpace;

  }


  /*
  * modify the objects
  *
  */
  private modifyObjects() {

    // Modify Light
    this.directionalLight.position.set(10, 20, 3);

    // Roof Material
    this.roofMaterial.onBeforeCompile = (shader) => {
      console.log(shader);

      shader.vertexShader = shader.vertexShader.replace('#include <common>', modifiedCommon);

      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', modifiedVertexShader);
    };
  }

  private modifyPhysics() {

  }

  /*
 * modify the scene
 *
 */
  private modifyScene() {
    this.scene = new THREE.Scene();


  }

  /*
 * modify the camera
 *
 */
  private modifyCamera() {
    this.camera.position.set(1.42, 28.9, 33.3);
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
    this.gui.close();

  }

  private createStats() {
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }


  /*
  * Create the scene
  *
  */
  private createScene() {
    this.modifyTextures();
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

    //Add Objects to the scene

    this.scene.add(this.camera);
    this.scene.add(this.directionalLight);
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
    // Update Shaders

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

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.pixelRatio = this.renderer.getPixelRatio();

    this.renderer.setSize(this.width, this.height);
    // Activate shadow map
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Output Encoding
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Optimise Renderer shadow map
    // Only update the shadow once i.e. a non moving sun
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;


    //Clear Color
    this.renderer.setClearColor(new THREE.Color('grey'));

    // Must change component
    let component: RoofRoofierComponent = this;
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

  private vertexData = new Float32Array(100 * 3); // numVertices is the initial number of vertices

  createMoreVertices() {
    const x = 10;
    const numOfNewVertices = 100;
    console.log('creating ', 100, ' more vertices, ever ', x, 'amount');
    const position = new THREE.Vector3();

    // call addVertex every time the position's x coordinate increases by x
    this.mergedMeshes.forEach((mesh: THREE.Mesh) => {
      for (let i = 0; i < 100; i++) {
        position.x = i * x;
        this.addVertex(position, numOfNewVertices, mesh);
      }
    });

  }

  private addVertex(position: THREE.Vector3, numVertices: number, mesh: THREE.Mesh) {
    let positionArray = mesh.geometry.getAttribute('position').array as Float32Array;
    if (numVertices === positionArray.length / 3) {
      // resize the vertex data array if necessary
      const newVertexData = new Float32Array(positionArray.length * 2);
      newVertexData.set(positionArray);
      positionArray = newVertexData;
      mesh.geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    }
    // add the new vertex to the vertex data array
    positionArray[numVertices * 3] = position.x;
    positionArray[numVertices * 3 + 1] = position.y;
    positionArray[numVertices * 3 + 2] = position.z;
    // update the geometry
    mesh.geometry.getAttribute('position').needsUpdate = true;
    numVertices++;
  }

  private link = document.createElement('a');

  async downloadRoof() {
    this.link.style.display = 'none';
    document.body.appendChild(this.link);


    const exporter = new GLTFExporter();
    const modelChildren = this.scene;

    const data = await exporter.parseAsync(modelChildren, {binary: false, onlyVisible: false});
    const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
    let file = new File([blob], 'fileName.gltf');
    this.link.href = URL.createObjectURL(file);
    this.link.download = 'filename.gltf';
    this.link.click();

  }

}
