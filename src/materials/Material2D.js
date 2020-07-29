import Material from './Material';
import {
    MATERIAL_TYPE_2D
} from '../constants';

export default class Material2D extends Material {

    constructor(opts) {

        super(opts);

        this.type = MATERIAL_TYPE_2D;

    }

}