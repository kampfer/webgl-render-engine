import { SingleUniform } from './WebGLUniform';
import DataTexture from '../../textures/DataTexture';
import { FLOAT_TYPE } from '../../constants';

export default class BoneTextureUniform extends SingleUniform {

    calculateValue(object) {

        let skeleton = object.skeleton;

        if (!skeleton.boneTexture) {

            // TODO：像threejs一样使用宽高相同并且等于2的幂的纹理，这样可以支持mipmap。
            // 我先在这里采用[https://webglfundamentals.org/webgl/lessons/webgl-skinning.html]提供的方法
            // 采用尺寸为4 x boneNum的纹理，因为实现更简单。
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