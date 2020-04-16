import { PureArrayUniform } from './WebGLUniform';

export default class ModelViewMatrixUniform extends PureArrayUniform {

    calculateValue(object) {
        return object.modelViewMatrix.elements;
    }

}