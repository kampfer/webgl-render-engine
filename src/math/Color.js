export default class Color {

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    set(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }

    setFromArray(array, offset = 0) {
        this.r = array[offset];
        this.g = array[offset + 1];
        this.b = array[offset + 2];
        return this;
    }

    copy(c) {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        return this;
    }

    clone() {
        return new this.constructor(this.r, this.g, this.b);
    }

}