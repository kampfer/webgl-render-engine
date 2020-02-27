import WebGLUniform from './WebGLUniform';

export default class ProjectionMatrixUniform extends WebGLUniform {

    calculateValue(object, camera) {
        return camera.projectionMatrix.elements;
    }

}