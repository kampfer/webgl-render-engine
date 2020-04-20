import ModelMatrixUniform from './ModelMatrixUniform';
import ViewMatrixUniform from './ViewMatrixUniform';
import ProjectionMatrixUniform from './ProjectionMatrixUniform';
import DiffuseUniform from './DiffuseUniform';
import NormalMatrixUniform from './NormalMatrixUniform';
import ModelViewMatrixUniform from './ModelViewMatrixUniform';
import MorphTargetBaseInfluenceUniform from './MorphTargetBaseInfluenceUniform';
import MorphTargetInfluencesUniform from './MorphTargetInfluencesUniform';

export default {
    modelMatrix: ModelMatrixUniform,
    viewMatrix: ViewMatrixUniform,
    projectionMatrix: ProjectionMatrixUniform,
    diffuse: DiffuseUniform,
    normalMatrix: NormalMatrixUniform,
    modelViewMatrix: ModelViewMatrixUniform,
    morphTargetInfluences: MorphTargetInfluencesUniform,
    morphTargetBaseInfluence: MorphTargetBaseInfluenceUniform,
};
