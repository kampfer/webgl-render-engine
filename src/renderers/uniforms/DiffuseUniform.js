import { SingleUniform } from './WebGLUniform';

export default class DiffuseUniform extends SingleUniform {

    calculateValue(object) {
        let material = object.material,
            color = material.color;
        if (material.wireframe === true) {
            return [0, 0, 0];
        } else if (color) {
            return color;
        } else {
            return [1, 1, 1];
        }
    }

}