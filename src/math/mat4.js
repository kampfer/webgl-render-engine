import cross from './cross';
import dot from './dot';
import Vec3 from './Vec3';

export default class Mat4 {

    constructor(src) {
        if (src) {
            let d = new Float32Array(16);
            for (let i = 0; i < 16; i++) {
                d[i] = src[i];
            }
            this.elements = d;
        } else {
            this.elements = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
        }
    }

    copy(src) {
        let se = src.elements,
            te = this.elements;

        if (se === te) {
            return;
        }

        for (let i = 0; i < 16; ++i) {
            te[i] = se[i];
        }

        return this;
    }

    setFromArray(array) {
        let te = this.elements;

        for (let i = 0; i < 16; ++i) {
            te[i] = array[i];
        }

        return this;
    }

    multiply(m) {
        return this.multiplyMatrices(this, m);
    }

    premultiply(m) {
        return this.multiplyMatrices(m, this);
    }

    multiplyMatrices(a, b) {
        let ae = a.elements;
        let be = b.elements;
        let te = this.elements;

        let a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
        let a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
        let a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
        let a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

        let b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
        let b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
        let b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
        let b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

        te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        return this;
    }

    // 行列式
    // http://www.euclideanspace.com/maths/algebra/matrix/functions/determinant/fourD/index.htm
    determinant() {
        let te = this.elements,
            m00 = te[0], m01 = te[4], m02 = te[8],  m03 = te[12],
            m10 = te[1], m11 = te[5], m12 = te[9],  m13 = te[13],
            m20 = te[2], m21 = te[6], m22 = te[10], m23 = te[14],
            m30 = te[3], m31 = te[7], m32 = te[11], m33 = te[15];

        return (
            m03 * m12 * m21 * m30-m02 * m13 * m21 * m30-m03 * m11 * m22 * m30+m01 * m13 * m22 * m30+
            m02 * m11 * m23 * m30-m01 * m12 * m23 * m30-m03 * m12 * m20 * m31+m02 * m13 * m20 * m31+
            m03 * m10 * m22 * m31-m00 * m13 * m22 * m31-m02 * m10 * m23 * m31+m00 * m12 * m23 * m31+
            m03 * m11 * m20 * m32-m01 * m13 * m20 * m32-m03 * m10 * m21 * m32+m00 * m13 * m21 * m32+
            m01 * m10 * m23 * m32-m00 * m11 * m23 * m32-m02 * m11 * m20 * m33+m01 * m12 * m20 * m33+
            m02 * m10 * m21 * m33-m00 * m12 * m21 * m33-m01 * m10 * m22 * m33+m00 * m11 * m22 * m33
        );
    }

    // 逆矩阵
    // http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    // https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js#L525
    // TODO: threejs复用了一部分计算结果，可以参考改进
    setInverseOf(m) {
        let te = this.elements,
            me = m.elements,
            m00 = me[0], m01 = me[4], m02 = me[8],  m03 = me[12],
            m10 = me[1], m11 = me[5], m12 = me[9],  m13 = me[13],
            m20 = me[2], m21 = me[6], m22 = me[10], m23 = me[14],
            m30 = me[3], m31 = me[7], m32 = me[11], m33 = me[15];

            te[0] = m12*m23*m31 - m13*m22*m31 + m13*m21*m32 - m11*m23*m32 - m12*m21*m33 + m11*m22*m33;
            te[4] = m03*m22*m31 - m02*m23*m31 - m03*m21*m32 + m01*m23*m32 + m02*m21*m33 - m01*m22*m33;
            te[8] = m02*m13*m31 - m03*m12*m31 + m03*m11*m32 - m01*m13*m32 - m02*m11*m33 + m01*m12*m33;
            te[12] = m03*m12*m21 - m02*m13*m21 - m03*m11*m22 + m01*m13*m22 + m02*m11*m23 - m01*m12*m23;
            te[1] = m13*m22*m30 - m12*m23*m30 - m13*m20*m32 + m10*m23*m32 + m12*m20*m33 - m10*m22*m33;
            te[5] = m02*m23*m30 - m03*m22*m30 + m03*m20*m32 - m00*m23*m32 - m02*m20*m33 + m00*m22*m33;
            te[9] = m03*m12*m30 - m02*m13*m30 - m03*m10*m32 + m00*m13*m32 + m02*m10*m33 - m00*m12*m33;
            te[13] = m02*m13*m20 - m03*m12*m20 + m03*m10*m22 - m00*m13*m22 - m02*m10*m23 + m00*m12*m23;
            te[2] = m11*m23*m30 - m13*m21*m30 + m13*m20*m31 - m10*m23*m31 - m11*m20*m33 + m10*m21*m33;
            te[6] = m03*m21*m30 - m01*m23*m30 - m03*m20*m31 + m00*m23*m31 + m01*m20*m33 - m00*m21*m33;
            te[10] = m01*m13*m30 - m03*m11*m30 + m03*m10*m31 - m00*m13*m31 - m01*m10*m33 + m00*m11*m33;
            te[14] = m03*m11*m20 - m01*m13*m20 - m03*m10*m21 + m00*m13*m21 + m01*m10*m23 - m00*m11*m23;
            te[3] = m12*m21*m30 - m11*m22*m30 - m12*m20*m31 + m10*m22*m31 + m11*m20*m32 - m10*m21*m32;
            te[7] = m01*m22*m30 - m02*m21*m30 + m02*m20*m31 - m00*m22*m31 - m01*m20*m32 + m00*m21*m32;
            te[11] = m02*m11*m30 - m01*m12*m30 - m02*m10*m31 + m00*m12*m31 + m01*m10*m32 - m00*m11*m32;
            te[15] = m01*m12*m20 - m02*m11*m20 + m02*m10*m21 - m00*m12*m21 - m01*m10*m22 + m00*m11*m22;

            return this;

    }

