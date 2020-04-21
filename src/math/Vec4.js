export default class Vec3 {

    constructor(x = 0, y = 0, z = 0, w = 1) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

    }

    set(x, y, z, w) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;

    }

    setFromBufferAttribute(attribute, index) {

        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        this.z = attribute.getZ(index);
        this.w = attribute.getW(index);

        return this;

    }

    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    }

    divideScalar(s) {
        return this.multiplyScalar(1 / s);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    }

    normalize() {
        return this.divideScalar(this.length() || 1);
    }

}