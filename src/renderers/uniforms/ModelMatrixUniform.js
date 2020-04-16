import { PureArrayUniform } from './WebGLUniform';

export default class ModelMatrixUniform extends PureArrayUniform {

    calculateValue(object) {
        return object.worldMatrix.elements;
    }

}