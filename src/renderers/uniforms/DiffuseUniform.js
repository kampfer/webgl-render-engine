import WebGLUniform from './WebGLUniform';

export default class DiffuseUniform extends WebGLUniform {

    calculateValue(object) {
        let material = object.material;
        return material.color;
    }

}