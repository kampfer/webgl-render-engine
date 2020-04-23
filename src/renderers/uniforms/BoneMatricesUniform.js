import { SingleUniform } from './WebGLUniform';

export default class BoneMatricesUniform extends SingleUniform {

    calculateValue(object) {

        let skeleton = object.skeleton;

        return skeleton.boneMatrices;

    }

}