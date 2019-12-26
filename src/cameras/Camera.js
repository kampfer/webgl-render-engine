import GraphObject from '../GraphObject';
import Mat4 from "../math/Mat4";

export default class Camera extends GraphObject {

    constructor() {
        super();

        this.isCamera = true;

        this.projectionMatrix = new Mat4();
        this.projectionMatrixInverse = new Mat4();

        this.matrixWorldInverse = new Mat4();
    }

    updateWorldMatrix() {
        super.updateWorldMatrix();
        this.matrixWorldInverse.setInverseOf(this.worldMatrix);
    }

}