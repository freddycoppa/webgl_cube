import { dot } from "./math.js";

export const FRONT = 0, UP = 1, LEFT = 2, BACK = 3, DOWN = 4, RIGHT = 5;
export const GREEN = 0, YELLOW = 1, RED = 2, BLUE = 3, WHITE = 4, ORANGE = 5;

export const faces = {FRONT, UP, LEFT, BACK, DOWN, RIGHT, GREEN, YELLOW, RED, BLUE, WHITE, ORANGE};

export const CLOCKWISE = false;
export const ANTICLOCKWISE = true;

export const facePositions = [
    new Float32Array([ 0,  0,  1]),
    new Float32Array([ 0,  1,  0]),
    new Float32Array([-1,  0,  0]),
    new Float32Array([ 0,  0, -1]),
    new Float32Array([ 0, -1,  0]),
    new Float32Array([ 1,  0,  0]),
];

export const colorPositions = facePositions;

// TODO: FIX CLOCKWISE ANTICLOCKWISE
// TODO: Convert 'color' array to array of ints
export class Cube {
    #cubelets = [];
    colors = new Float32Array(6*3*3);

    constructor() {
        for (let x = 0; x < 3; x++) {
            this.#cubelets[x] = [];
            for (let y = 0; y < 3; y++) {
                this.#cubelets[x][y] = [];
                for (let z = 0; z < 3; z++) {
                    this.#cubelets[x][y][z] = [];
                }
            }
        }

        this.reset();
    }

