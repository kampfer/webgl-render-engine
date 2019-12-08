import WebGLProgram from './WebGLProgram';

export default class {

    constructor(gl) {
        this._gl = gl;
        this._programs = {};
    }

    // 暂时使用绘制对象的类型作为program的标识符
    getProgramType(graphObject) {
        let type;
        switch(graphObject.type) {
            case 'Points':
                type = 'points';
                break;
            case 'Line':
            case 'Plane':
                type = 'base';
                break;
            case 'wireframe':
                type = 'wireframe';
                break;
            default:
                throw '不支持的类型';
        }
        return type;
    }

    getProgram(graphObject) {
        let gl = this._gl,
            type = this.getProgramType(graphObject),
            program = this._programs[type];

        if (!program) {
            this._programs[name] = program = new WebGLProgram(gl, graphObject);
        }

        return program;
    }

    releaseProgram() {}

}