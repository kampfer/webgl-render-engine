import { SingleUniform } from './WebGLUniform';

export default class BindMatrixUniform extends SingleUniform {

    calculateValue(object) {
        return object.bindMatrix;
    }

}