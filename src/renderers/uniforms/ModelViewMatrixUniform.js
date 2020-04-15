import WebGLUniform from './WebGLUniform';

export default class ModelViewMatrixUniform extends WebGLUniform {

    calculateValue(object) {
        return object.modelViewMatrix.elements;
    }

}