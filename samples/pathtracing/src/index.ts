import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, SceneLoader, SSAORenderingPipeline} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"

let canvas = document.getElementById('babylonjs-sandbox-canvas') as HTMLCanvasElement;

let engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

const createScene =  () => {
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 2, 0));
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    //const box = MeshBuilder.CreateBox("box", {}, scene);

    SceneLoader.Append("/assets/scenes/gltf2/Sponza/glTF/", "Sponza.gltf", scene, (container) => {
        console.log(container);
    });

    // Create SSAO and configure all properties (for the example)
    const ssaoRatio = {
        ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
        combineRatio: 1.0 // Ratio of the combine post-process (combines the SSAO and the scene)
    };

    let ssao = new SSAORenderingPipeline("ssao", scene, ssaoRatio);
    ssao.fallOff = 0.000001;
    ssao.area = 1;
    ssao.radius = 0.0001;
    ssao.totalStrength = 1.0;
    ssao.base = 0.5;

    // Attach camera to the SSAO render pipeline
    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);

    return scene;
}

let scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
})

window.addEventListener('resize', () => {
    engine.resize();
})