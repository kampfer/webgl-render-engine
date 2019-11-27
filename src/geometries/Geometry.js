export default class Geometry {

    constructor() {
        this._attributes = {};
        this._index = null;
        this.vertices = [];
        this.indices = [];
    }

    addVertex(vertex) {
        this.vertices.push(...vertex);
    }

    removeVertex() {}

}
