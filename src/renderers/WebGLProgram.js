import shaders from './shaders';
import WebGLUniforms from './WebGLUniforms';

export default class {
    
    constructor(gl, parameters) {

        this._gl = gl;

        this._attributes = null;
        this._uniforms = null;

        this.debug = true;

        let shaderGlsl = shaders[parameters.shaderType],
            vertexGlsl = shaderGlsl.vertex,
            fragmentGlsl = shaderGlsl.fragment,
            vertexShader = this.createShader(gl.VERTEX_SHADER, vertexGlsl),
            fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentGlsl),
            program = this.createProgram(vertexShader, fragmentShader);

        this._program = program;
        this._vertexShader = vertexShader;
        this._fragmentShader = fragmentShader;

        this.usedTimes = 0;

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

    }

    createShader(type, source) {

        let gl = this._gl,
            shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (this.debug === true) {
            let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!status) {
                let error = gl.getShaderInfoLog(shader);
                console.error(`创建Shader失败！错误信息：${error}`);
            }
        }

        return shader;

    }

    createProgram(vertexShader, fragmentShader) {

        let gl = this._gl,
            program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        if (this.debug === true) {
            let status = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!status) {
                var error = gl.getProgramInfoLog(program);
                console.error(`创建program失败！错误信息：${error}`);
            }
        }

        return program;

    }

    getProgram() {
        return this._program;
    }

    getAttributes() {
        if (this._attributes) {
            return this._attributes;
        }

        let attributes = this._attributes = {},
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
        if (this._uniforms) {
            return this._uniforms;
        }

        let uniforms = new WebGLUniforms(this._gl, this._program);
        this._uniforms = uniforms;

        return this._uniforms;
    }

    destroy() {
        this._gl.deleteProgram(this._program);
        this._program = null;
        this._gl = null;
    }

}