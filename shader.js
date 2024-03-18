export default class Shader {
    constructor(vsSource, fsSource) {
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsSource);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) throw "Error compiling vertex shader: " + gl.getShaderInfoLog(vs);

        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fsSource);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) throw "Error compiling fragment shader: " + gl.getShaderInfoLog(fs);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);
        gl.validateProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw "Error linking shaders: " + gl.getProgramInfoLog(this.program);

  		if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) throw "Error validating shaders: " + gl.getProgramInfoLog(this.program);

        gl.detachShader(this.program, vs);
        gl.detachShader(this.program, fs);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
    }

    use() {
        gl.useProgram(this.program);
    }

    setInt(name, value) {
        gl.uniform1i(gl.getUniformLocation(this.program, name), value);
    }

    setFloat(name, value) {
        gl.uniform1f(gl.getUniformLocation(this.program, name), value);
    }

    setVec3(name, value) {
        gl.uniform3fv(gl.getUniformLocation(this.program, name), value);
    }

    setVec4(name, value) {
        gl.uniform4fv(gl.getUniformLocation(this.program, name), value);
    }

    setMat3(name, value) {
        gl.uniformMatrix3fv(gl.getUniformLocation(this.program, name), false, value);
    }

    setMat4(name, value) {
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, name), false, value);
    }

    destructor() {
        gl.useProgram(null);
        gl.deleteProgram(this.program);
    }
}
