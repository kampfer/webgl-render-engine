import BufferAttribute from '../renderers/WebGLAttribute';

export default class Geometry {

    constructor() {
        this.vertices = [];
        this.colors = [];
        this.indices = [];
        this._attributes = {};
        this.verticesNeedUpdate = false;
        this.colorsNeedUpdate = false;
        this.indicesNeedUpdate = false;
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
            this.setAttribute('position', new BufferAttribute(new Float32Array(this.vertices), 3, false));
            this.verticesNeedUpdate = false;
        }

        if (this.colorsNeedUpdate === true) {
            this.setAttribute('color', new BufferAttribute(new Float32Array(this.colors), 3, false));
            this.colorsNeedUpdate = false;
        }

        if (this.indicesNeedUpdate === true && this.indices.length > 0) {
            this.setIndex(new BufferAttribute(new Int8Array(this.indices), 1, false));
            this.indicesNeedUpdate = false;
        }
    }

}
