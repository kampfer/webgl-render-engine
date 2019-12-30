/*
 * 球坐标系
 * 定义：https://en.wikipedia.org/wiki/Spherical_coordinate_system
 * The polar angle (theta) is measured from the positive y-axis.
 * The azimuthal angle (phi) is measured from the positive z-axis.
 */

export default class Spherical {

    constructor(radius = 1, theta = 0, phi = 0) {
        this.radius = radius;
        this.theta = theta;
        this.phi = phi;
    }

    set(radius, theta, phi) {
        this.radius = radius;
        this.theta = theta;
        this.phi = phi;
        return this;
    }

}