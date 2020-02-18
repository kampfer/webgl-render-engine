import GraphObject from './GraphObject';
import { OBJECT_TYPE_PLANE } from '../constants';

export default class Plane extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = OBJECT_TYPE_PLANE;
    }

};
