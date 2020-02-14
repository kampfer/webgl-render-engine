import GraphObject from './GraphObject';
import { OBJECT_TYPE_MESH } from './constants';

export default class Mesh extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = OBJECT_TYPE_MESH;
    }

    clone(recursive) {
        return new this.constructor(this.geometry, this.material).copy(this, recursive);
    }

}
