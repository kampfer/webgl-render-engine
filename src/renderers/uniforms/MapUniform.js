import { SingleUniform } from './WebGLUniform';

export default class MapUniform extends SingleUniform {

    calculateValue(object) {

        return object.material.map;

    }

}