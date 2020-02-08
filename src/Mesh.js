import GraphObject from './GraphObject';
import { ObjectType } from './constants';

export default class Mesh extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = ObjectType.Mesh;
    }

    clone(recursive) {
        return new this.constructor(this.geometry, this.material).copy(this, recursive);
    }

}
