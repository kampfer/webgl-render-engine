import Camera from './Camera';
import { OBJECT_TYPE_PERSPECTIVE_CAMERA } from '../constants';

export default class PerspectiveCamera extends Camera {

    constructor(fovy, aspect, near, far) {
        super();

        this.type = OBJECT_TYPE_PERSPECTIVE_CAMERA;

        this.fovy = fovy === undefined ? 45 * Math.PI / 180 : fovy;
        this.aspect = aspect === undefined ? 1 : aspect;
        this.near = near === undefined ? 0.1 : near;
        this.far = far === undefined ? 1000 : far;

        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        let near = this.near,
            top = near * Math.tan(0.5 * this.fovy),
            height = 2 * top,
            width = this.aspect * height,
            left = -0.5 * width;

        this.projectionMatrix.setPerspective(left, left + width, top, top - height, near, this.far);
        this.projectionMatrixInverse.setInverseOf(this.projectionMatrix);
    }

}
