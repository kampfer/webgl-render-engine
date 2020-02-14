import Geometry from './Geometry';
import BufferAttribute from '../renderers/BufferAttribute';

export default class PlaneGeometry extends Geometry {

    constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
        super(); 

        let halfWidth = width / 2,
            halfHeight = height / 2;

        // v1 - v0
        // |    |
        // v2 - v3
        this.vertices.push(
            halfWidth, halfHeight, 0,
            -halfWidth, halfHeight, 0,
            -halfWidth, -halfHeight, 0,
            halfWidth, -halfHeight, 0
        );

        this.indices.push(0, 1, 3, 1, 2, 3);

        this.setIndex(new BufferAttribute(new Uint8Array(this.indices), 1));
        this.setAttribute('position', new BufferAttribute(new Float32Array(this.vertices), 3));
    }

}