import WebGLProgram from './WebGLProgram';
import {
    OBJECT_TYPE_POINTS,
    OBJECT_TYPE_LINE,
    OBJECT_TYPE_PLANE,
    OBJECT_TYPE_MESH
} from '../constants';

export default class WebGLProgramManager {

    constructor(gl) {
        this._gl = gl;
        this._programs = {};
    }

    // 暂时使用绘制对象的类型作为program的标识符
    getProgramType(graphObject) {
        let type;
        switch(graphObject.type) {
            case OBJECT_TYPE_POINTS:
                type = 'points';
                break;
            case OBJECT_TYPE_LINE:
                type = 'line';
                break;
            case OBJECT_TYPE_PLANE:
            case OBJECT_TYPE_MESH:
                type = 'base';
                break;
            default:
                type = 'base';
        }
        return type;
    }

    getProgram(graphObject) {
        let gl = this._gl,
            type = this.getProgramType(graphObject),
            program = this._programs[type];

        if (!program) {
            this._programs[type] = program = new WebGLProgram(gl, graphObject);
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