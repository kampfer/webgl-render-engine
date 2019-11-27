import cross from './cross';
import dot from './dot';

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

    set(src) {
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

    multiply(other) {
        if (other instanceof Mat4) {
            let e = this.elements,
                a = this.elements,
                b = other.elements;
            for(let i = 0; i < 4; i++) {
                let a0 = a[i + 0],
                    a1 = a[i + 4],
                    a2 = a[i + 8],
                    a3 = a[i + 12];
                e[i + 0] = a0 * b[0] + a1 * b[1] + a2 * b[2] + a3 * b[3];
                e[i + 4] = a0 * b[4] + a1 * b[5] + a2 * b[6] + a3 * b[7];
                e[i + 8] = a0 * b[8] + a1 * b[9] + a2 * b[10] + a3 * b[11];
                e[i + 12] = a0 * b[12] + a1 * b[13] + a2 * b[14] + a3 * b[15];
            }
        } else {
            throw 'error!';
        }
        return this;
    }

    det() {
        
    }

    // 逆矩阵
    setInverseOf(other) {}

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

    lookAt(eye, target, up) {}

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

    perspective(left, right, top, bottom, near, far) {}

    setOrtho(left, right, top, bottom, near, far) {}

    ortho() {}

}