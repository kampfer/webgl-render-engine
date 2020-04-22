import { SingleUniform } from './WebGLUniform';
import DataTexture from '../../textures/DataTexture';
import { FLOAT_TYPE } from '../../constants';

export default class BoneTextureUniform extends SingleUniform {

    calculateValue(object) {

        let skeleton = object.skeleton;

        if (!skeleton.boneTexture) {

            skeleton.boneTexture = new DataTexture({
                data: skeleton.boneMatrices,
                width: 4,
                height: skeleton.bones.length,
                texelType: FLOAT_TYPE
            });

        }

        return skeleton.boneTexture;

    }

}