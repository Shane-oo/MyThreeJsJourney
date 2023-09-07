import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import * as lilGui from "lil-gui";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Color, Float32BufferAttribute, Matrix4, Mesh, MeshStandardMaterial, RepeatWrapping, sRGBEncoding} from "three";
//@ts-ignore
import vertexShader from '../../../assets/shaders/profiles/vertex.glsl';

//@ts-ignore
import modifiedCommon from '../../../assets/shaders/profiles/modifiedCommon.glsl';

//@ts-ignore
import modifiedUvVertexShader from '../../../assets/shaders/profiles/modifiedUvVertex.glsl';

@Component({
  selector: 'app-kitchen-door-profile',
  templateUrl: './kitchen-door-profile.component.html',
  styleUrls: ['./kitchen-door-profile.component.css']
})
export class KitchenDoorProfileComponent implements OnInit, AfterViewInit {
  private customUniforms = {
    uWidth: {value: 1},
    uHeight: {value: 1},
    uDepth: {value: 1}
  };

  // raycaster
  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();


  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / this.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.height) * 2 + 1;

  }

  private _rotate0 = new THREE.Matrix4();
  private _rotate90 = new THREE.Matrix4().makeRotationY(Math.PI / 2);
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
  private stats: Stats = Stats();

  // Initialise renderer
  private renderer!: THREE.WebGLRenderer;


  // Initialise scene
  private scene!: THREE.Scene;

  //Initialise object variables
  private oldElapsedTime = 0;
  private deltaTime: number = 0;


  // Lights
  // Lights
  private directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
  private directionalLight1Helper = new THREE.DirectionalLightHelper(this.directionalLight1, 2);
  private directionalLight2 = new THREE.DirectionalLight(0xffffff, 3);
  private directionalLight2Helper = new THREE.DirectionalLightHelper(this.directionalLight2, 2);
  private directionalLight3 = new THREE.DirectionalLight(0xffffff, 3);
  private directionalLight3Helper = new THREE.DirectionalLightHelper(this.directionalLight3, 2);
  private directionalLight4 = new THREE.DirectionalLight(0xffffff, 3);
  private directionalLight4Helper = new THREE.DirectionalLightHelper(this.directionalLight4, 2);
  private directionalLight5 = new THREE.DirectionalLight(0xffffff, 3);
  private directionalLight5Helper = new THREE.DirectionalLightHelper(this.directionalLight5, 2);
  private directionalLight6 = new THREE.DirectionalLight(0xffffff, 3);
  private directionalLight6Helper = new THREE.DirectionalLightHelper(this.directionalLight6, 2);

  private bulbLight = new THREE.PointLight('white', 1, 100, 2);


  // gui
  private gui = new lilGui.GUI({width: 1000});
  private debugObject = {};
  // GLTF Loader
  private gltfLoader = new GLTFLoader();
  // Texture
  private textureLoader = new THREE.TextureLoader();

  // Textures
  private debugTexture = this.textureLoader.load('/assets/images/profiles/debug.jpeg', (texture: THREE.Texture) => {

  })

  private oakTexture = this.textureLoader.load('/assets/images/profiles/naturalOak.jpeg');
  private cupboardProfileNormalMap = this.textureLoader.load('/assets/images/profiles/CupboardProfileCroppedNormal4kx4k.jpg', () => {


  });


  // Materials
  private customMaterial = new THREE.MeshStandardMaterial({

    //map: this.oakTexture,

    color: new THREE.Color('black'),
    wireframe: false,
    //side: THREE.DoubleSide
  });


  // Materials
  private cupboardProfileMaterial = new THREE.MeshStandardMaterial({
    //map: this.debugTexture,
    color: new Color("white"),
    //normalMap: this.cupboardProfileNormalMap,
    normalScale: new THREE.Vector2(10, 10)
  });


  private tileGeometry = new THREE.BoxGeometry(0.6, 1.5, 0.2, 1, 100);
  private tileMesh = new THREE.Mesh(this.tileGeometry, this.cupboardProfileMaterial)
  //private floorGeometry = new THREE.PlaneGeometry(0.45, 0.2, 512, 512);
  private floorGeometry = new THREE.PlaneGeometry(0.6, 1.5, 1, 1);

  // Planes
  private material = new THREE.MeshStandardMaterial({
    map: this.debugTexture,
    color: new Color("#788073"),
    normalMap: this.cupboardProfileNormalMap,
    side: THREE.DoubleSide
  });


  private floorMesh = new THREE.Mesh(this.floorGeometry, this.material);

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
    console.log(this.floorGeometry)
  }

  ngAfterViewInit() {
    // call needed functions
    this.createScene();
    this.startRenderingLoop();

  }

  ngOnDestroy() {


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

  private myCube!: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;

  private LoadModels() {

    this.gltfLoader.load('/assets/models/RoseWood/rosewoodKitchenSeperated4.gltf',
      (kitchenGltf) => {

        this.gltfLoader.load('/assets/models/RoseWood/EigthProfileCubeTest.gltf',
          (cubeGltf) => {

            this.myCube = cubeGltf.scene.children.find(c => c.name === 'Cube') as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
            this.myCube.material = this.customMaterial;

            console.log(kitchenGltf);
            const cabinets = kitchenGltf.scene.children.filter(c => c.name.includes("Cabinet")) as THREE.Mesh[];
            console.log(cabinets)

            this.scene.add(this.myCube);

            cabinets.forEach((cabinet: THREE.Mesh) => {
              this.replaceCupboard(cabinet);
              kitchenGltf.scene.remove(cabinet);
            })


          });


        this.scene.add(kitchenGltf.scene);

      });


  }


  // Don't scale x or y if there are going to overlap, so first ding the closests vertices on the left side
  // to 0.0 and then when scaling the over side say they they should never go further that that, if it does
  // abort and do not apply profile to that small object
  // Never scale the z axis, assume the person who has drawn the cube has drawn it to scale.
  private replaceCupboard(oldObject: THREE.Mesh) {

    //if (oldObject.name === "Cabinet-11") {


    const newCabinet = new THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>(
      this.myCube.geometry.clone(),
      new THREE.MeshStandardMaterial().copy(this.myCube.material)
    );

    //  newCabinet.material.color = new THREE.Color(this.randomColor());
    newCabinet.position.set(0, 0, 0);

    oldObject.geometry.computeBoundingBox();


    const max = oldObject.geometry.boundingBox!.max;
    const min = oldObject.geometry.boundingBox!.min;
    const height = max.y - min.y;
    const width = max.x - min.x;
    const depth = max.z - min.z;

    const sizeOfCabinet = oldObject.geometry.boundingBox!.getSize(new THREE.Vector3());

    let sizeOfCube: THREE.Vector3 = new THREE.Vector3()

    let isOnXAxis = false;
    let differenceInWidth = 0;
    let differenceInDepth = 0;
    if ((max.x - min.x) > (max.z - min.z)) {
      console.log("this objects width is on the x axis");
      isOnXAxis = true;

      // this.myCube.rotateY(Math.PI/2); // updating just mesh bad -> does not rotate vertices

      const positionAttribute2 = newCabinet.geometry.getAttribute('position');
      const vertex2 = new THREE.Vector3();
      for (let i = 0; i < positionAttribute2.count; i++) {
        vertex2.fromBufferAttribute(positionAttribute2, i);
        const rotatedVertices = vertex2.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
        positionAttribute2.setXYZ(i, rotatedVertices.x, rotatedVertices.y, rotatedVertices.z);
      }

      // must recalculate bounding box after messing with vertices
      newCabinet.geometry.computeBoundingBox();
      sizeOfCube = newCabinet.geometry.boundingBox!.getSize(new THREE.Vector3());

      differenceInWidth = sizeOfCube.x - sizeOfCabinet.x;
      differenceInDepth = sizeOfCube.z - sizeOfCabinet.z;
    }

    if ((max.x - min.x) < (max.z - min.z)) {
      console.log('this objects width is on the z axis');
      newCabinet.geometry.computeBoundingBox();

      sizeOfCube = newCabinet.geometry.boundingBox!.getSize(new THREE.Vector3());

      differenceInWidth = sizeOfCube.z - sizeOfCabinet.z;
      differenceInDepth = sizeOfCube.x - sizeOfCabinet.x;
    }

    const differenceInHeight = sizeOfCube.y - sizeOfCabinet.y;

    /*
      As to why the position attribute doesn't change when rotating, this is because the rotation is
      applied to the Mesh while the Geometry is always kept intact. The position attribute represents an intrinsic
      property of the geometry, representing the arrangement of its vertices in space,
      they're never modified by transforming the object.
    */


    console.log(height, width, depth);


    console.log("difference in height = ", differenceInHeight);
    console.log("difference in width = ", differenceInWidth);
    console.log("difference in depth = ", differenceInDepth);

    let hightestYVertexOnLowerPlane = -1;
    let lowestYVertexOnUpperPlane = 1;
    let hightestHorizontalVertexOnLeftPlane = -1;
    let lowestHorizontalVertexOnRightPlane = 1;

    const positionAttribute = newCabinet.geometry.getAttribute('position');
    const vertex = new THREE.Vector3();
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      if (isOnXAxis) {
        if (vertex.x > 0.0) {
          // get lowestHorizontalVertexOnRightPlane
          if (vertex.x < lowestHorizontalVertexOnRightPlane) {
            lowestHorizontalVertexOnRightPlane = vertex.x;
          }

          // reshape Vertex
          vertex.x -= differenceInWidth;
        } else {
          // get hightestHorizontalVertexOnLeftPlane
          if (vertex.x > hightestHorizontalVertexOnLeftPlane) {
            hightestHorizontalVertexOnLeftPlane = vertex.x;
          }
        }


      } else {
        if (vertex.z > 0.0) {

          // get lowestHorizontalVertexOnRightPlane
          if (vertex.z < lowestHorizontalVertexOnRightPlane) {
            lowestHorizontalVertexOnRightPlane = vertex.z;
          }

          // reshape Vertex
          vertex.z -= differenceInWidth;
        } else {
          // get hightestHorizontalVertexOnLeftPlane
          if (vertex.z > hightestHorizontalVertexOnLeftPlane) {
            hightestHorizontalVertexOnLeftPlane = vertex.z;
          }
        }
      }
      if (vertex.y > 0.0) {

        // get lowestYVertexOnUpperPlane
        if (vertex.y < lowestYVertexOnUpperPlane) {
          lowestYVertexOnUpperPlane = vertex.y;
        }

        // reshape vertex
        vertex.y -= differenceInHeight;

      } else {
        // get hightestYVertexOnLowerPlane
        if (vertex.y > hightestYVertexOnLowerPlane) {
          hightestYVertexOnLowerPlane = vertex.y;
        }
      }

      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    console.log("hightestYVertexOnLowerPlane", hightestYVertexOnLowerPlane)
    console.log("lowestYVertexOnUpperPlane", lowestYVertexOnUpperPlane)


    newCabinet.geometry.computeBoundingBox();

    const bottomCenter = oldObject.geometry.boundingBox!.getCenter(new THREE.Vector3()).clone();
    bottomCenter.setY(bottomCenter.y + differenceInHeight / 2);

    if (isOnXAxis) {
      bottomCenter.setX(bottomCenter.x + differenceInWidth / 2);
      // no longer scaling depth
      //  this.myCube.scale.setZ((sizeOfCabinet.z / sizeOfCube.z) );

    } else {
      bottomCenter.setZ(bottomCenter.z + differenceInWidth / 2);
      //  this.myCube.scale.setX((sizeOfCabinet.x / sizeOfCube.x) );

    }

    newCabinet.position.copy(bottomCenter);

    if (oldObject.name === "Cabinet-23") {
      this.bulbLight.position.copy(bottomCenter)
      this.bulbLight.position.setX(this.bulbLight.position.x + 0.5);
    }

    if (((lowestYVertexOnUpperPlane - differenceInHeight) < hightestYVertexOnLowerPlane) ||
      ((lowestHorizontalVertexOnRightPlane - differenceInHeight) < hightestHorizontalVertexOnLeftPlane)) {
      console.log("object cannot be reshaped");
      this.scene.add(oldObject)
    } else {
      newCabinet.geometry.computeBoundingSphere();
      this.scene.add(newCabinet);
    }

    // }
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

  private modifyMaterials() {

  }


  /*
   * Set Geometry Attribute on geometry
   */
  private setGeometryAttributes() {
    // Set Geometry attribute

  }

  private modifyTextures() {
    /*    this.cupboardProfileNormalMap.wrapS = this.cupboardProfileNormalMap.wrapT = RepeatWrapping;
        this.cupboardProfileNormalMap.anisotropy = 4;
        this.cupboardProfileNormalMap.flipY = false;


        this.cupboardProfileNormalMap.repeat.set(1, 1);
        this.cupboardProfileNormalMap.offset.set(0, 0);*/
    /*  this.cupboardProfileNormalMap.wrapS = this.cupboardProfileNormalMap.wrapT = RepeatWrapping;
      this.cupboardProfileNormalMap.repeat.set(1,2);*/


    this.debugTexture.anisotropy = 4;
    this.debugTexture.flipY = false;

    /*
         this.cupboardProfileNormalMap.rotation = Math.PI/2;
         this.cupboardProfileNormalMap.center = new THREE.Vector2(0.5, 0.5); // center of texture.*/

    this.oakTexture.wrapS = this.oakTexture.wrapT = RepeatWrapping;
    this.oakTexture.anisotropy = 4;
    this.oakTexture.flipY = false;


    this.oakTexture.repeat.set(4, 4);
    this.oakTexture.offset.set(0, 0);
  }


  /*
  * modify the objects
  *
  */
  private modifyObjects() {

    this.floorMesh.position.set(0, 2, -3.5);
    this.floorMesh.rotateX(90);

    this.tileMesh.position.set(0, 2, -4.75);
    this.tileMesh.rotateX(90);
    // Modify Light
    /*this.bulbLight.position.set(-2.2, 1.5, -1.2);
    */

    this.bulbLight.position.setX(-2.25);
    this.bulbLight.position.setY(1);
    this.bulbLight.position.setZ(1.50);

    this.directionalLight1.position.set(0, 5, -3);

    this.directionalLight2.rotateX(Math.PI);
    this.directionalLight2.rotateZ(Math.PI * 3 / 2);
    this.directionalLight2.position.set(5, 0, -3);

    this.directionalLight3.position.set(0, 0, -9);
    this.directionalLight3.rotateY(Math.PI * 3 / 2);
    this.directionalLight3.rotateZ(Math.PI / 2);

    this.directionalLight4.position.set(0, 0, 3);
    this.directionalLight4.rotateY(-Math.PI * 3 / 2);
    this.directionalLight4.rotateZ(-Math.PI / 2);

    this.directionalLight5.rotateX(-Math.PI);
    this.directionalLight5.rotateZ(-Math.PI * 3 / 2);
    this.directionalLight5.position.set(-5, 0, -3);

    this.directionalLight6.position.set(0, -5, -3);
    this.directionalLight6.rotateX(-Math.PI);


    this.bulbLight.castShadow = true;
    this.bulbLight.power = 30;
    this.bulbLight.add(new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 8), new THREE.MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000
    })));


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

    this.camera.position.set(6, 1.8204098323057591, -6.5873651639938235);

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
    //   this.gui.close();


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

    this.modifyMaterials();

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
    this.scene.add(this.camera);
    this.scene.add(this.bulbLight);
    //  this.scene.add(this.hemiLight);
    this.scene.add(this.directionalLight1);//, this.directionalLight1Helper);
    this.scene.add(this.directionalLight2);//, this.directionalLight2Helper);
    this.scene.add(this.directionalLight3);//, this.directionalLight3Helper);
    this.scene.add(this.directionalLight4);//, this.directionalLight4Helper);
    this.scene.add(this.directionalLight5);//, this.directionalLight5Helper);
    this.scene.add(this.directionalLight6);//, this.directionalLight6Helper);

    //this.scene.add(this.floorMesh);
    //this.scene.add(this.tileMesh);

    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.setColors(new THREE.Color('red'), new THREE.Color('yellow'), new THREE.Color('blue'))
    this.scene.add(axesHelper);


    // Call add Controls to canvas
    this.modifyControls();

    // Add the debug tweaks to the GUI
    this.modifyDebugGUI();


  }

  private currentIntersect: any;

  // Keep a performant native Javascript code especially in the tick function
  private animateObjects() {
    this.stats.begin();

    // Time
    const elapsedTime = this.clock.getElapsedTime();
    this.deltaTime = elapsedTime - this.oldElapsedTime;
    this.oldElapsedTime = elapsedTime;


    // Raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const objectsToTest = this.scene.children as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[];
    for (const object of objectsToTest) {
      if (object instanceof THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>) {
        const intersects = this.raycaster.intersectObject(object);
        if (intersects.length != 0) {

          if (!this.currentIntersect && object.material) {
            // object.material.color.set(this.randomColor());
          }
          this.currentIntersect = intersects[0];
        } else {

          this.currentIntersect = null;
        }
      }
    }


    // Update Shaders

    // Update Camera


    // Update Controls
    this.controls.update();
    // Update physics world
    //   this.bulbLight.position.y = (Math.cos(elapsedTime) * 0.75 + 0.75) / 3 + 0.1;
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
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // Optimise Renderer shadow map
    // Only update the shadow once i.e. a non moving sun
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;


    //Clear Color
    this.renderer.setClearColor(new THREE.Color('grey'));

    // Must change component
    let component: KitchenDoorProfileComponent = this;
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


/*  var bbox = new THREE.Box3().setFromObject(tallCupboard);
        let bboxSize = bbox.getSize(new THREE.Vector3());
        let uvMapSize = Math.max(bboxSize.x, bboxSize.y, bboxSize.z)
        console.log(uvMapSize)

        let material = new THREE.MeshPhongMaterial({
          color: 0x10f0f0,
          map: new THREE.TextureLoader().load('https://i.ibb.co/5sP6r6N/checker-2048.png'),
          transparent: true,
          opacity: 0.5
        });

        let boxGeometry = new THREE.BoxGeometry(uvMapSize, uvMapSize, uvMapSize);
        let cube = new THREE.Mesh(boxGeometry, material);
        cube.position.set(tallCupboard.position.x, tallCupboard.position.y, tallCupboard.position.z)
        this.scene.add(cube);*/