    #set(f, i, j, color) {
        this.colors[j + 3*(i + 3*f)] = color;
    }

    #setColor(x, y, z, f) {
        const face = facePositions[f];
        if (dot(face, [x - 1, y - 1, z - 1]) > 0) {
            const c = this.#cubelets[x][y][z][f];
            if (face[0] != 0) this.#set(f, y, z, c);
            else if (face[1] != 0) this.#set(f, x, z, c);
            else this.#set(f, x, y, c);
        }
    }

    reset() {
        for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) for (let z = 0; z < 3; z++) for (let f = 0; f < 6; f++) {
            this.#cubelets[x][y][z][f] = f;
            this.#setColor(x, y, z, f);
        }
    }

    rotate(face, direction) { // call this 'turn()'
        const vec = facePositions[face];
        if (direction) {
            if (vec[0] != 0) {
                const x = vec[0] + 1;
                let c = this.#cubelets[x][0][0];
                this.#cubelets[x][0][0] = this.#cubelets[x][0][2];
                this.#cubelets[x][0][2] = this.#cubelets[x][2][2];
                this.#cubelets[x][2][2] = this.#cubelets[x][2][0];
                this.#cubelets[x][2][0] = c;
                c = this.#cubelets[x][1][0];
                this.#cubelets[x][1][0] = this.#cubelets[x][0][1];
                this.#cubelets[x][0][1] = this.#cubelets[x][1][2];
                this.#cubelets[x][1][2] = this.#cubelets[x][2][1];
                this.#cubelets[x][2][1] = c;
                for (let y = 0; y < 3; y++) for (let z = 0; z < 3; z++) {
                    const c = this.#cubelets[x][y][z][DOWN];
                    this.#cubelets[x][y][z][DOWN] = this.#cubelets[x][y][z][FRONT];
                    this.#cubelets[x][y][z][FRONT] = this.#cubelets[x][y][z][UP];
                    this.#cubelets[x][y][z][UP] = this.#cubelets[x][y][z][BACK];
                    this.#cubelets[x][y][z][BACK] = c;
                    for (let f = 0; f < 6; f++) this.#setColor(x, y, z, f);
                }
            } else if (vec[1] != 0) {
                const y = vec[1] + 1;
                let c = this.#cubelets[0][y][0];
                this.#cubelets[0][y][0] = this.#cubelets[0][y][2];
                this.#cubelets[0][y][2] = this.#cubelets[2][y][2];
                this.#cubelets[2][y][2] = this.#cubelets[2][y][0];
                this.#cubelets[2][y][0] = c;
                c = this.#cubelets[1][y][0];
                this.#cubelets[1][y][0] = this.#cubelets[0][y][1];
                this.#cubelets[0][y][1] = this.#cubelets[1][y][2];
                this.#cubelets[1][y][2] = this.#cubelets[2][y][1];
                this.#cubelets[2][y][1] = c;
                for (let z = 0; z < 3; z++) for (let x = 0; x < 3; x++) {
                    const c = this.#cubelets[x][y][z][FRONT];
                    this.#cubelets[x][y][z][FRONT] = this.#cubelets[x][y][z][RIGHT];
                    this.#cubelets[x][y][z][RIGHT] = this.#cubelets[x][y][z][BACK];
                    this.#cubelets[x][y][z][BACK] = this.#cubelets[x][y][z][LEFT];
                    this.#cubelets[x][y][z][LEFT] = c;
                    for (let f = 0; f < 6; f++) this.#setColor(x, y, z, f);
                }
            } else {
                const z = vec[2] + 1;
                let c = this.#cubelets[0][0][z];
                this.#cubelets[0][0][z] = this.#cubelets[0][2][z];
                this.#cubelets[0][2][z] = this.#cubelets[2][2][z];
                this.#cubelets[2][2][z] = this.#cubelets[2][0][z];
                this.#cubelets[2][0][z] = c;
                c = this.#cubelets[1][0][z];
                this.#cubelets[1][0][z] = this.#cubelets[0][1][z];
                this.#cubelets[0][1][z] = this.#cubelets[1][2][z];
                this.#cubelets[1][2][z] = this.#cubelets[2][1][z];
                this.#cubelets[2][1][z] = c;
                for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) {
                    const c = this.#cubelets[x][y][z][DOWN];
                    this.#cubelets[x][y][z][DOWN] = this.#cubelets[x][y][z][LEFT];
                    this.#cubelets[x][y][z][LEFT] = this.#cubelets[x][y][z][UP];
                    this.#cubelets[x][y][z][UP] = this.#cubelets[x][y][z][RIGHT];
                    this.#cubelets[x][y][z][RIGHT] = c;
                    for (let f = 0; f < 6; f++) this.#setColor(x, y, z, f);
                }
            }
        } else {
            if (vec[0] != 0) {
                const x = vec[0] + 1;
                let c = this.#cubelets[x][0][0];
                this.#cubelets[x][0][0] = this.#cubelets[x][2][0];
                this.#cubelets[x][2][0] = this.#cubelets[x][2][2];
                this.#cubelets[x][2][2] = this.#cubelets[x][0][2];
                this.#cubelets[x][0][2] = c;
                c = this.#cubelets[x][1][0];
                this.#cubelets[x][1][0] = this.#cubelets[x][2][1];
                this.#cubelets[x][2][1] = this.#cubelets[x][1][2];
                this.#cubelets[x][1][2] = this.#cubelets[x][0][1];
                this.#cubelets[x][0][1] = c;
                for (let y = 0; y < 3; y++) for (let z = 0; z < 3; z++) {
                    const c = this.#cubelets[x][y][z][DOWN];
                    this.#cubelets[x][y][z][DOWN] = this.#cubelets[x][y][z][BACK];
                    this.#cubelets[x][y][z][BACK] = this.#cubelets[x][y][z][UP];
                    this.#cubelets[x][y][z][UP] = this.#cubelets[x][y][z][FRONT];
                    this.#cubelets[x][y][z][FRONT] = c;
                    for (let f = 0; f < 6; f++) this.#setColor(x, y, z, f);
                }
            } else if (vec[1] != 0) {
                const y = vec[1] + 1;
                let c = this.#cubelets[0][y][0];
                this.#cubelets[0][y][0] = this.#cubelets[2][y][0];
                this.#cubelets[2][y][0] = this.#cubelets[2][y][2];
                this.#cubelets[2][y][2] = this.#cubelets[0][y][2];
                this.#cubelets[0][y][2] = c;
                c = this.#cubelets[1][y][0];
                this.#cubelets[1][y][0] = this.#cubelets[2][y][1];
                this.#cubelets[2][y][1] = this.#cubelets[1][y][2];
                this.#cubelets[1][y][2] = this.#cubelets[0][y][1];
                this.#cubelets[0][y][1] = c;
                for (let z = 0; z < 3; z++) for (let x = 0; x < 3; x++) {
                    const c = this.#cubelets[x][y][z][FRONT];
                    this.#cubelets[x][y][z][FRONT] = this.#cubelets[x][y][z][LEFT];
                    this.#cubelets[x][y][z][LEFT] = this.#cubelets[x][y][z][BACK];
                    this.#cubelets[x][y][z][BACK] = this.#cubelets[x][y][z][RIGHT];
                    this.#cubelets[x][y][z][RIGHT] = c;
                    for (let f = 0; f < 6; f++) this.#setColor(x, y, z, f);
                }
            } else {
                const z = vec[2] + 1;
                let c = this.#cubelets[0][0][z];
                this.#cubelets[0][0][z] = this.#cubelets[2][0][z];
                this.#cubelets[2][0][z] = this.#cubelets[2][2][z];
                this.#cubelets[2][2][z] = this.#cubelets[0][2][z];
                this.#cubelets[0][2][z] = c;
                c = this.#cubelets[1][0][z];
                this.#cubelets[1][0][z] = this.#cubelets[2][1][z];
                this.#cubelets[2][1][z] = this.#cubelets[1][2][z];
                this.#cubelets[1][2][z] = this.#cubelets[0][1][z];
                this.#cubelets[0][1][z] = c;
                for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) {
                    const c = this.#cubelets[x][y][z][DOWN];
                    this.#cubelets[x][y][z][DOWN] = this.#cubelets[x][y][z][RIGHT];
                    this.#cubelets[x][y][z][RIGHT] = this.#cubelets[x][y][z][UP];
                    this.#cubelets[x][y][z][UP] = this.#cubelets[x][y][z][LEFT];
                    this.#cubelets[x][y][z][LEFT] = c;
                    for (let f = 0; f < 6; f++) this.#setColor(x, y, z, f);
                }
            }
        }
    }
}