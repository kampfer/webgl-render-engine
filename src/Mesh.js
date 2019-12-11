import GraphObject from './GraphObject';

export default class Mesh extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = 'Mesh';
    }

}