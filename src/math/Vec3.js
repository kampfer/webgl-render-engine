export default class Vec3 {

    constructor(x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get z() {
        return this._z;
    }

    set(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
        return this;
    }

    copy(v) {
        this._x = v.x;
        this._y = v.y;
        this._z = v.z;
        return this;
    }

    setFromArray(array, offset = 0) {
        this._x = array[offset];
        this._y = array[offset + 1];
        this._z = array[offset + 2];
        return this;
    }

    setFromVectorsSum(a, b) {
        this._x = a.x + b.x;
        this._y = a.y + b.y;
        this._z = a.z + b.z;
        return this;
    }

    setFromVectorsDiff(a, b) {
        this._x = a.x - b.z;
        this._y = a.y - b.y;
        this._z = a.z - b.z;
        return this;
    }

    setFromMatrixPosition(m) {
        let e = m.elements;
        this._x = e[12];
        this._y = e[13];
        this._z = e[14];
        return this;
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

    lengthSquared() {
        return this._x * this._x + this._y * this._y + this._z * this._z;
    }

    /*
     * 0 4 8  12  x
     * 1 5 9  13  y
     * 2 6 10 14  z
     * 3 7 11 15  1
     */
    applyMatrix4(m) {
        let x = this._x,
            y = this._y,
            z = this._z,
            e = m.elements,
            w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

        this._x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this._y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this._z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

        return this;
    }

    max(v) {
        this._x = Math.max(this._x, v.x);
        this._y = Math.max(this._y, v.y);
        this._z = Math.max(this._z, v.z);
        return this;
    }

    min(v) {
        this._x = Math.min(this._x, v.x);
        this._y = Math.min(this._y, v.y);
        this._z = Math.min(this._z, v.z);
        return this;
    }

    normalize() {
        return this.divideScalar(this.length() || 1);
    }

    cross(v) {
        return this.setFromVectorsCross(this, v);
    }

    setFromVectorsCross(a, b) {
        let ax = a.x, ay = a.y, az = a.z,
            bx = b.x, by = b.y, bz = b.z;
        
        this._x = ay * bz - az * by;
		this._y = az * bx - ax * bz;
		this._z = ax * by - ay * bx;

		return this;
    }

}