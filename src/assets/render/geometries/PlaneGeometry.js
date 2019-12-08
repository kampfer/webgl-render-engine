import Geometry from './Geometry';

export default class PlaneGeometry extends Geometry {

    constructor(width, height, widthSegments, heightSegments) {
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
            halfWidth, -halfHeight, 0,
        );

        this.indices.push(0, 1, 3, 1, 2, 3);
    }

}