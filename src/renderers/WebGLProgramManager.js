import WebGLProgram from './WebGLProgram';
import {
    MATERIAL_TYPE_BASIC,
    MATERIAL_TYPE_LINE_BASIC,
} from '../constants';

const shaderTypes = {
    [MATERIAL_TYPE_BASIC]: 'base',
    [MATERIAL_TYPE_LINE_BASIC]: 'line',
};

export default class WebGLProgramManager {

    constructor(gl, capabilities) {
        this._gl = gl;
        this._capabilities = capabilities;
        this._programs = {};
    }

    getParameters(object) {

        let material = object.material,
            materialType = material.type,
            shaderType = shaderTypes[materialType],
            isWebGL2 = this._capabilities.isWebGL2;

        return {
            isWebGL2,
            materialType,
            shaderType,
        };

    }

    getProgramKey(parameters) {

        let key = [];

        if (parameters.shaderType) {
            key.push(parameters.shaderType);
        }

        return key.join();

    }

    getProgram(key, parameters) {
        let gl = this._gl,
            program = this._programs[key];

        if (!program) {
            this._programs[key] = program = new WebGLProgram(gl, parameters);
        }

        return program;
    }

    releaseProgram(key) {
        let program = this._programs[key];
        if (program) {
            program.destroy();
            this._programs.delete(key);
        }
    }

    destroy() {
        this._gl = null;
        for(let key in this._programs) {
            this.releaseProgram(key);
        }
        this._programs = null;
    }

}