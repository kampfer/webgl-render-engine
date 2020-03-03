import WebGLUniform from './WebGLUniform';

export default class ViewMatrixUniform extends WebGLUniform {

    calculateValue(object, camera) {
        return camera.inverseWorldMatrix.elements;
    }

}