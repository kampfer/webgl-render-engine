import Camera from './Camera';
import { OBJECT_TYPE_ORTHOGRAPHIC_CAMERA } from '../constants';

export default class OrthographicCamera extends Camera {

    constructor(left = -1, right = 1, top = 1, bottom = -1, near = 0.1, far = 2000) {
        super();

        this.type = OBJECT_TYPE_ORTHOGRAPHIC_CAMERA;

        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;

        this.zoom = 1;

        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        let dx = ( this.right - this.left ) / ( 2 * this.zoom ),
            dy = ( this.top - this.bottom ) / ( 2 * this.zoom ),
            cx = ( this.right + this.left ) / 2,
            cy = ( this.top + this.bottom ) / 2,
            left = cx - dx,
            right = cx + dx,
            top = cy + dy,
            bottom = cy - dy;

        // 经过上面的变换之后，left、top、right、bottom转入setOrthographic后计算的结果正好相当于变换矩阵乘以缩放矩阵的结果
        // left = [right(zoom - 1) + left(zoom + 1)] / (2 * zoom)
        // right = (right(zoom + 1) + left(zoom - 1)) / (2 * zoom);
        // right - left = right - left / zoom
        // right + left = right + left

        this.projectionMatrix.setOrthographic(left, right, top, bottom, this.near, this.far);
        this.projectionMatrixInverse.setInverseOf(this.projectionMatrix);
    }

}