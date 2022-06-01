import {
  ACESFilmicToneMapping,
  AmbientLight,
  Group,
  PerspectiveCamera,
  PointLight,
  Scene,
  sRGBEncoding,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass.js";

export class App {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;

  private composer!: EffectComposer;

  private isSpinning: boolean;
  private isLoaded: boolean;

  private avatar!: Group;
  private eyes!: Group;

  private canvas: HTMLCanvasElement;
  private canvasX!: number;
  private canvasY!: number;

  private mouse: Vector2;
  private faceTarget: Vector3;
  private eyesTarget: Vector3;

  constructor(canvas: HTMLCanvasElement) {
    const { width, height, left, top } = canvas.getBoundingClientRect();
    this.camera = new PerspectiveCamera(50, width / height, 3, 10);
    this.camera.position.z = 5.3;

    this.scene = new Scene();
    this.canvas = canvas;
    this.canvasX = left + width / 2;
    this.canvasY = top + height / 2;

    this.mouse = new Vector2(0, 0);
    this.faceTarget = new Vector3(0, 0, 15);
    this.eyesTarget = new Vector3(0, 0, 15);

    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputEncoding = sRGBEncoding;

    this.isSpinning = true;
    this.isLoaded = false;

    this.addLights();
    this.addAmbienOclusion();
    this.addEvents();
  }

  private addEvents() {
    const onResize = () => {
      const { width, height, left, top } = this.canvas.getBoundingClientRect();
      this.canvas.setAttribute("width", width + "");
      this.canvas.setAttribute("height", height + "");

      this.canvasX = left + width / 2;
      this.canvasY = top + height / 2;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.composer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    let first = true;

    window.addEventListener("mousemove", (event) => {
      if (first) {
        first = false;
        onResize();
      }
      this.isSpinning = false;

      this.mouse.x = (event.clientX - this.canvasX) / 50;
      this.mouse.y = -(event.clientY - this.canvasY) / 50;
    });
  }

  public render() {
    this.composer.render();
  }

  public animate() {
    if (!this.isLoaded) {
      return;
    }
    requestAnimationFrame(this.animate.bind(this));

    if (this.isSpinning) {
      this.avatar.rotateY(-0.02);
    } else {
      // Ease animation
      this.faceTarget.x += (this.mouse.x - this.faceTarget.x) * 0.05;
      this.faceTarget.y += (this.mouse.y - this.faceTarget.y) * 0.05;

      this.eyesTarget.x += (this.mouse.x - this.eyesTarget.x) * 0.065;
      this.eyesTarget.y += (this.mouse.y - this.eyesTarget.y) * 0.065;

      this.avatar.lookAt(this.faceTarget);
      this.eyes.lookAt(this.eyesTarget);
    }
    this.render();
  }

  private addAmbienOclusion() {
    const renderPass = new RenderPass(this.scene, this.camera);
    const saoPass = new SAOPass(this.scene, this.camera, false, true);
    this.composer = new EffectComposer(this.renderer);

    // Enable Ambient oclusion
    saoPass.params.output = 1;

    this.composer.addPass(renderPass);
    this.composer.addPass(saoPass);
  }

  private addLights() {
    const light = new PointLight(0xf9ff9f, 0.5);
    light.position.z = 70;
    light.position.y = -70;
    light.position.x = -70;
    this.scene.add(light);

    const light2 = new PointLight(0xffdddd, 0.5);
    light2.position.z = 70;
    light2.position.x = -70;
    light2.position.y = 70;
    this.scene.add(light2);

    const light3 = new PointLight(0xfff7c9, 0.5);
    light3.position.z = 70;
    light3.position.x = 70;
    light3.position.y = -70;
    this.scene.add(light3);

    const light4 = new AmbientLight(0xffffff, 0.05);
    this.scene.add(light4);
  }

  public loadGltf(): Promise<void> {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setResourcePath;
    dracoLoader.setDecoderPath("js/gltf/");
    dracoLoader.setDecoderConfig({ type: "js" });

    return new Promise((resolve, reject) => {
      new GLTFLoader()
        .setPath("models/")
        .setDRACOLoader(dracoLoader)
        .load(
          "avatar.gltf",
          (gltf: GLTF) => {
            this.avatar = new Group();
            this.avatar.position.x = 0.2;
            this.avatar.add(
              ...gltf.scene.children.filter((child) => child.type === "Mesh")
            );

            this.scene.add(this.avatar);

            this.eyes = new Group();

            this.avatar.add(this.eyes);
            this.eyes.add(this.avatar.getObjectByName("Eyes")!);
            this.isLoaded = true;
            resolve();
          },
          () => {},
          reject
        );
    });
  }
}

function main() {
  const canvas = document.querySelector(".avatar")! as HTMLCanvasElement;
  const app = new App(canvas);
  app.loadGltf().then(() => {
    app.animate();
    canvas.style.backgroundImage = "";
  });
}

main();
