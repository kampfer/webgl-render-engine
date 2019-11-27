import Geometry from './Geometry';

export default class PlaneGeometry extends Geometry {

    constructor(width, height, widthSegments, heightSegments) {
        super(); 

        let halfWidth = width / 2,
            halfHeight = height / 2;

        this.vertices = [
            -halfWidth, -halfHeight, 0,
            -halfWidth, halfHeight, 0,
            halfWidth, -halfHeight, 0,
            halfWidth, halfHeight, 0,
        ];
    }

}