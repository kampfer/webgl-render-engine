import Camera from './Camera';
import { OBJECT_TYPE_ORTHOGRAPHIC_CAMERA } from '../constants';

export default class OrthographicCamera extends Camera {

    constructor(left = -1, right = 1, top = 1, bottom = -1, near = 0.1, far = 2000) {
        super();

        this.type = OBJECT_TYPE_ORTHOGRAPHIC_CAMERA;

        this._left = left;
        this._right = right;
        this._top = top;
        this._bottom = bottom;
        this._near = near;
        this._far = far;

        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        this.projectionMatrix.setOrthographic(this._left, this._right, this._top, this._bottom, this._far, this._near);
        this.projectionMatrixInverse.setInverseOf(this.projectionMatrix);
    }

}