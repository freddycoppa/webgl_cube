import { identify3x3, rotate3x3Matrix, float32Identity } from './math.js';
import * as Cube from './cube.js';

const piBy2 = Math.PI / 2;

function easeInOut(t) {
    /* const sin = Math.sin(piBy2 * t);
    return sin * sin; */
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function* AngleGenerator(direction, duration) {
    let theta = 0.0;
    let time = yield theta;
    let deltaT = 0;
    let end_angle = direction ? piBy2 : -piBy2;
    while (deltaT < 1) {
        theta = end_angle * easeInOut(deltaT);
        deltaT = ((yield theta) - time) / duration;
    }
    yield end_angle;
}

/* function* AngleGenerator(direction) {
    let theta = 0;
    while (theta > -piBy2) {
        yield theta;
        theta -= 0.1;
    }
    yield piBy2;
} */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const anomalies = [ Cube.YELLOW, Cube.RED, Cube.BLUE ];

export async function turnFace(cube, renderer, face, direction) {
    const sideToBeRotated = Cube.facePositions[face];
    const turnDirection = anomalies.includes(face) ? !direction : direction;
    const sideRotation = identify3x3(new Float32Array(9));
    const angleGen = AngleGenerator(direction, 250);

    for (
        let angle = angleGen.next(await renderer.redraw({ sideToBeRotated }));
        !angle.done;
        angle = angleGen.next(await renderer.redraw({ sideRotation }))
    ) {
        rotate3x3Matrix(sideRotation, sideToBeRotated, angle.value);
    }
    
    cube.rotate(face, turnDirection);
    await renderer.redraw({ sideRotation: float32Identity, colors: cube.colors });
}

export function clickToTurn(cube, renderer) {
    let blockEvents = false; // come up with better synchronization mechanism

    //let shiftKey = false;

    return async function (event) {
        if (!blockEvents) switch (event.key) {
            case 'g':
                blockEvents = true;
                await turnFace(cube, renderer, Cube.GREEN, event.ctrlKey);
                blockEvents = false;
                break;
            case 'y':
                blockEvents = true;
                await turnFace(cube, renderer, Cube.YELLOW, event.ctrlKey);
                blockEvents = false;
                break;
            case 'r':
                blockEvents = true;
                await turnFace(cube, renderer, Cube.RED, event.ctrlKey);
                blockEvents = false;
                break;
            case 'b':
                blockEvents = true;
                await turnFace(cube, renderer, Cube.BLUE, event.ctrlKey);
                blockEvents = false;
                break;
            case 'w':
                blockEvents = true;
                await turnFace(cube, renderer, Cube.WHITE, event.ctrlKey);
                blockEvents = false;
                break;
            case 'o':
                blockEvents = true;
                await turnFace(cube, renderer, Cube.ORANGE, event.ctrlKey);
                blockEvents = false;
                break;
            
            // toy cases below
            
            case 'j':
                blockEvents = true;

                let face;
                let direction;

                for (let i = 0; i < 50; i++) {
                    for (; ;) {
                        const newFace = Math.floor(Math.random() * 6);
                        const newDirection = Math.random() >= 0.5;

                        if ((newFace !== face) || (newDirection === direction)) {
                            face = newFace;
                            direction = newDirection;
                            break;
                        }
                    }

                    await turnFace(cube, renderer, face, direction);
                }

                blockEvents = false;
                break;
            case 'p':
                blockEvents = true;
                await turnFace(cube, renderer, Cube.GREEN, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.GREEN, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.BLUE, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.BLUE, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.RED, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.RED, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.ORANGE, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.ORANGE, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.WHITE, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.WHITE, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.YELLOW, Cube.CLOCKWISE);
                await turnFace(cube, renderer, Cube.YELLOW, Cube.CLOCKWISE);
                blockEvents = false;
                break;
        }
    }
}
