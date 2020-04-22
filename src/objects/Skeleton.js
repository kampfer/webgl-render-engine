import GraphObject from './GraphObject';
import { OBJECT_TYPE_SKELETON } from '../constants';
import Mat4 from '../math/Mat4';

const _mat4 = new Mat4();

export default class Skeleton extends GraphObject {

    constructor(bones = [], inverseBones) {

        super();

        this.type = OBJECT_TYPE_SKELETON;

        this.bones = [...bones];

        this.boneMatrices = new Float32Array(bones.length * 16);

        if (inverseBones === undefined) {

            this.calculateInverseBones();

        } else {

            this.inverseBones = [...inverseBones];

        }

        this.boneTexture = null;

    }

    // 记录关节的初始姿势（逆矩阵），初始化之后不再改变
    calculateInverseBones() {

        this.inverseBones = [];

        for(let i = 0, l = this.bones.length; i < l; i++) {

            let bone = this.bones[i],
                inverseMatrix = new Mat4();

            inverseMatrix.setInverseOf(bone.worldMatrix);

            this.inverseBones.push(inverseMatrix);

        }

    }

    update() {

        let bones = this.bones,
            inverseBones = this.inverseBones,
            boneMatrices = this.boneMatrices,
            boneTexture = this.boneTexture;

        for(let i = 0, l = bones.length; i < l; i++) {

            let matrix = bones[i].worldMatrix;

            _mat4.multiplyMatrices(matrix, inverseBones[i]);
            _mat4.toArray(boneMatrices, i * 16);

        }

        if (boneTexture) console.log('boneTexture');

    }

}