import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as THREE from "three";
import {
  ACESFilmicToneMapping,
  AgXToneMapping,
  AmbientLight, CineonToneMapping, Color,
  DirectionalLight,
  LinearToneMapping,
  NeutralToneMapping, NoToneMapping, ReinhardToneMapping,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GUI} from "lil-gui";

@Component({
  selector: 'app-tone-mapping-demo',
  templateUrl: './tone-mapping-demo.component.html',
  styleUrls: ['./tone-mapping-demo.component.css']
})
export class ToneMappingDemoComponent implements OnInit, AfterViewInit {

  // Get Canvas
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private orbitControls!: OrbitControls;
  private gui = new GUI();


  private createScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('grey');
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    this.camera.position.z = 3;
    this.scene.add(this.camera);

    this.orbitControls = new OrbitControls(this.camera, this.canvas);
    this.orbitControls.enableDamping = true;

    // Light
    const directionalLight = new DirectionalLight('#FFFFFF', 12 * Math.PI)
    directionalLight.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    this.scene.add(directionalLight);

    const ambientLight = new AmbientLight('#A0A0A0', 30 * Math.PI);
    this.scene.add(ambientLight);

    const ambientLightFolder = this.gui.addFolder('Ambient Light');
    ambientLightFolder.add(ambientLight,'intensity')
      .min(0)
      .max(250);
    ambientLightFolder.addColor(ambientLight, 'color');


    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    const textureLoader = new TextureLoader();
    const diffuse = textureLoader.load('assets/images/Volcano/TCom_Rock_CliffVolcanic_2K_albedo.png');
    this.formatTexture(diffuse);
    diffuse.colorSpace = SRGBColorSpace;

    const normalMap = textureLoader.load('assets/images/Volcano/TCom_Rock_CliffVolcanic_2K_normal.png');
    this.formatTexture(normalMap);

    const roughnessMap = textureLoader.load('assets/images/Volcano/TCom_Rock_CliffVolcanic_2K_roughness.png');
    this.formatTexture(roughnessMap);

    const aoMap = textureLoader.load('assets/images/Volcano/TCom_Rock_CliffVolcanic_2K_ao.png');
    this.formatTexture(aoMap);


    material.map = diffuse;
    material.normalMap = normalMap;
    material.normalScale = new Vector2(0.6, 0.6);
    material.roughnessMap = roughnessMap;
    material.roughness = 0.9;
    material.aoMap = aoMap;
    material.aoMapIntensity = 50;

    this.scene.add(mesh);

    const meshFolder = this.gui.addFolder('Mesh');
    meshFolder.add(mesh.material, 'aoMapIntensity')
      .min(0)
      .max(150)
      .step(1);
  }

  private formatTexture(texture: Texture) {
    texture.repeat.set(2, 2);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 4;
    texture.flipY = false;
  }

  private animateObjects() {
    // Update Controls
    this.orbitControls.update();
  }

  private startRenderingLoop() {
    // Renderer
    // use canvas element in template

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Tone Mapping
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = NeutralToneMapping;
    this.renderer.toneMappingExposure = 0.05;

    const rendererFolder = this.gui.addFolder('Renderer');
    rendererFolder.add(this.renderer, 'toneMapping',{
      NoToneMapping,
      LinearToneMapping,
      CineonToneMapping,
      ReinhardToneMapping,
      ACESFilmicToneMapping,
      AgXToneMapping,
      NeutralToneMapping
    });
    rendererFolder.add(this.renderer, 'toneMappingExposure')
      .min(0)
      .max(5)
      .step(0.00001);

    let component: ToneMappingDemoComponent = this;
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
    this.createScene();
    this.startRenderingLoop();
  }
}
