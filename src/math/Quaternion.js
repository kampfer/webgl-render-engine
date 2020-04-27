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

    slerp(q, t) {
        if (t === 0) {
            return this;
        }

        if (t === 1) {
            return this.copy(q);
        }

        let x = this._x,
            y = this._y,
            z = this._z,
            w = this._w,
            cosHalfTheta = w * q.w + x * q.x + y * q.y + z * q.z;
        
        // halfTheta时this和q的夹角，取值范围是：>= 0 && <= PI / 2
        // halfTheta = 0, this和q的方向相同，直接返回this
        // this和q的夹角是钝角，由于双倍覆盖的问题，这里将q取反保证插值路径是最短的
        if (cosHalfTheta >= 1) {
            return this;
        } else if (cosHalfTheta < 0) {
            this._x = -q.x;
            this._y = -q.y;
            this._z = -q.z;
            this._w = -q.w;
            cosHalfTheta = -cosHalfTheta;
        } else {
            this.copy(q);
        }

        let sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);

        // sin值太小时因为精度问题，会被近似为0，导致除以0的错误
        // 出现这种情况使用lerp算法
        if (sinHalfTheta <= Number.EPSILON) {
            let s = 1 - t;
            this._w = s * w + t * this._w;
            this._x = s * x + t * this._x;
            this._y = s * y + t * this._y;
            this._z = s * z + t * this._z;

            return this.normalize();
        }

        let halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta),
            alpha = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            beta = Math.sin(t * halfTheta) / sinHalfTheta;

        this._w = alpha * w + beta * this._w;
        this._x = alpha * x + beta * this._x;
        this._y = alpha * y + beta * this._y;
        this._z = alpha * z + beta * this._z;

        return this;
    }

    static slerp(qStart, qEnd, qTarget, t) {
        return qTarget.copy(qStart).slerp(qEnd, t);
    }

    // 步骤与slerp一样
    static slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
        let x0 = src0[srcOffset0 + 0],
            y0 = src0[srcOffset0 + 1],
            z0 = src0[srcOffset0 + 2],
            w0 = src0[srcOffset0 + 3],
            x1 = src1[srcOffset1 + 0],
            y1 = src1[srcOffset1 + 1],
            z1 = src1[srcOffset1 + 2],
            w1 = src1[srcOffset1 + 3];

        if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
            let s = 1 - t,
                cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
                dir = ( cos >= 0 ? 1 : - 1 ),
                sqrSin = 1 - cos * cos;

            // 避免精度问题引起的除0错误
            if (sqrSin > Number.EPSILON) {
                let sin = Math.sqrt(sqrSin),
                    len = Math.atan2(sin, cos * dir);

                s = Math.sin(s * len) / sin;
                t = Math.sin(t * len) / sin;
            }

            var tDir = t * dir;

            x0 = x0 * s + x1 * tDir;
            y0 = y0 * s + y1 * tDir;
            z0 = z0 * s + z1 * tDir;
            w0 = w0 * s + w1 * tDir;

            // 使用lerp得到的结果需要归一化
            if (s === 1 - t) {
                let f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

                x0 *= f;
                y0 *= f;
                z0 *= f;
                w0 *= f;
            }
        }

        dst[dstOffset + 0] = x0;
        dst[dstOffset + 1] = y0;
        dst[dstOffset + 2] = z0;
        dst[dstOffset + 3] = w0;
    }

    clone() {
        return new this.constructor(this._x, this._y, this._z, this._w);
    }

}