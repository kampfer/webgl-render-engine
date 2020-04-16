import { PureArrayUniform } from './WebGLUniform';

export default class ViewMatrixUniform extends PureArrayUniform {

    calculateValue(object, camera) {
        return camera.inverseWorldMatrix.elements;
    }

}