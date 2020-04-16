import WebGLUniform from './WebGLUniform';

export default class MorphTargetBaseInfluenceUniform extends WebGLUniform {

    calculateValue(object) {

        object.updateMorphTargets();

        return object.morphTargetBaseInfluence;
        
    }

}