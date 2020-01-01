/*
 * 球坐标系
 * 定义：https://en.wikipedia.org/wiki/Spherical_coordinate_system
 * The polar angle (theta) is measured from the positive y-axis.
 * The azimuthal angle (phi) is measured from the positive z-axis.
 *
 * wiki中约定了theta和phi的取值范围，如下：
 * theta >= 0 && theta <= Math.PI
 * phi >= - Math.PI && phi <= Math.PI
 *
 * 但是在开发OrbitCameraController时发现phi取任意值都可行，而theta不能等于0或者Math.PI。
 * threejs中也只对The azimuthal angle做了限制，本实现参考threejs。
 * https://github.com/mrdoob/three.js/blob/45418089bd5633e856384a8c0beefced87143334/src/math/Spherical.js#L52
 */

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

const EPS = 0.000001;

export default class Spherical {

    constructor(radius = 1, theta = 0, phi = 0) {
        this.radius = radius;
        this._theta = theta;
        this._phi = phi;
    }

    get theta() {
        return this._theta;
    }

    set theta(v) {
        this._theta = Math.max(EPS, Math.min(v, Math.PI - EPS));
    }

    get phi() {
        return this._phi;
    }

    set phi(v) {
        this._phi = v;
    }

    set(radius, theta, phi) {
        this.radius = radius;
        this.theta = theta;
        this.phi = phi;
        return this;
    }

    setFromVector3(v) {
        return this.setFromCartesianCoords(v.x, v.y, v.z);
    }

    setFromCartesianCoords(x, y, z) {
        this.radius = Math.sqrt(x * x + y * y + z * z);
        if (this.radius === 0) {
            this.theta = 0;
            this.phi = 0;
        } else {
            this.theta = Math.acos(clamp(y / this.radius, -1, 1));
            this.phi = Math.atan2(x, z);
        }
        return this;
    }

}