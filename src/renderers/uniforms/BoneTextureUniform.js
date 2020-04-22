import { SingleUniform } from './WebGLUniform';
import DataTexture from '../../textures/DataTexture';

export default class BoneTextureUniform extends SingleUniform {

    calculateValue(object) {

        let skeleton = object.skeleton;

        if (skeleton.boneTexture === undefined) {

            skeleton.boneTexture = new DataTexture({
                data: skeleton.boneMatrices,
                width: 4,
                height: skeleton.bones.length
            });

        }

        return skeleton.boneTexture;

    }

}