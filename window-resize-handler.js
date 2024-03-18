import { identify4x4, identity3x3, identity4x4, orthograph, perspectivize } from "./math.js";

export default function perspectiveInit(renderer) {
	let aspect = canvas.width / canvas.height;

	const projection = perspectivize(new Float32Array(16), Math.PI/6, aspect, 1, Infinity);

	//const projection = orthograph(new Float32Array(16), Math.PI/3, aspect, 6, Infinity);

	//const projection = perspectivize(new Float32Array(16), Math.PI / 7, aspect, 1, Infinity);

	window.onresize = _event => {
		resize(canvas);
		gl.viewport(0, 0, canvas.width, canvas.height);
		const newAspect = canvas.width / canvas.height;
		projection[0] *= (aspect / newAspect);
		aspect = newAspect;
		renderer.redraw({ projection });
	}
	return projection;
}
