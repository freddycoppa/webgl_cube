import Renderer from './renderer.js';
import Shader from './shader.js';
import cubeOrientationInit from './mouse-handler.js';
import perspectiveInit from './window-resize-handler.js';
import { vsSource, fsSource } from './shaders.js';
import { genTexture } from './texture.js';
import { identify3x3, identity3x3, multiply3x3, rotationMatrix3x3, times3x3 } from './math.js';
import * as Cube from './cube.js';
import { clickToTurn } from './turn-handler.js';

// TODO: add anti-aliasing
// TODO: Upload to Experiments with Google

window.onload = async function () {
    //try {
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    const shader = new Shader(vsSource, fsSource);
    shader.use();
    shader.setVec3("translation", new Float32Array([0, 0, -10]));
    shader.setInt("sampler", 0);

    console.time('t');
    genTexture(1024, 1024, 500).apply(); // TODO: bake textures
    console.timeEnd('t');

    const renderer = new Renderer(shader);

    const cube = new Cube.Cube();


    const
        sideToBeRotated = new Float32Array(3),
        sideRotation = identify3x3(new Float32Array(9));

    document.onkeypress = clickToTurn(cube, renderer); // canvas.onkeypress?

    await renderer.draw({
        projection: perspectiveInit(renderer),
        cubeOrientation: cubeOrientationInit(renderer),
        sideToBeRotated,
        sideRotation,
        colors: cube.colors
    });

    // call all destructors here!
    /*} catch (err) {
        alert(err);
    }*/
}
