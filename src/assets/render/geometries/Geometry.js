import { Float32BufferAttribute, Uint8BufferAttribute } from '../renderers/WebGLAttribute';

export default class Geometry {

    constructor() {
        this.vertices = [];
        this.colors = [];
        this.indices = [];
        this._attributes = {};
        this.verticesNeedUpdate = true;
        this.colorsNeedUpdate = true;
        this.indicesNeedUpdate = true;
    }

    setIndex(v) {
        this.setAttribute('index', v);
        v.isIndex = true;
    }

    setAttribute(name, value) {
        this._attributes[name] = value;
        value.name = name;
    }

    removeAttribue(name) {
        delete this._attributes[name];
    }

    getAttribute(name) {
        return this._attributes[name];
    }

    getAttributes() {
        return this._attributes;
    }

    update() {
        if (this.verticesNeedUpdate === true) {
            this.setAttribute('position', new Float32BufferAttribute(this.vertices, 3, false));
            this.verticesNeedUpdate = false;
        }

        if (this.colorsNeedUpdate === true) {
            this.setAttribute('color', new Float32BufferAttribute(this.colors, 3, false));
            this.colorsNeedUpdate = false;
        }

        if (this.indicesNeedUpdate === true && this.indices.length > 0) {
            this.setIndex(new Uint8BufferAttribute(this.indices, 1, false));
            this.indicesNeedUpdate = false;
        }
    }

}
