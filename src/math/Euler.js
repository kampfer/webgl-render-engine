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
            m21 = me[1], m22 = me[5], m23 = me[9]
            m31 = me[2], m32 = me[6], m33 = me[10];

        order = order || this._order;

        if (order === 'XYZ') {
            this._y = Math.asin(clamp(m13, -1, 1));
        } else {
            console.warn(`Euler.setFromRotationMatrix：不支持的参数值order=${order}$`);
        }

        this._order = order;

        return this;
    }

    setFromQuaternion(q, order) {
        _m.setRotationFromQauternion(q);
        return this.setFromRotationMatrix(q, order);
    }

    reorder(newOrder) {
        _q.setFromEuler(this);
        return this.setFromQuaternion(_q, newOrder);
    }

    setFromVector3(v, order) {
        return this.set(v.x, v.y, v.z, order || this.order);
    }

}
