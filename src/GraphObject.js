// import EventEmitter from 'events';
import Mat4 from './math/Mat4';
import Vec3 from './math/Vec3';
import Quaternion from './math/Quaternion';

let _target = new Vec3(),
    _position = new Vec3(),
    _q1 = new Quaternion(),
    _m1 = new Mat4();

export default class GraphObject {

    constructor() {
        this.children = [];
        this.parent = null;

        this.matrix = new Mat4();   // local
        this.worldMatrix = new Mat4();  // global

        this.position = new Vec3();
        this.scale = new Vec3(1, 1, 1);
        this.rotation = null;
        this.quaternion = new Quaternion();

        this.up = new Vec3(0, 1, 0);

        this._worldMatrixNeedsUpdate = false;
    }

    add(object) {
        if (object.parent != null) {
            object.parent.remove(object);
        }

        object.parent = this;
        this.children.push(object);
    }

    remove(object) {
        let index = this.children.indexOf(object);
        if (index >= 0) {
            object.parent = null;
            this.children.splice(index, 1);
        }
    }

    update() {}

    updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale);
        this._worldMatrixNeedsUpdate = true;
    }

    updateWorldMatrix(force) {
        this.updateMatrix();

        if (this._worldMatrixNeedsUpdate || force) {

            if (this.parent === null) {
                this.worldMatrix.copy(this.matrix);
            } else {
                this.worldMatrix.multiplyMatrices(this.parent.worldMatrix, this.matrix);
            }

            this._worldMatrixNeedsUpdate = false;

            force = true;

        }

        let children = this.children;
        for(let i = 0, l = children.length; i < l; i++) {
            children[i].updateWorldMatrix(force);
        }
    }

    updateRelativeWorldMatrix(updateAncestor, updateDescendant) {
        if (updateAncestor === true && this.parent !== null) {
            this.parent.updateRelativeWorldMatrix(true, false);
        }

        this.updateMatrix();

        if (this.parent === null) {
            this.worldMatrix.copy(this.matrix);
        } else {
            this.worldMatrix.multiplyMatrices(this.parent.worldMatrix, this.matrix);
        }

        if (updateDescendant === true) {
            let children = this.children;
            for(let i = 0, l = children.length; i < l; i++) {
                children[i].updateRelativeWorldMatrix(false, true);
            }
        }
    }

    lookAt(x, y, z) {
        if (arguments.length === 1) {
            _target.copy(x);
        } else {
            _target.set(x, y, z);
        }

        this.updateRelativeWorldMatrix(true, false);
        _position.setFromMatrixPosition(this.worldMatrix);

        // threejs对除camera和light之外的对象做了相反得到操作，为什么？
        // https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L286
        if (this.isCamera || this.isLight) {
            _m1.lookAt(_position, _target, this.up);
        } else {
            _m1.lookAt(_target, _position, this.up);
        }
        this.quaternion.setFromRotationMatrix(_m1);

        let parent = this.parent;
        if (parent) {
            _m1.extractRotation(parent.matrixWorld);
            _q1.setFromRotationMatrix(_m1);
            this.quaternion.premultiply(_q1.inverse());
        }
    }

    applyMatrix(m) {
        this.updateMatrix();
        this.matrix.premultiply(m);
        this.matrix.decompose(this.position, this.quaternion, this.scale);
    }

}