import WebGLProgram from './WebGLProgram';
import { ObjectType } from '../constants';

export default class WebGLProgramManager {

    constructor(gl) {
        this._gl = gl;
        this._programs = {};
    }

    // 暂时使用绘制对象的类型作为program的标识符
    getProgramType(graphObject) {
        let type;
        switch(graphObject.type) {
            case ObjectType.Points:
                type = 'points';
                break;
            case ObjectType.Line:
            case ObjectType.Plane:
            case ObjectType.Mesh:
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