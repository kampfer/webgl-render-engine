import Geometry from './Geometry';
import Vec3 from '../math/Vec3';
import BufferAttribute from '../renderers/WebGLAttribute';

let _v3 = new Vec3();

export default class WireframeGeometry extends Geometry {

    constructor(geometry) {

        super(geometry);

        let indices = geometry.getAttribute('index'),
            poistion = geometry.getAttribute('position');

        // if (indices) {
        //     for(let i = 0, l = indices.count; i < l; i += 3) {
        //         for(let j = 0; j < 3; j++) {    // 三角形的三条边的端点组合：0-1, 1-2, 2-0
        //             let p1 = indices.getX(i + j),
        //                 p2 = indices.getX(i + ((j + 1) % 3));
        //             _v3.setFromBufferAttribute(poistion, p1);
        //             this.vertices.push(_v3.x, _v3.y, _v3.z);
        //             _v3.setFromBufferAttribute(poistion, p2);
        //             this.vertices.push(_v3.x, _v3.y, _v3.z);
        //         }
        //     }
        // } else {
        //     for(let i = 0, l = poistion.count; i < l; i += 3) {
        //         for(let j = 0; j < 3; j++) {    // 三角形的三条边的端点组合：0-1, 1-2, 2-0
        //             let p1 = i + j,
        //                 p2 = i + ((j + 1) % 3);
        //             _v3.setFromBufferAttribute(poistion, p1);
        //             this.vertices.push(_v3.x, _v3.y, _v3.z);
        //             _v3.setFromBufferAttribute(poistion, p2);
        //             this.vertices.push(_v3.x, _v3.y, _v3.z);
        //         }
        //     }
        // }

        for(let i = 0, l = (indices ? indices.count : poistion.count); i < l; i += 3) {
            for(let j = 0; j < 3; j++) {    // 三角形的三条边的端点组合：0-1, 1-2, 2-0
                let p1, p2;
                if (indices) {
                    p1 = indices.getX(i + j);
                    p2 = indices.getX(i + ((j + 1) % 3));
                } else {
                    p1 = i + j;
                    p2 = i + ((j + 1) % 3);
                }
                _v3.setFromBufferAttribute(poistion, p1);
                this.vertices.push(_v3.x, _v3.y, _v3.z);
                _v3.setFromBufferAttribute(poistion, p2);
                this.vertices.push(_v3.x, _v3.y, _v3.z);
            }
        }

        this.setAttribute('position', new BufferAttribute(new Float32Array(this.vertices), undefined, 3));

    }

}