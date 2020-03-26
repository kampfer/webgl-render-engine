export default class Mat3 {

    constructor() {
        // 普通array和typedarray在进行数学计算时，结果的精度是不一样的。
        // Float32Array比Array低。（Float64Array可能是一致的，因为普通array中的数值是按64位双精度浮点数的格式存储的）
        this.elements = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]);
    }

    set(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        let te = this.elements;
        te[0] = m11; te[3] = m12; te[6] = m13;
        te[1] = m21; te[4] = m22; te[7] = m23;
        te[2] = m31; te[5] = m32; te[8] = m33;
        return this;
    }

    setFromMatrix4(m) {
        let me = m.elements;
        this.set(
            me[0], me[4], me[8],
            me[1], me[5], me[9],
            me[2], me[6], me[10]
        );
        return this;
    }

    setInverseOf(m) {
        let me = m.elements,
            te = this.elements,
            m11 = me[0], m12 = me[3], m13 = me[6],
            m21 = me[1], m22 = me[4], m23 = me[7],
            m31 = me[2], m32 = me[5], m33 = me[8],
            det = this.determinant();

        te[0] = (m22 * m33 - m23 * m32) / det;
        te[1] = (m23 * m31 - m21 * m33) / det;
        te[2] = (m21 * m32 - m22 * m31) / det;

        te[3] = (m13 * m32 - m12 * m33) / det;
        te[4] = (m11 * m33 - m13 * m31) / det;
        te[5] = (m12 * m31 - m11 * m32) / det;

        te[6] = (m12 * m23 - m13 * m22) / det;
        te[7] = (m13 * m21 - m11 * m23) / det;
        te[8] = (m11 * m22 - m12 * m21) / det;

        return this;
    }

    determinant() {
        let te = this.elements,
            m11 = te[0], m12 = te[3], m13 = te[6],
            m21 = te[1], m22 = te[4], m23 = te[7],
            m31 = te[2], m32 = te[5], m33 = te[8];
        
        return (
            m11 * m22 * m33 -
            m11 * m23 * m32 -
            m12 * m21 * m33 +
            m12 * m23 * m31 +
            m13 * m21 * m32 -
            m13 * m22 * m31
        );
    }

    // 0 3 6      0 1 2
    // 1 4 7  ->  3 4 5
    // 2 5 8      6 7 8
    transpose() {
        let te = this.elements, tmp;

        tmp = te[1]; te[1] = te[3]; te[3] = tmp;
        tmp = te[2]; te[2] = te[6]; te[6] = tmp;
        tmp = te[5]; te[5] = te[7]; te[7] = tmp;

        return this;
    }

    getNormalMatrix(mat4) {
        return this.setFromMatrix4(mat4).setInverseOf(this).transpose();
    }

}