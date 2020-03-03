import Material from './Material';
import {
    MATERIAL_TYPE_LINE_BASIC
} from '../constants';

export default class LineBasicMaterial extends Material {

    constructor(opts) {
        super(opts);

        this.type = MATERIAL_TYPE_LINE_BASIC;
    }

}