    // 转置矩阵
    transpose() {
        let e = this.elements,
            t;

        t = e[1];   e[1]  = e[4];   e[4]  = t;
        t = e[2];   e[2]  = e[8];   e[8]  = t;
        t = e[3];   e[3]  = e[12];  e[12] = t;
        t = e[6];   e[6]  = e[9];   e[9]  = t;
        t = e[7];   e[7]  = e[13];  e[13] = t;
        t = e[11];  e[11] = e[14];  e[14] = t;

        return this;
    }

    rotate() {}

    setRotate() {}

    translate(x, y, z) {
        let e = this.elements;
        e[12] += e[0] * x + e[4] * y + e[8]  * z;
        e[13] += e[1] * x + e[5] * y + e[9]  * z;
        e[14] += e[2] * x + e[6] * y + e[10] * z;
        e[15] += e[3] * x + e[7] * y + e[11] * z;
        return this;
    }

    setTranslate(x, y, z) {
        let e = this.elements;
        e[0] = 1;  e[4] = 0;  e[8]  = 0;  e[12] = x;
        e[1] = 0;  e[5] = 1;  e[9]  = 0;  e[13] = y;
        e[2] = 0;  e[6] = 0;  e[10] = 1;  e[14] = z;
        e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        return this;
    }

    scale() {}

    setScale() {}

    setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        let nx = eyeX - centerX,
            ny = eyeY - centerY,
            nz = eyeZ - centerZ,
            rln = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
        nx *= rln;
        ny *= rln;
        nz *= rln;

        if (nx === upX && ny === upY && nz === upZ) {
            throw('vector n === vector up !!');
        }

        // u = v x n
        // TODO 上方向可能与相机朝向一致，叉积会出问题，怎么处理？？？
        let [ux, uy, uz] = cross([upX, upY, upZ], [nx, ny, nz]),
            rlu = 1 / Math.sqrt(ux * ux + uy * uy + uz * uz);
        ux *= rlu;
        uy *= rlu;
        uz *= rlu;
    
        // v = n x u
        let [vx, vy, vz] = cross([nx, ny, nz], [ux, uy, uz]),
            e = this.elements;

        e[0] = ux;  e[4] = uy;  e[8]  = uz; e[12] = -dot([ux, uy, uz], [eyeX, eyeY, eyeZ]);
        e[1] = vx;  e[5] = vy;  e[9]  = vz; e[13] = -dot([vx, vy, vz], [eyeX, eyeY, eyeZ]);
        e[2] = nx;  e[6] = ny;  e[10] = nz; e[14] = -dot([nx, ny, nz], [eyeX, eyeY, eyeZ]);
        e[3] = 0;   e[7] = 0;   e[11] = 0;  e[15] = 1

