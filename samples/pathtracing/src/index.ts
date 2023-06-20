import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder} from "@babylonjs/core"

let canvas = document.getElementById('babylonjs-sandbox-canvas') as HTMLCanvasElement;

let engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

const createScene =  () => {
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0));
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    const box = MeshBuilder.CreateBox("box", {}, scene);

    return scene;
}

let scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
})

window.addEventListener('resize', () => {
    engine.resize();
})