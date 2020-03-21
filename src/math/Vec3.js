export default class Vec3 {

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    setFromScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        return this;
    }

    setFromArray(array, offset = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
    }

    setFromVectorsSum(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }

    setFromVectorsDiff(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }

    setFromMatrixPosition(m) {
        let e = m.elements;
        this.x = e[12];
        this.y = e[13];
        this.z = e[14];
        return this;
    }

    setFromMatrix4Column(m, index) {
        return this.setFromArray(m.elements, index * 4);
    }

    setFromMatrix3Column(m, index) {
        return this.setFromArray(m.elements, index * 3);
    }

    getComponent(index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            default:
                throw new Error(`Vec3: 索引${index}超过边界`)
        }
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    subScalar(s) {
        return this.addScalar(-s);
    }

    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }

    divideScalar(s) {
        return this.multiplyScalar(1 / s);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /*
     * 0 4 8  12  x
     * 1 5 9  13  y
     * 2 6 10 14  z
     * 3 7 11 15  1
     */
    applyMatrix4(m) {
        let x = this.x,
            y = this.y,
            z = this.z,
            e = m.elements,
            w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

        return this;
    }

    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        return this;
    }

    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
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
        
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    // https://zh.wikipedia.org/wiki/球座標系
    // wiki上坐标系的xyz轴朝向与webgl不同，需要注意
    setFromSphericalCoords(radius, theta, phi) {
        let s = Math.sin(theta);
        this.x = s * Math.sin(phi) * radius;
        this.y = Math.cos(theta) * radius;
        this.z = s * Math.cos(phi) * radius;
        return this;
    }

    setFromSpherical(s) {
        return this.setFromSphericalCoords(s.radius, s.theta, s.phi);
    }

    setFromBufferAttribute(attribute, index) {
        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        this.z = attribute.getZ(index);
        return this;
    }

    // 从世界坐标系转换到NDC坐标系
    project(camera) {
        return this.applyMatrix4(camera.worldMatrixInverse).applyMatrix4(camera.projectionMatrix);
    }

    // 从NDC转换到世界坐标系
    unproject(camera) {
        return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.worldMatrix);
    }

    clone() {
        return new this.constructor(this.x, this.y, this.z);
    }

}