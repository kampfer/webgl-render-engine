import WebGLUniform from './WebGLUniform';

export default class DiffuseUniform extends WebGLUniform {

    calculateValue(object) {
        let material = object.material,
            color = material.color;
        if (material.wireframe === true) {
            return [0, 0, 0];
        } else if (color){
            return [color.r, color.g, color.b];
        } else {
            return [1, 1, 1];
        }
    }

}