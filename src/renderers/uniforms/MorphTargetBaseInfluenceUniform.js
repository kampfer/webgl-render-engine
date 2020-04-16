import { SingleUniform } from './WebGLUniform';

export default class MorphTargetBaseInfluenceUniform extends SingleUniform {

    calculateValue(object) {

        object.updateMorphTargets();

        return object.morphTargetBaseInfluence;
        
    }

}