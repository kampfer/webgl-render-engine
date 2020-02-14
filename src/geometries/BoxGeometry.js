//    v6----- v5
//   /|      /|
//  v2------v3|
//  | |     | |
//  | v7----|-v4
//  |/      |/
//  v0------v1

import Geometry from './Geometry';
import Vec3 from '../math/Vec3';
import BufferAttribute from '../render/BufferAttribute';

export default class BoxGeometry extends Geometry {

    constructor(width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
        super(width, height, depth, widthSegments, heightSegments, depthSegments);

        this.numberOfVertices = 0;

        this._buildPlane('x', 'y', 'z', 1, 1, width, height, depth, widthSegments, heightSegments);     // front
        this._buildPlane('x', 'y', 'z', 1, 1, width, height, -depth, widthSegments, heightSegments);    // back
        this._buildPlane('x', 'z', 'y', 1, -1, width, depth, height, widthSegments, heightSegments);    // up
        this._buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, heightSegments);   // down
        this._buildPlane('z', 'y', 'x', 1, 1, depth, height, width, widthSegments, heightSegments);     // left
        this._buildPlane('z', 'y', 'x', 1, 1, depth, height, -width, widthSegments, heightSegments);    // right

        this.setIndex(new BufferAttribute(new Uint8Array(this.indices), 1));
        this.setAttribute('position', new BufferAttribute(new Float32Array(this.vertices), 3));
        this.setAttribute('normal', new BufferAttribute(new Float32Array(this.normals), 3));
    }

    // TODO: 还需要纹理坐标
    _buildPlane(xLabel, yLabel, zLabel, xDir, yDir, width, height, depth, horizontalSegments, verticalSegments) {
        let halfWidth = width / 2,
            halfHeight = height / 2,
            halfDepth = depth / 2,
            segmentWidth = width / horizontalSegments,
            segmentHeight = height / verticalSegments,
            hSegments1 = horizontalSegments + 1,
            vSegments1 = verticalSegments + 1,
            vertexCounter = 0,
            v3 = new Vec3();

        for(let iy = 0; iy < vSegments1; iy++) {

            let y = iy * segmentHeight - halfHeight;    // bottom -> top

            for(let ix = 0; ix < hSegments1; ix++) {

                let x = ix * segmentWidth - halfWidth;  // left - right

                v3[xLabel] = x * xDir;
                v3[yLabel] = y * yDir;
                v3[zLabel] = halfDepth;

                this.vertices.push(v3.x, v3.y, v3.z);

                v3[xLabel] = 0;
                v3[yLabel] = 0;
                v3[zLabel] = depth > 0 ? 1 : -1;

                this.normals.push(v3.x, v3.y, v3.z);

                vertexCounter++;

            }
        }

        // b -- c
        // |    |
        // a -- d
        for(let iy = 0; iy < verticalSegments; iy++) {

            for(let ix = 0; ix < horizontalSegments; ix++) {

                let numberOfVertices = this.numberOfVertices,
                    a = numberOfVertices + ix + hSegments1 * iy,
                    b = numberOfVertices + ix + hSegments1 * (iy + 1),
                    c = numberOfVertices + (ix + 1) + hSegments1 * (iy + 1),
                    d = numberOfVertices + (ix + 1) + hSegments1 * iy;

                this.indices.push(a, d, c);
                this.indices.push(a, c, b);

            }

        }

        this.numberOfVertices += vertexCounter;
    }

}