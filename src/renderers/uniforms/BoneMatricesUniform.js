import { SingleUniform } from './WebGLUniform';

export default class BoneMatricesUniform extends SingleUniform {

    calculateValue(object) {

        let skeleton = object.skeleton;

        skeleton.update();

        return skeleton.boneMatrices;

    }

}