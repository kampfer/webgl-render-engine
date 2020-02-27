import WebGLUniform from './uniforms/WebGLUniform';

export default class WebGLUniforms {

    constructor(gl, program) {

        this._uniformMap = {};

        let n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (let i = 0; i < n; i++) {

            let info = gl.getActiveUniform(program, i),
                name = info.name,
                addr = gl.getUniformLocation(program, name);

            this._uniformMap[name] = new WebGLUniform(info, addr);

        }

    }

    getUniform(name) {
        return this._uniformMap[name];
    }

    eachUniform(callback) {

        let map = this._uniformMap;

        for(let name in map) {

            let uniform = map[name];

            callback(uniform);

        }

    }

}