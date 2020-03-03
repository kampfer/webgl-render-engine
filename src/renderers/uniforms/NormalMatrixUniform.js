import WebGLUniform from './WebGLUniform';

export default class NormalMatrixUniform extends WebGLUniform {

    calculateValue(object) {
        return object.normalMatrix.elements;
    }

}