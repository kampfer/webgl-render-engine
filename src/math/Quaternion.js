export default class Quaternion {

    constructor(x = 0, y = 0, z = 0, w = 1) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
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

    get w() {
        return this._w;
    }

    set w(v) {
        this._w = v;
    }

    set(x, y, z, w) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
        return this;
    }

    copy(q) {
        this._x = q.x;
        this._y = q.y;
        this._z = q.z;
        this._w = q.w;
        return this;
    }

    setFromArray(array) {
        this._x = array[0];
        this._y = array[1];
        this._z = array[2];
        this._w = array[3];
    }

    setFromEuler(euler) {
        let x = euler.x,
            y = euler.y,
            z = euler.z,
            order = euler.order,
            c1 = Math.cos(x / 2),
            c2 = Math.cos(y / 2),
            c3 = Math.cos(z / 2),
            s1 = Math.sin(x / 2),
            s2 = Math.sin(y / 2),
            s3 = Math.sin(z / 2);

        if ( order === 'XYZ' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if ( order === 'YXZ' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        } else if ( order === 'ZXY' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if ( order === 'ZYX' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        } else if ( order === 'YZX' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if ( order === 'XZY' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        }

        return this;
    }

    setFromAxisAngle(axis, angle) {
        let halfAngle = angle / 2,
            s = Math.sin(halfAngle),
            c = Math.cos(halfAngle);

        this._x = axis.x * s;
        this._y = axis.y * s;
        this._z = axis.z * s;
        this._w = c;

        return this;
    }

    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    // https://github.com/mrdoob/three.js/blob/master/src/math/Quaternion.js#L293
    setFromRotationMatrix(m) {
        let te = m.elements,
            m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
            m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
            m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],
            trace = m11 + m22 + m33,
            s;

        if ( trace > 0 ) {

            s = 0.5 / Math.sqrt( trace + 1.0 );

            this._w = 0.25 / s;
            this._x = ( m32 - m23 ) * s;
            this._y = ( m13 - m31 ) * s;
            this._z = ( m21 - m12 ) * s;

        } else if ( m11 > m22 && m11 > m33 ) {

            s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

            this._w = ( m32 - m23 ) / s;
            this._x = 0.25 * s;
            this._y = ( m12 + m21 ) / s;
            this._z = ( m13 + m31 ) / s;

        } else if ( m22 > m33 ) {

            s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

            this._w = ( m13 - m31 ) / s;
            this._x = ( m12 + m21 ) / s;
            this._y = 0.25 * s;
            this._z = ( m23 + m32 ) / s;

        } else {

            s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

            this._w = ( m21 - m12 ) / s;
            this._x = ( m13 + m31 ) / s;
            this._y = ( m23 + m32 ) / s;
            this._z = 0.25 * s;

        }

        return this;
    }

    setFromQuaternionsProduct(a, b) {
        let ax = a.x, ay = a.y, az = a.z, aw = a.w,
            bx = b.x, by = b.y, bz = b.z, bw = b.w;

        this._x = ax * bw + aw * bx + ay * bz - az * by;
        this._y = ay * bw + aw * by + az * bx - ax * bz;
        this._z = az * bw + aw * bz + ax * by - ay * bx;
        this._w = aw * bw - ax * bx - ay * by - az * bz;

        return this;
    }

    conjugate() {
        this._x = -this._x;
        this._y = -this._y;
        this._z = -this._z;
        return this;
    }

    multiply(q) {
        return this.setFromQuaternionsProduct(this, q);
    }

    premultiply(q) {
        return this.setFromQuaternionsProduct(q, this);
    }

    inverse() {
        return this.conjugate();
    }

    dot(q) {
        return this._x * q.x + this._y * q.y + this._z * q.z + this._w * q.w;
    }

    lengthSquared() {
        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }

    length() {
        return Math.sqrt(this.lengthSquared());
    }

    normalize() {
        let l = this.length();

        if (l === 0) {
            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._w = 1;
        } else {
            this._x /= l;
            this._y /= l;
            this._z /= l;
            this._w /= l;
        }

        return this;
    }

    slerp() {}

    static slerpFlat() {}

    static slerp() {}

}