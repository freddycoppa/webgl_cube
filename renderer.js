import { facePositions, faces } from "./cube.js";
import { plus, rotationMatrix3x3 } from "./math.js";

const quadMesh = new Float32Array([
	-0.5, -0.5, -0.5, 0, 0,  -0.5, 0.5, -0.5, 0, 1,  0.5, 0.5, -0.5, 1, 1,
	-0.5, -0.5, -0.5, 0, 0,  0.5, 0.5, -0.5, 1, 1,  0.5, -0.5, -0.5, 1, 0
]);

const floatSize = Float32Array.BYTES_PER_ELEMENT;
const numberOfQuads = 6*9;


export default class Renderer {
	#vao;
	#quadInstance;
	#quadPositionsVBO;
	#quadOrientationsVBO;
	#colorsVBO;

	#shader;

	constructor(shader) {
		this.#shader = shader;

		this.#vao = gl.createVertexArray();
		gl.bindVertexArray(this.#vao);

		this.#quadInstance = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.#quadInstance);
		gl.bufferData(gl.ARRAY_BUFFER, quadMesh, gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5*floatSize, 0);
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5*floatSize, 3*floatSize);

		const [quadPositions, quadOrientations] = this.#initializeBuffers();

		this.#quadPositionsVBO = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.#quadPositionsVBO);
		gl.bufferData(gl.ARRAY_BUFFER, quadPositions, gl.STATIC_DRAW);
		gl.enableVertexAttribArray(2);
		gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 3*floatSize, 0);
		gl.vertexAttribDivisor(2, 1);

		this.#quadOrientationsVBO = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.#quadOrientationsVBO);
		gl.bufferData(gl.ARRAY_BUFFER, quadOrientations, gl.STATIC_DRAW);
		gl.enableVertexAttribArray(3);
		gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 9*floatSize, 0);
		gl.vertexAttribDivisor(3, 1);
		gl.enableVertexAttribArray(4);
		gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 9*floatSize, 3*floatSize);
		gl.vertexAttribDivisor(4, 1);
		gl.enableVertexAttribArray(5);
		gl.vertexAttribPointer(5, 3, gl.FLOAT, false, 9*floatSize, 6*floatSize);
		gl.vertexAttribDivisor(5, 1);

		this.#colorsVBO = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.#colorsVBO);
		gl.bufferData(gl.ARRAY_BUFFER, numberOfQuads*floatSize, gl.DYNAMIC_DRAW);
		gl.enableVertexAttribArray(6);
		gl.vertexAttribPointer(6, 1, gl.FLOAT, false, floatSize, 0);
		gl.vertexAttribDivisor(6, 1);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindVertexArray(null);
	}

	#initializeBuffers() {
		const quadPositions = new Float32Array(9*6*3), quadOrientations = new Float32Array(9*6*9);

		const setData = ((offset, placeArrayInBuffer) => (side, axis, angle) => {
			const facePosition = facePositions[side];
			const xoff = Math.abs(facePosition[0]), yoff = Math.abs(facePosition[1]), zoff = Math.abs(facePosition[2]);
			for (let x = xoff - 1; x < 2 - xoff; x++) for (let y = yoff - 1; y < 2 - yoff; y++) for (let z = zoff - 1; z < 2 - zoff; z++) {
				placeArrayInBuffer(plus(facePosition, [x, y, z]), quadPositions, offset);
				placeArrayInBuffer(rotationMatrix3x3(axis, angle), quadOrientations, offset);
				offset++;
			}
		})(0, (array, buffer, offset) => {
			const l = array.length;
			for (let i = 0; i < l; i++) buffer[offset*l + i] = array[i];
		});

		const pi = Math.PI;
		// TODO: Bake rotation matrices
		setData(faces.FRONT,	[-1, 0, 0],	pi	);	
		setData(faces.UP,		[1,  0, 0],	pi/2);
		setData(faces.LEFT,		[0,  1, 0],	pi/2);
		setData(faces.BACK,		[1,  0, 0],	0	);	
		setData(faces.DOWN,		[-1, 0, 0],	pi/2);
		setData(faces.RIGHT,	[0, -1, 0],	pi/2);

		return [quadPositions, quadOrientations];
	}

	#ready = true;

	#setUniform(state, name, method) {
		if (state.hasOwnProperty(name)) method.call(this.#shader, name, state[name]);
	}

	draw(options) {
		return new Promise(callback => requestAnimationFrame(time => {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			const shader = this.#shader;
			shader.use();
			this.#setUniform(options, "projection", 			shader.setMat4);
			this.#setUniform(options, "cubeOrientation", 	shader.setMat3);
			this.#setUniform(options, "sideToBeRotated", 	shader.setVec3);
			this.#setUniform(options, "sideRotation", 		shader.setMat3);
			
			if (options.hasOwnProperty("colors")) {
				gl.bindBuffer(gl.ARRAY_BUFFER, this.#colorsVBO);
				gl.bufferSubData(gl.ARRAY_BUFFER, 0, options.colors);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);
			}

			gl.bindVertexArray(this.#vao);
			gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, numberOfQuads);
			gl.useProgram(null);
			gl.bindVertexArray(null);

			callback(time);
		}));
	}

	redraw = this.draw;

	// MUST be called (after render loop stops)
	destructor() {
		gl.bindBuffer(gl.ARRAY_BUFFER, 0);
		for (let i = 0; i < 6; i++) gl.disableVertexAttribArray(i);
		gl.bindVertexArray(0);
		gl.deleteBuffer(this.#quadInstance);
		gl.deleteBuffer(this.#quadPositionsVBO);
		gl.deleteBuffer(this.#quadOrientationsVBO);
		gl.deleteBuffer(this.#colorsVBO);
		gl.deleteVertexArray(this.#vao);
	}
}
