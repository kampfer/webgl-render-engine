import Mesh from './Mesh';
import { OBJECT_TYPE_SKINNED_MESH } from '../constants';
import Mat4 from '../math/Mat4';
import Vec4 from '../math/Vec4';

const _vec4 = new Vec4();

export default class SkinnedMesh extends Mesh {

    constructor(geometry, material) {

        super(geometry, material);

        this.type = OBJECT_TYPE_SKINNED_MESH;

        // this.bindMatrix = new Mat4();
        // this.inverseBindMatrix = new Mat4();

    }

    updateWorldMatrix(force) {

        super.updateWorldMatrix(force);

        // this.inverseBindMatrix.setInverseOf(this.worldMatrix);

    }

    bind(skeleton, bindMatrix) {

        this.skeleton = skeleton;

        // if (bindMatrix === undefined) {

        //     this.updateWorldMatrix(true);

        //     this.bindMatrix = this.worldMatrix;

        // } else {

        //     this.bindMatrix.copy(bindMatrix);
        //     this.inverseBindMatrix.setInverseOf(bindMatrix);

        // }

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