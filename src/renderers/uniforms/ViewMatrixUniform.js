import { SingleUniform } from './WebGLUniform';

export default class ViewMatrixUniform extends SingleUniform {

    calculateValue(object, camera) {
        return camera.inverseWorldMatrix.elements;
    }

}