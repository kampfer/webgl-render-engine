import {
    MATERIAL_TYPE_BASIC
} from '../constants';
import Color from '../math/Color';

export default class Material {

    constructor(opts = {}) {

        this.type = MATERIAL_TYPE_BASIC;

        if (opts.color) this.color = new Color(opts.color);

        this.vertexColors = opts.vertexColors === true;

        // WebGLProgramManager使用此属性生成program key
        // WebGLProgram使用此属性的配置shader
        // 优先级：WebGLCapabilities.precision > material.precision > WebGLRenderer.precision
        this.precision = null;

        this.wireframe = opts.wireframe;

        this.morphTargets = false;
        this.morphNormals = false;
    }

}
