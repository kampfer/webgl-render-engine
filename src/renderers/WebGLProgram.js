import shaders from '../shaders';
import  * as webglUtils from '../utils/webgl';

export default class {
    
    constructor(gl, key, parameters) {
        this._gl = gl;
        this._key = key;
        this._program = this.createProgram(this._gl, parameters.shaderType);
        this._attributeCache = null;
        this._uniformCache = null;
    }

    createProgram(gl, shaderType) {
        let shaderGlsl  = shaders[shaderType];
        return webglUtils.createProgramBySource(gl, shaderGlsl.vertexShader, shaderGlsl.fragmentShader);
    }

    getProgram() {
        return this._program;
    }

    getAttributes() {
        if (this._attributeCache) {
            return this._attributeCache;
        }

        let attributes = this._attributeCache = {},
            gl = this._gl,
            program = this._program,
            n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for(let i = 0; i < n; i++) {
            let info = gl.getActiveAttrib(program, i),
                name = info.name,
                addr = gl.getAttribLocation(program, name);
            attributes[name] = addr;
        }
        return attributes;
    }

    getUniforms() {
        if (this._uniformCache) {
            return this._uniformCache;
        }

        let uniforms = this._uniformCache = {},
            gl = this._gl,
            program = this._program,
            n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < n; i++) {
            let info = gl.getActiveUniform(program, i),
                name = info.name,
                addr = gl.getUniformLocation(program, name);
            uniforms[name] = addr;
        }
        return uniforms;
    }

    destroy() {
        this._gl.deleteProgram(this._program);
        this._program = null;
        this._gl = null;
    }

}