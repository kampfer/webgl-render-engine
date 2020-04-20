import { SingleUniform } from './WebGLUniform';

export default class NormalMatrixUniform extends SingleUniform {

    calculateValue(object) {
        return object.normalMatrix.elements;
    }

}