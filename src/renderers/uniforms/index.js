import ModelMatrixUniform from './ModelMatrixUniform';
import ViewMatrixUniform from './ViewMatrixUniform';
import ProjectionMatrixUniform from './ProjectionMatrixUniform';
import DiffuseUniform from './DiffuseUniform';
import NormalMatrixUniform from './NormalMatrixUniform';
import ModelViewMatrixUniform from './ModelViewMatrixUniform';
import MorphTargetBaseInfluenceUniform from './MorphTargetBaseInfluenceUniform';
import MorphTargetInfluencesUniform from './MorphTargetInfluencesUniform';
import BoneMatricesUniform from './BoneMatricesUniform';
import InverseBindMatrixUniform from './InverseBindMatrixUniform';
import BindMatrixUniform from './BindMatrixUniform';
import BoneTextureUniform from './BoneTextureUniform';
import BoneNumUniform from './BoneNumUniform';
import MapUniform from './MapUniform';

export default {
    modelMatrix: ModelMatrixUniform,
    viewMatrix: ViewMatrixUniform,
    projectionMatrix: ProjectionMatrixUniform,
    diffuse: DiffuseUniform,
    normalMatrix: NormalMatrixUniform,
    modelViewMatrix: ModelViewMatrixUniform,
    morphTargetInfluences: MorphTargetInfluencesUniform,
    morphTargetBaseInfluence: MorphTargetBaseInfluenceUniform,
    boneMatrices: BoneMatricesUniform,
    inverseBindMatrix: InverseBindMatrixUniform,
    bindMatrix: BindMatrixUniform,
    boneTexture: BoneTextureUniform,
    boneNum: BoneNumUniform,
    map: MapUniform,
};
