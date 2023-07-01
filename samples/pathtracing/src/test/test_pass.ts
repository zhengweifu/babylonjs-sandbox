import { 
    Engine, 
    WebGPUEngine, 
    Scene, 
    ArcRotateCamera, 
    HemisphericLight, 
    Vector3, 
    MeshBuilder, 
    SceneLoader, 
    EffectRenderer,
    EffectWrapper,
    SSAORenderingPipeline, 
    RawTexture, 
    StorageBuffer, 
    RenderTargetTexture,
    TextureSampler,
    Constants,
    Camera
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"

const canvas = document.getElementById('babylonjs-sandbox-canvas') as HTMLCanvasElement;

const createEngine = async (usingWebGPU: boolean) => {
    if (usingWebGPU) {
        let engine = new WebGPUEngine(canvas);
        await engine.initAsync();
        return engine;
    } else {
        let engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        return engine;
    }
};

const createScene = (engine: Engine) => {
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 2, 0));
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    const box = MeshBuilder.CreateBox("box", {}, scene);

    const plane = MeshBuilder.CreatePlane("floor", {}, scene);

    // Attach camera to the SSAO render pipeline
    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);

    return scene;
}

let engine = await createEngine(true);

let scene = createScene(engine);

const testRenderTarget = new RenderTargetTexture("TestRenderTarget", {
    width: canvas.clientWidth,
    height: canvas.clientHeight
}, scene);

const effectRenderer = new EffectRenderer(engine);
const testEffect = new EffectWrapper({
    engine, 
    fragmentShader : `
        var sceneTexture: texture_2d<f32>;
        var mySampler: sampler;
        @fragment
        fn main(input: FragmentInputs) -> FragmentOutputs {
            let sceneColor : vec3<f32> = textureSample(sceneTexture, mySampler, input.vUV).rgb;
            fragmentOutputs.color = vec4<f32>(1, 1, 1, 1) * vec4<f32>(sceneColor, 1);
        }
    `, 
    shaderLanguage :1,
    name: "TestEffectWrapper"});


const sampler = new TextureSampler();
sampler.setParameters();
sampler.samplingMode = Constants.TEXTURE_NEAREST_SAMPLINGMODE;

testEffect.onApplyObservable.add(() => {
    testEffect.effect.setTexture("sceneTexture", testRenderTarget);
    testEffect.effect.setTextureSampler("mySampler", sampler);
});


engine.runRenderLoop(() => {
    //scene.render();
    testRenderTarget.render();
    effectRenderer.render(testEffect, null);
})

window.addEventListener('resize', () => {
    engine.resize();
})
