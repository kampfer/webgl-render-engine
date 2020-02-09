/**
 * [欧拉角](https://en.wikipedia.org/wiki/Euler_angles)
 * 本代码采用Intrinsic Tait–Bryan angles
 */

import { clamp } from './utils';
import Mat4 from './Mat4';
import Quaternion from './Quaternion';

export const rotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];
export const defaultOrder = rotationOrders[0];

let _m = new Mat4(),
    _q = new Quaternion();

export default class Euler {

    constructor(x = 0, y = 0, z = 0, order = defaultOrder) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order;
    }

    set x(x) {
        this._x = x;
    }

    get x() {
        return this._x;
    }

    set y(y) {
        this._y = y;
    }

    get y() {
        return this._y;
    }

    set z(z) {
        this._z = z;
    }

    get z() {
        return this._z;
    }

    set order(v) {
        this._order = v;
    }

    get order() {
        return this._order;
    }

    set(x, y, z, order) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order || this._order;
        return this;
    }

    copy(euler) {
        return this.set(euler.x, euler.y, euler.z, euler.order);
    }

    clone() {
        return new this.constructor(this._x, this._y, this._z, this._order);
    }

    // m的左上3x3必须是单纯的旋转矩阵，没有被缩放过。
    setFromRotationMatrix(m, order) {
        let me = m.elements,
            m11 = me[0], m12 = me[4], m13 = me[8],
            m21 = me[1], m22 = me[5], m23 = me[9],
            m31 = me[2], m32 = me[6], m33 = me[10];

        order = order || this._order;

        if (order === 'XYZ') {
            this._y = Math.asin(clamp(m13, -1, 1));
            if (Math.abs(m13) < 1 - Number.EPSILON) {
                this._x = Math.atan2(-m23, m33);
                this._z = Math.atan2(-m12, m11);
            } else {    // beta = + PI / 2 || beta = - PI / 2
                this._x = Math.atan2(m32, m22);
                this._z = 0;
            }
        } else if (order === 'YXZ') {
            this._x = Math.asin(-clamp(m23, -1, 1));
            if (Math.abs(m23) < 1 - Number.EPSILON) {
                this._y = Math.atan2(m13, m33);
                this._z = Math.atan2(m21, m22);
            } else {
                this._y = Math.atan2(- m31, m11);
                this._z = 0;
            }
        } else if (order === 'ZXY') {
            this._x = Math.asin(clamp(m32, - 1, 1));
            if (Math.abs(m32) < 1 - Number.EPSILON) {
                this._y = Math.atan2(- m31, m33);
                this._z = Math.atan2(- m12, m22);
            } else {
                this._y = 0;
                this._z = Math.atan2(m21, m11);
            }
        } else if (order === 'ZYX') {
            this._y = Math.asin( - clamp( m31, - 1, 1 ) );
            if ( Math.abs( m31 ) < 1 - Number.EPSILON) {
                this._x = Math.atan2( m32, m33 );
                this._z = Math.atan2( m21, m11 );
            } else {
                this._x = 0;
                this._z = Math.atan2( - m12, m22 );

            }
        } else if (order === 'YZX') {
            this._z = Math.asin( clamp( m21, - 1, 1 ) );
            if ( Math.abs( m21 ) < 1 - Number.EPSILON) {
                this._x = Math.atan2( - m23, m22 );
                this._y = Math.atan2( - m31, m11 );
            } else {
                this._x = 0;
                this._y = Math.atan2( m13, m33 );
            }
        } else if (order === 'XZY') {
            this._z = Math.asin( - clamp( m12, - 1, 1 ) );
            if ( Math.abs( m12 ) < 1 - Number.EPSILON) {
                this._x = Math.atan2( m32, m22 );
                this._y = Math.atan2( m13, m11 );
            } else {
                this._x = Math.atan2( - m23, m33 );
                this._y = 0;

            }
        } else {
            console.warn(`Euler.setFromRotationMatrix：不支持的参数值order=${order}$`);
        }

        this._order = order;

        return this;
    }

    setFromQuaternion(q, order) {
        _m.setRotationFromQauternion(q);
        return this.setFromRotationMatrix(_m, order);
    }

    reorder(newOrder) {
        _q.setFromEuler(this);
        return this.setFromQuaternion(_q, newOrder);
    }

    setFromVector3(v, order) {
        return this.set(v.x, v.y, v.z, order || this.order);
    }

}
