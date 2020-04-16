import { PureArrayUniform } from './WebGLUniform';

export default class MorphTargetInfluencesUniform extends PureArrayUniform {

    calculateValue(object) {

        let influencesInObject = object.morphTargetInfluences,
            length = influencesInObject === undefined ? 0 : influencesInObject.length,
            morphTargetInfluences = new Float32Array(8);

        for(let i = 0; i < length; i++) {

            let value = influencesInObject[i];

            if (value) {
                morphTargetInfluences[i] = value;
            } else {
                morphTargetInfluences[i] = 0;
            }

        }

        return morphTargetInfluences;

    }

}