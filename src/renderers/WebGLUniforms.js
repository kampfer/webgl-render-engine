import uniforms from './uniforms';

export default class WebGLUniforms {

    constructor(gl, program) {

        this._uniformMap = {};

        let n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (let i = 0; i < n; i++) {

            let info = gl.getActiveUniform(program, i),
                addr = gl.getUniformLocation(program, info.name);

            this.parseUniform(info, addr);

        }

    }

    // uniform变量名有多种形式：
    // 1. 普通变量(float, int)：`position`
    // 2. 数组(float []): `morphTargtInfluences[0]`
    parseUniform(info, addr) {

        let reg = /(\w+)/gu,
            match = reg.exec(info.name),
            name = match[1];

        let UniformConstructor = uniforms[name],
            uniform = new UniformConstructor(info, addr);

        this.addUniform(name, uniform);

    }

    addUniform(name, uniform) {
        this._uniformMap[name] = uniform;
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