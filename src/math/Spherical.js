/*
 * 球坐标系
 * 定义：https://en.wikipedia.org/wiki/Spherical_coordinate_system
 * The polar angle (theta) is measured from the positive y-axis.
 * The azimuthal angle (phi) is measured from the positive z-axis.
 * theta >= 0 && theta <= Math.PI
 * phi >= - Math.PI && phi <= Math.PI
 */

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

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
        if (v < 0) {
            v = 0;
        } else if (v > Math.PI) {
            v = Math.PI;
        }
        this._theta = v;
    }

    get phi() {
        return this._phi;
    }

    set phi(v) {
        if (v < - Math.PI) {
            v = - Math.PI;
        } else if (v > Math.PI) {
            v = Math.PI;
        }
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