// import EventEmitter from 'events';
import composable from './composable';
import Mat4 from './math/Mat4';
import Vec3 from './math/Vec3';
import Quaternion from './math/Quaternion';

export default composable(class GraphObject {

    constructor() {
        this.matrix = new Mat4();   // local
        this.worldMatrix = new Mat4();  // global

        this.position = new Vec3();
        this.scale = new Vec3(1, 1, 1);
        this.rotation = null;
        this.quaternion = new Quaternion();

        this._worldMatrixNeedsUpdate = false;
    }

    update() {}

    updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale);
        this._worldMatrixNeedsUpdate = true;
    }

    updateWorldMatrix() {
        this._worldMatrixNeedsUpdate = false;
    }

});