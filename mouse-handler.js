import { length, identify3x3, normalized, rotationMatrix3x3, times3x3, minus, cross } from "./math.js";

export default function cubeOrientationInit(renderer) {
	const mouse = {
		currentPosition: [0, 0],
		previousPosition: [0, 0],
		velocity: [0, 0],
		inititally: true
	};

	canvas.onmousemove = event => { // needs to be scaled according to viewport as well
		mouse.previousPosition = mouse.currentPosition;
		mouse.currentPosition = [ event.clientX, -event.clientY ];
		if (mouse.inititally) mouse.inititally = false;
		else mouse.velocity = minus(mouse.currentPosition, mouse.previousPosition); // TODO: Divide by timestep
	};

	//const cubeOrientation = identify3x3(new Float32Array(9));
	const cubeOrientation = new Float32Array([
		0.75,
		0.2499999999999999,
		-0.6123724356957945,
		0.2499999999999999,
		0.75,
		0.6123724356957945,
		0.6123724356957945,
		-0.6123724356957945,
		0.5000000000000001
	  ]);

	async function orient() {
		if (mouse.velocity[0] == 0 && mouse.velocity[1] == 0) return;
		const axis = normalized([-mouse.velocity[1], mouse.velocity[0], 0]);

		//const axis = normalized(cross([...mouse.previousPosition, 0], [...mouse.velocity, 0]));

		cubeOrientation.set(times3x3(rotationMatrix3x3(axis, length(mouse.velocity) / 300), cubeOrientation));
		await renderer.redraw({ cubeOrientation });
	}

	// TODO: capture mouse events?: https://bugs.chromium.org/p/chromium/issues/detail?id=246536
	canvas.onmousedown = event => event.target.addEventListener("mousemove", orient);
	canvas.onmouseup = event => event.target.removeEventListener("mousemove", orient);

	return cubeOrientation;
}
