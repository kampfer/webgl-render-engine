// import GraphObject from '../objects/GraphObject';
import LineSegments from '../objects/LineSegments';
import BufferAttribute from '../renderers/BufferAttribute';
import Geometry from '../geometries/Geometry';
import LineBasicMaterial from '../materials/LineBasicMaterial';

export default class GridHelper extends LineSegments {

    constructor(size, divisions, color) {

        let halfSize = size / 2,
            step = size / divisions,
            vertices = [];

        for(let i = 0, k = -halfSize; i <= divisions; i++, k += step) {
            vertices.push(-halfSize, 0, k, halfSize, 0, k);
            vertices.push(k, 0, -halfSize, k, 0, halfSize);
        }

        let geometry = new Geometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));

        let material = new LineBasicMaterial({ color });

        super(geometry, material);

    }

}