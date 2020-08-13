import Example from './example';
import Mat4 from '../src/math/Mat4';
import Quaternion from '../src/math/Quaternion';
import Euler from '../src/math/Euler';
import Vec3 from '../src/math/Vec3';
import { radToDeg } from '../src/math/utils';

export default class AxesHelperExample extends Example {

    constructor() {

        super();

        function decompose(mat4) {

            let quaternion = new Quaternion(),
                rotation = new Euler(),
                position = new Vec3(),
                scale = new Vec3();

            mat4.decompose(position, quaternion, scale);

            rotation.setFromQuaternion(quaternion);

            console.log(`position: ${position}`);
            console.log(`rotation: ${radToDeg(rotation.x)} ${radToDeg(rotation.y)} ${radToDeg(rotation.z)}`);
            console.log(`scale: ${scale}`);

        }

        let m1 = new Mat4([1, 0, 0, 0, 0, 2.220446049250313e-16, 1, 0, 0, -1, 2.220446049250313e-16, 0, 1.8718650937080383, 0.19165000319480893, -2.7919649779796596, 1]);

        decompose(m1);

    }

}
