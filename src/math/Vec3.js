export default class Vec3 {

    constructor(x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    get x() {
        return this._x;
    }

    set x(v) {
        this._x = v;
    }

    get y() {
        return this._y;
    }

    set y(v) {
        this._y = v;
    }

    get z() {
        return this._z;
    }

    set z(v) {
        this._z = v;
    }

    set(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    setFromArray(array, offset = 0) {
        this._x = array[offset];
        this._y = array[offset + 1];
        this._z = array[offset + 2]
    }

    getComponent(index) {
        switch (index) {
            case 0:
                return this._x;
            case 1:
                return this._y;
            case 2:
                return this._z;
            default:
                throw new Error(`Vec3: 索引${index}超过边界`)
        }
    }

    add(v) {
        this._x += v.x;
        this._y += v.y;
        this._z += v.z;
        return this;
    }

    addScalar(s) {
        this._x += s;
        this._y += s;
        this._z += s;
        return this;
    }

    sub(v) {
        this._x -= v.x;
        this._y -= v.y;
        this._z -= v.z;
        return this;
    }

    subScalar(s) {
        return this.addScalar(-s);
    }

    multiply(v) {
        this._x *= v.x;
        this._y *= v.y;
        this._z *= v.z;
        return this;
    }

    multiplyScalar(s) {
        this._x *= s;
        this._y *= s;
        this._z *= s;
        return this;
    }

    divide(v) {
        this._x /= v.x;
        this._y /= v.y;
        this._z /= v.z;
        return this;
    }

    divideScalar(s) {
        return this.multiplyScalar(1 / s);
    }

    length() {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
    }

}