import WebGLUniform from './WebGLUniform';

export default class ModelMatrixUniform extends WebGLUniform {

    calculateValue(object) {
        return object.worldMatrix.elements;
    }

}