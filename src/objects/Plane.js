import GraphObject from '../GraphObject';
import { ObjectType } from '../constants';

export default class Plane extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = ObjectType.Plane;
    }

};
