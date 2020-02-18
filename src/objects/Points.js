import GraphObject from './GraphObject';
import { OBJECT_TYPE_POINTS } from '../constants';

export default class Points extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = OBJECT_TYPE_POINTS;
    }

}