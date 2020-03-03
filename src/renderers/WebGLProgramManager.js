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

        let capabilities = this._capabilities,
            material = object.material,
            materialType = material.type,
            shaderType = shaderTypes[materialType],
            precision = capabilities.precision,
            isWebGL2 = capabilities.isWebGL2;

        if (material.precision !== null) {
            let precision = capabilities.getMaxPrecision(material.precision);
            if (precision !== material.precision) {
                console.warn(`不支持material.precision = ${material.precision}，将使用${precision}`);
            }
        }

        return {
            isWebGL2,
            materialType,
            shaderType,
            vertexColors: material.vertexColors,
            precision,
        };

    }

    // 使用部分参数来合成key
    getProgramKey(parameters) {

        let key = [];

        key.push(parameters.shaderType);
        key.push(parameters.vertexColors);

        return key.join();

    }

    // 使用key作为缓存的键，当配置参数相同时key相同，此时就能复用program
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