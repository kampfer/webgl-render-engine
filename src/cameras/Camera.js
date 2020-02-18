import GraphObject from '../objects/GraphObject';
import Mat4 from "../math/Mat4";

export default class Camera extends GraphObject {

    constructor() {
        super();

        this.isCamera = true;

        this.projectionMatrix = new Mat4();
        this.projectionMatrixInverse = new Mat4();

        this.inverseWorldMatrix = new Mat4();
    }

    updateWorldMatrix() {
        super.updateWorldMatrix();
        this.inverseWorldMatrix.setInverseOf(this.worldMatrix);
    }

}