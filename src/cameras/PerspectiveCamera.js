import Mat4 from "../math/Mat4";

export default class PerspectiveCamera {

    constructor(fovy, aspect, near, far) {
        this.fovy = fovy === undefined ? 45 : fovy;
        this.aspect = aspect === undefined ? 1 : aspect;
        this.near = near === undefined ? 0.1 : near;
        this.far = far === undefined ? 1000 : far;

        this.projectionMatrix = new Mat4();

        this.viewMatrix = new Mat4();

        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        let near = this.near,
            top = near * Math.tan(0.5 * this.fovy * (Math.PI / 180)),
            height = 2 * top,
            width = this.aspect * height,
            left = -0.5 * width;

        this.projectionMatrix.setPerspective(left, left + width, top, top - height, near, this.far);
    }

    setPosition(x, y, z) {
        if (arguments.length === 1) {
            this.position = x;
        } else {
            this.position = [x, y, z];
        }
    }

    lookAt(targetX, targetY, targetZ) {
        this.viewMatrix.setLookAt(this.position[0], this.position[1], this.position[2], targetX, targetY, targetZ, 0, 1, 0);
    }

}
