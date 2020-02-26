import {
    MATERIAL_TYPE_BASIC
} from '../constants';

export default class Material {

    constructor(opts = {}) {
        this.type = MATERIAL_TYPE_BASIC;
        this.color = opts.color;
        this.vertexColors = opts.vertexColors === true;
    }

}
