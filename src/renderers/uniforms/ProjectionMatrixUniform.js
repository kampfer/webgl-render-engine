import { PureArrayUniform } from './WebGLUniform';

export default class ProjectionMatrixUniform extends PureArrayUniform {

    calculateValue(object, camera) {
        return camera.projectionMatrix.elements;
    }

}