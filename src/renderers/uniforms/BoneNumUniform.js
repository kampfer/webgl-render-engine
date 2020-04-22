import { SingleUniform } from './WebGLUniform';

export default class BoneNumUniform extends SingleUniform {

    calculateValue(object) {

        return object.skeleton.bones.length;

    }

}