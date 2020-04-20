import { SingleUniform } from './WebGLUniform';

export default class ModelMatrixUniform extends SingleUniform {

    calculateValue(object) {
        return object.worldMatrix.elements;
    }

}