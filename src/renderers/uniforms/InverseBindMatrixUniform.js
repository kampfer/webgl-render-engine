import { SingleUniform } from './WebGLUniform';

export default class InverseBindMatrixUniform extends SingleUniform {

    calculateValue(object) {
        return object.inverseBindMatrix;
    }

}