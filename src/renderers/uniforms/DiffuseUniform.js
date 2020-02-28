import WebGLUniform from './WebGLUniform';

export default class DiffuseUniform extends WebGLUniform {

    calculateValue(object) {
        let material = object.material,
            color = material.color;
        return [color.r, color.g, color.b, 1];
    }

}