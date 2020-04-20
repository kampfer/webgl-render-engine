import { SingleUniform } from './WebGLUniform';

export default class ModelViewMatrixUniform extends SingleUniform {

    calculateValue(object) {
        return object.modelViewMatrix.elements;
    }

}