import { SingleUniform } from './WebGLUniform';

export default class ProjectionMatrixUniform extends SingleUniform {

    calculateValue(object, camera) {
        return camera.projectionMatrix.elements;
    }

}