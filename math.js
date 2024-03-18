// TODO: Publish this to NPM or something


// Everything is pass-by-value, and you will have to call array.set(...), instead of assigning with '=' sign


export const length = v => Math.sqrt(v.reduce((a, x) => a + x * x, 0));

export function normalized(vector) {
	const l = length(vector);
	return vector.map(x => x / l);
}

export const plus  = (a, b) => a.map((x, i) => x + b[i]);

export const times = (a, s) => a.map(x => x * s);

export const minus = (a, b) => plus(a, times(b, -1));

export const dot = (a, b) => a.reduce((acc, x, i) => acc + x * b[i], 0);

export function cross(a, b) {
  return [
    a[2] * b[3] - a[3] * b[2],
    a[3] * b[1] - a[1] * b[3],
    a[1] * b[2] - a[2] * b[1]
  ];
}


/**
 * @returns @param matrix modified
 */
export function identify3x3(matrix) {
    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 1;
    matrix[5] = 0;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 1;
    return matrix;
}

export const float32Identity = identify3x3(new Float32Array(9));

export const identity3x3 = () =>
[
	1, 0, 0,
	0, 1, 0,
	0, 0, 1,
];


/**
 * @returns @param matrix modified
 */
export function identify4x4(matrix) {
    matrix[ 0] = 1;
    matrix[ 1] = 0;
    matrix[ 2] = 0;
    matrix[ 3] = 0;
    matrix[ 4] = 0;
    matrix[ 5] = 1;
    matrix[ 6] = 0;
    matrix[ 7] = 0;
    matrix[ 8] = 0;
    matrix[ 9] = 0;
    matrix[10] = 1;
    matrix[11] = 0;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    matrix[15] = 1;
    return matrix;
}

export const identity4x4 = () => [
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	0, 0, 0, 1,
];


/**
 * @returns @param out modified
 */
export function multiply3x3(out, a, b) {
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) out[i+j*3] = a[i+0*3]*b[0+j*3] + a[i+1*3]*b[1+j*3] + a[i+2*3]*b[2+j*3];
	return out;
}

export const times3x3 = (a, b) =>
[
	a[0]*b[0] + a[3]*b[1] + a[6]*b[2], a[1]*b[0] + a[4]*b[1] + a[7]*b[2], a[2]*b[0] + a[5]*b[1] + a[8]*b[2],
	a[0]*b[3] + a[3]*b[4] + a[6]*b[5], a[1]*b[3] + a[4]*b[4] + a[7]*b[5], a[2]*b[3] + a[5]*b[4] + a[8]*b[5],
	a[0]*b[6] + a[3]*b[7] + a[6]*b[8], a[1]*b[6] + a[4]*b[7] + a[7]*b[8], a[2]*b[6] + a[5]*b[7] + a[8]*b[8],
];

/**
 * @param axis must be normalized
 */
export function rotationMatrix3x3(axis, angle) {
    const x = axis[0], y = axis[1], z = axis[2];
    const cos = Math.cos(angle), sin = Math.sin(angle);
    return [
		x*x*(1 - cos) + cos,	y*x*(1 - cos) + z*sin,	z*x*(1 - cos) - y*sin,
		x*y*(1 - cos) - z*sin,	y*y*(1 - cos) + cos,	z*y*(1 - cos) + x*sin,
		x*z*(1 - cos) + y*sin,	y*z*(1 - cos) - x*sin,	z*z*(1 - cos) + cos
	];
}

/**
 * @param matrix Initialized as a 3x3 rotation matrix
 * @param axis Must be normalized
 * @param angle In radians
 * @returns matrix
 */
export function rotate3x3Matrix(matrix, axis, angle) {
    const x = axis[0], y = axis[1], z = axis[2];
    const cos = Math.cos(angle), sin = Math.sin(angle);

    matrix[0] = x*x*(1 - cos) + cos;
    matrix[1] = y*x*(1 - cos) + z*sin;
    matrix[2] = z*x*(1 - cos) - y*sin;
    matrix[3] = x*y*(1 - cos) - z*sin;
    matrix[4] = y*y*(1 - cos) + cos;
    matrix[5] = z*y*(1 - cos) + x*sin;
    matrix[6] = x*z*(1 - cos) + y*sin;
    matrix[7] = y*z*(1 - cos) - x*sin;
    matrix[8] = z*z*(1 - cos) + cos;

    return matrix;
}


/**
 * @returns @param matrix modified
 */
export function perspectivize(matrix, fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);

    matrix[ 0] = f / aspect;
    matrix[ 1] = 0;
    matrix[ 2] = 0;
    matrix[ 3] = 0;
    matrix[ 4] = 0;
    matrix[ 5] = f;
    matrix[ 6] = 0;
    matrix[ 7] = 0;
    matrix[ 8] = 0;
    matrix[ 9] = 0;
    matrix[11] = -1;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[15] = 0;

    if (far !== Infinity) {
      const nf = 1 / (near - far);
      matrix[10] = (far + near) * nf;
      matrix[14] = 2 * far * near * nf;
    } else {
      matrix[10] = -1;
      matrix[14] = -2 * near;
    }

    return matrix;
}

/**
 * @returns @param matrix modified
 */
export function orthograph(matrix, fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);

    matrix[ 0] = f / (aspect * near);
    matrix[ 1] = 0;
    matrix[ 2] = 0;
    matrix[ 3] = 0;
    matrix[ 4] = 0;
    matrix[ 5] = f / near;
    matrix[ 6] = 0;
    matrix[ 7] = 0;
    matrix[8] = 0;
    matrix[9] = 0;
    matrix[11] = 0;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[15] = 1;

    if (far !== Infinity) {
        const nf = 1 / (near - far);
        matrix[10] = 2 * nf;
        matrix[14] = (far + near) * nf;
      } else {
        matrix[10] = 0;
        matrix[14] = -1;
      }
  
      return matrix;
}
