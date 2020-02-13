import GraphObject from '../GraphObject';
import { ObjectType } from '../constants';

export default class Line extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = ObjectType.Line;
    }

    update() {
        this.geometry.update();
        this.material.update();
    }

}
