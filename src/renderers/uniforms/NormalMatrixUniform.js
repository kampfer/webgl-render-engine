import { PureArrayUniform } from './WebGLUniform';

export default class NormalMatrixUniform extends PureArrayUniform {

    calculateValue(object) {
        return object.normalMatrix.elements;
    }

}