import {
    MATERIAL_TYPE_BASIC
} from '../constants';
import Color from '../math/Color';

export default class Material {

    constructor(opts = {}) {
        this.type = MATERIAL_TYPE_BASIC;
        if (opts.color) this.color = new Color(opts.color);
        this.vertexColors = opts.vertexColors === true;
        this.precision = null;
    }

}
