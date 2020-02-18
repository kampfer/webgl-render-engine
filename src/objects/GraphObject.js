// import EventEmitter from 'events';
import Mat4 from '../math/Mat4';
import Mat3 from '../math/Mat3';
import Vec3 from '../math/Vec3';
import Quaternion from '../math/Quaternion';
import Euler from '../math/Euler';

let _target = new Vec3(),
    _position = new Vec3(),
    _q1 = new Quaternion(),
    _m1 = new Mat4(),
    uid = 0;

export default class GraphObject {

    constructor() {
        this.uid = ++uid;

        this.children = [];
        this.parent = null;

        this.matrix = new Mat4();   // local
        this.worldMatrix = new Mat4();  // global

        this.modelViewMatrix = new Mat4();
        this.normalMatrix = new Mat3();

        this.position = new Vec3();
        this.scale = new Vec3(1, 1, 1);
        // this.rotation = new Euler();
        // this.quaternion = new Quaternion();

        let rotation = new Euler(),
            proxyForRotation = new Proxy(rotation, {
                set: function(target, key, value) {
                    target[key] = value;
                    quaternion.setFromEuler(target);
                    return true;
                }
            }),
            quaternion = new Quaternion(),
            proxyForQuaternion = new Proxy(quaternion, {
                set: function(target, key, value) {
                    target[key] = value;
                    rotation.setFromQuaternion(target);
                    return true;
                }
            });
        this.rotation = proxyForRotation;
        this.quaternion = proxyForQuaternion;

        this.up = new Vec3(0, 1, 0);

        // true: 每次render都重新compose matrix
        this.matrixAutoUpdate = true;

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

    traverse(callback) {
        let children = this.children;

        for(let i = 0, l = children.length; i < l; i++) {
            let child = children[i],
                result = callback(child);

            if (result === false) {
                return result;
            }

            result = child.traverse(callback);

            if (result === false) {
                return result;
            }
        }
    }

    getChildByUid(uid) {
        let node = null;
        this.traverse(function (child) {
            if (child.uid === uid) {
                node = child;
                return false;
            }
        });
        return node;
    }

    getChildByName(name) {
        let node = null;
        this.traverse(function (child) {
            if (child.name === name) {
                node = child;
                return false;
            }
        });
        return node;
    }

    update() {}

    updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale);
        this._worldMatrixNeedsUpdate = true;
    }

    updateWorldMatrix(force) {
        if (this.matrixAutoUpdate) this.updateMatrix();

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

        if (this.matrixAutoUpdate) this.updateMatrix();

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
            _m1.extractRotation(parent.worldMatrix);
            _q1.setFromRotationMatrix(_m1);
            this.quaternion.premultiply(_q1.inverse());
        }
    }

    applyMatrix(m) {
        this.updateMatrix();
        this.matrix.premultiply(m);
        this.matrix.decompose(this.position, this.quaternion, this.scale);
    }

    // 在local space旋转
    // axis必须已经归一化
    rotateOnAxis(axis, angle) {
        _q1.setFromAxisAngle(axis, angle);
        this.quaternion.multiply(_q1);
        return this;
    }

    // 在world space旋转
    // axis必须归一化
    rotateOnWorldAxis(axis, angle) {
        _q1.setFromAxisAngle(axis, angle);
        this.quaternion.premultiply(_q1);
        return this;
    }

    copy(src, recursive = true) {
        this.up.copy(src.up);

        this.position.copy(src.position);
        this.quaternion.copy(src.quaternion);
        this.scale.copy(src.scale);

        this.matrix.copy(src.matrix);
        this.worldMatrix.copy(src.worldMatrix);

        this._worldMatrixNeedsUpdate = src._worldMatrixNeedsUpdate;

        if (recursive === true) {
            for(let i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];
                this.add(child.clone(recursive));
            }
        }

        return this;
    }

    clone(recursive) {
        return new this.constructor().copy(this, recursive);
    }

}