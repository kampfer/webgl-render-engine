import Mesh from './Mesh';
import { OBJECT_TYPE_SKINNED_MESH } from '../constants';
import Mat4 from '../math/Mat4';
import Vec4 from '../math/Vec4';

const _vec4 = new Vec4();

export default class SkinnedMesh extends Mesh {

    constructor(geometry, material) {

        super(geometry, material);

        this.type = OBJECT_TYPE_SKINNED_MESH;

        // attached mode: 会忽略skinnedMesh本身的transform属性，实例的位置和朝向完全由骨骼控制
        // detached mode: 实例的位置和朝向受到skinnedMesh本身的transform、骨骼的transform、bindMatrix控制
        this.bindMode = SkinnedMesh.ATTACHED_MODE;

        // projectionMatrix * viewMatrix * modelMatrix * inverseBindMatrix * boneMatrix * bindMatrix * position
        // 从左往右，变换坐标系，从全局坐标变换到local坐标
        // 从右往左，变换坐标变化，结果是全局系中的坐标
        this.bindMatrix = new Mat4();
        this.inverseBindMatrix = new Mat4();

    }

    updateWorldMatrix(force) {

        super.updateWorldMatrix(force);

        if (this.bindMode === SkinnedMesh.ATTACHED_MODE) {
            this.inverseBindMatrix.setInverseOf(this.worldMatrix);
        } else if (this.bindMode === SkinnedMesh.DETACHED_MODE) {
            this.inverseBindMatrix.setInverseOf(this.bindMatrix);
        }

    }

    bind(skeleton, bindMatrix) {

        this.skeleton = skeleton;

        this.material.skinning = true;

        if (bindMatrix === undefined) {

            this.updateWorldMatrix(true);

            bindMatrix = this.worldMatrix;

        }

        this.bindMatrix.copy(bindMatrix);
        this.inverseBindMatrix.setInverseOf(bindMatrix);

    }

    normalizeSkinWeights() {

        let skinWeight = this.geometry.getAttribute('skinWeight');

        for(let i = 0, l = skinWeight.count; i < l; i++) {

            _vec4.setFromBufferAttribute(skinWeight, i);

            // 使用manhattanLength进行normalize，保证所有分量之和等于1
            let scale = 1 / _vec4.manhattanLength();

            if ( scale !== Infinity) {

                _vec4.multiplyScalar(scale);

            } else {

                console.warn('SkinnedMesh.normalizeSkinWeights: scale === Infinity');
                _vec4.set(1, 0, 0, 0);

            }

            skinWeight.setXYZW(i, _vec4.x, _vec4.y, _vec4.z, _vec4.w);

        }

    }

}

SkinnedMesh.ATTACHED_MODE = 0;
SkinnedMesh.DETACHED_MODE = 1;