import GraphObject from './GraphObject';

export default class Plane extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = 'Points';
    }

}