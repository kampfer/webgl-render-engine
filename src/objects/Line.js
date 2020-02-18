import GraphObject from './GraphObject';
import { OBJECT_TYPE_LINE } from '../constants';

export default class Line extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = OBJECT_TYPE_LINE;
    }

    update() {
        this.geometry.update();
        this.material.update();
    }

}
