export class Texture {
    constructor(data, width, height) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    apply() {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    destructor() {
        gl.bindTexture(gl.TEXTURE_2D, 0);
        gl.deleteTexture(this.texture);
    }
}

export function genTexture(width, height, radius) {
    const image = new Uint8Array(width * height * 3);
    const boundary = Math.pow(radius, 4);
    for (let i = 0; i < width; i++) for (let j = 0; j < height; j++) {
        const location = (i + (j * width)) * 3;
        const x = i - (width / 2);
        const y = j - (height / 2);
        if (Math.pow(x, 4) + Math.pow(y, 4) <= boundary) image[location + 0] = image[location + 1] = image[location + 2] = 255;
        else image[location + 0] = image[location + 1] = image[location + 2] = 0;
    }
    return new Texture(image, width, height);
}
