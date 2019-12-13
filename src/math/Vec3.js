export default class Vec3 {

    constructor(x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    set(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
        return this;
    }

    setX(x) {
        this._x = x;
        return this;
    }

    setY(y) {
        this._y = y;
        return this;
    }

    setZ(z) {
        this._z = z;
        return this;
    }

    setFromArray(array, offset = 0) {
        this._x = array[offset];
        this._y = array[offset + 1];
        this._z = array[offset + 2]
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }

    getZ() {
        return this._z;
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
        this._x += v.getX();
        this._y += v.getY();
        this._z += v.getZ();
        return this;
    }

    addScalar(s) {
        this._x += s;
        this._y += s;
        this._z += s;
        return this;
    }

    sub(v) {
        this._x -= v.getX();
        this._y -= v.getY();
        this._z -= v.getZ();
        return this;
    }

    subScalar(s) {
        return this.addScalar(-s);
    }

    multiply(v) {
        this._x *= v.getX();
        this._y *= v.getY();
        this._z *= v.getZ();
        return this;
    }

    multiplyScalar(s) {
        this._x *= s;
        this._y *= s;
        this._z *= s;
        return this;
    }

    divide(v) {
        this._x /= v.getX();
        this._y /= v.getY();
        this._z /= v.getZ();
        return this;
    }

    divideScalar(s) {
        return this.multiplyScalar(1 / s);
    }

}