// import EventEmitter from 'events';
import composable from './composable';
import Mat4 from './math/Mat4';
import Vec3 from './math/Vec3';
import Quaternion from './math/Quaternion';

export default composable(class GraphObject {

    constructor() {
        this.matrix = new Mat4();   // local
        this.worldMatrix = new Mat4();  // global

        // threejs 将viewMatrix分解到position、quaternion储存
        // 这里我暂时简单处理：lookat方法改变viewMatrix
        this.viewMatrix = new Mat4();

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

    lookAt(x, y, z) {
        this.viewMatrix.setLookAt(this.position.x, this.position.y, this.position.z, x, y, z, 0, 1, 0);
    }

});