import LineSegments from '../objects/LineSegments';
import BufferAttribute from '../renderers/BufferAttribute';
import Geometry from '../geometries/Geometry';
import LineBasicMaterial from '../materials/LineBasicMaterial';

export default class GridHelper extends LineSegments {

    constructor(size = 1) {

        let vertices = [
            0, 0, 0,    size, 0, 0,
            0, 0, 0,    0, size, 0,
            0, 0, 0,    0, 0, size
        ];

        let colors = [
            1, 0, 0,    1, 0.6, 0,
            0, 1, 0,    0.6, 1, 0,
            0, 0, 1,    0, 0.6, 1
        ];

        let geometry = new Geometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));

        let material = new LineBasicMaterial({ vertexColors: true });

        super(geometry, material);

    }

}