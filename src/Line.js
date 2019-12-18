import GraphObject from './GraphObject';

export default class Line extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = 'Line';
    }

    update() {
        this.geometry.update();
        this.material.update();
    }

}