        return this;
    }

    lookAt( eye, target, up ) {

        let te = this.elements;

        _z.setFromVectorsDiff( eye, target );

        if ( _z.lengthSquared() === 0 ) {   // eye和target位置相同
            _z.z = 1;
        }

        _z.normalize();
        _x.setFromVectorsCross(up, _z);

        if ( _x.lengthSquared() === 0 ) {   // up和z平行
            if ( Math.abs( up.z ) === 1 ) {
                _z.x += 0.0001;
            } else {
                _z.z += 0.0001;
            }

            _z.normalize();
            _x.setFromVectorsCross( up, _z );
        }

        _x.normalize();
        _y.setFromVectorsCross( _z, _x );

        te[0] = _x.x; te[4] = _y.x; te[8]  = _z.x;
        te[1] = _x.y; te[5] = _y.y; te[9]  = _z.y;
        te[2] = _x.z; te[6] = _y.z; te[10] = _z.z;

        return this;

    }

    // 《3D游戏与计算机图形学中的数学方法》 - 第5章 - 3D引擎中的几何学 - P70
    // 暂时未考虑远锥平面无穷远的情况
    setPerspective(left, right, top, bottom, near, far) {
        let te = this.elements;

        te[0] = 2 * near / (right - left);
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;

        te[4] = 0;
        te[5] = 2 * near / (top - bottom);
        te[6] = 0;
        te[7] = 0;

        te[8] = (right + left) / (right - left);
        te[9] = (top + bottom) / (top - bottom);
        te[10] = -(far + near) / (far - near);
        te[11] = -1;

        te[12] = 0;
        te[13] = 0;
        te[14] = -2 * near * far / (far - near);
        te[15] = 0;

        return this;
    }

    // 《3D游戏与计算机图形学中的数学方法》 - 第5章 - 3D引擎中的几何学 - P73
    // 暂时未考虑远锥平面无穷远的情况
    setOrthographic(left, right, top, bottom, near, far) {
        let te = this.elements;

        te[0] = 2 / (right - left);
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;

        te[4] = 0;
        te[5] = 2 / (top - bottom);
        te[6] = 0;
        te[7] = 0;

        te[8] = 0;
        te[9] = 0;
        te[10] = -2 / (far - near);
        te[11] = 0;

        te[12] = - (right + left) / (right - left);
        te[13] = - (top + bottom) / (top - bottom);
        te[14] = - (far + near) / (far - near);
        te[15] = 1;

        return this;
    }

    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm
    // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#transformationss
    compose(position, quaternion, scale) {
        let te = this.elements;

        let qx = quaternion.x, qy = quaternion.y, qz = quaternion.z, qw = quaternion.w;
        let sx = scale.x, sy = scale.y, sz = scale.z;

        te[0] = (1 - 2 * qy * qy - 2 * qz * qz) * sx;
        te[1] = (2 * qx * qy + 2 * qz * qw) * sx;
        te[2] = (2 * qx * qz - 2 * qy * qw) * sx;
        te[3] = 0;

        te[4] = (2 * qx * qy - 2 * qz * qw) * sy;
        te[5] = (1 - 2 * qx * qx - 2 * qz * qz) * sy;
        te[6] = (2 * qy * qz + 2 * qx * qw) * sy;
        te[7] = 0;

        te[8] = (2 * qx * qz + 2 * qy * qw) * sz;
        te[9] = (2 * qy * qz - 2 * qx * qw) * sz;
        te[10] = (1 - 2 * qx * qx - 2 * qy * qy) * sz;
        te[11] = 0;

        te[12] = position.x;
        te[13] = position.y;
        te[14] = position.z;
        te[15] = 1;

        return this;
    }

    // https://math.stackexchange.com/questions/237369/given-this-transformation-matrix-how-do-i-decompose-it-into-translation-rotati
    decompose(position, quaternion, scale) {
        let te = this.elements;

        let sx = _v.set(te[0], te[1], te[2]).length(),
            sy = _v.set(te[4], te[5], te[6]).length(),
            sz = _v.set(te[8], te[9], te[10]).length();

        scale.set(sx, sy, sz);

        position.set(te[12], te[13], te[14]);

        _m.copy(this);

        let me = _m.elements;
        me[0] /= sx; me[1] /= sx; me[2] /= sx;
        me[4] /= sy; me[5] /= sy; me[6] /= sy;
        me[8] /= sz; me[9] /= sz; me[10] /= sz;

        quaternion.setFromRotationMatrix(_m);

        return this;
    }

    extractRotation() {}

}

let _v = new Vec3(),
    _x = new Vec3(),
    _y = new Vec3(),
    _z = new Vec3(),
    _m = new Mat4();    // 在头部声明_m会报错，所以挪到这里