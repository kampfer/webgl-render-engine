import Example from './Example';
import BoxGeometry from '../src/geometries/BoxGeometry';
import Material from '../src/materials/Material';
import Mesh from '../src/objects/Mesh';
import Clock from '../src/Clock';
import QuaternionKeyFrameTrack from '../src/animation/tracks/QuaternionKeyFrameTrack';
import VectorKeyFrameTrack from '../src/animation/tracks/VectorKeyFrameTrack'
import AnimationClip from '../src/animation/AnimationClip';
import AnimationMixer from '../src/animation/AnimationMixer';
import {
    LINEAR_INTERPOLATION,
    STEP_INTERPOLATION,
    CUBIC_SPLINE_INTERPOLATION
} from '../src/constants';
import Euler from '../src/math/Euler';
import Quaternion from '../src/math/Quaternion';

let _e = new Euler(),
    _q = new Quaternion();

export default class InterpolationExample extends Example {

    constructor() {

        super({ useOrbit: false });

        this.clock = new Clock();

        let camera = this.camera,
            boxGeometry = new BoxGeometry(1, 1, 1),
            material = new Material({color: 'red'}),
            times = [0, 1, 2],
            clips = [],
            scaleX = 10 * Math.tan(camera.fovy / 2) * camera.aspect,
            scaleY = 10 * Math.tan(camera.fovy / 2);

        // y / y_n = d / n => y = d / n * y_n = d / n * (y_c * tan * n) = d * y_c * tan
        // x / x_n = d / n => x = d / n * x_n = d / n * (x_c * tan * n * aspect) = d * x_c * tan * aspect
        // y_n / h = y_c => y_n = y_c * h = y_c * tan * n
        // w / h = aspect
        // x_n / w = x_c => x_n = x_c * w = x_c * tan * n * aspect
        // h = tan * n

        for(let i = 0; i < 3; i++) {

            let property,
                tracks = [];

            if (i === 0) {
                property = 'position';
            } else if (i === 1) {
                property = 'quaternion';
            } else if (i === 2) {
                property = 'scale';
            }

            for(let j = 0; j < 3; j++) {

                let box = new Mesh(boxGeometry, material),
                    x = (-0.5 + 0.5 * i) * scaleX,
                    y = (0.5 - 0.5 * j) * scaleY,
                    z = 0,
                    values = [],
                    interpolation;

                box.position.set(x, y, z);

                this.scene.add(box);

                if (j === 0) {
                    interpolation = LINEAR_INTERPOLATION;
                } else if (j === 1) {
                    interpolation = STEP_INTERPOLATION;
                } else {
                    interpolation = CUBIC_SPLINE_INTERPOLATION;
                }

                if (property === 'position') {
                    values.push(x, y, z);
                    values.push(x + 0.5, y, z);
                    values.push(x, y, z);

                    tracks.push(new VectorKeyFrameTrack(box, property, times, values, interpolation));
                } else if (property === 'quaternion') {
                    _q.setFromEuler(_e);
                    values.push(_q.x, _q.y, _q.z, _q.w);
                    _e.y = Math.PI / 4;
                    _q.setFromEuler(_e);
                    values.push(_q.x, _q.y, _q.z, _q.w);
                    _e.y = 0;
                    _q.setFromEuler(_e);
                    values.push(_q.x, _q.y, _q.z, _q.w);

                    tracks.push(new QuaternionKeyFrameTrack(box, property, times, values, interpolation));
                } else if (property === 'scale') {
                    values.push(1, 1, 1);
                    values.push(2, 2, 2);
                    values.push(1, 1, 1);

                    tracks.push(new VectorKeyFrameTrack(box, property, times, values, interpolation));
                }

            }

            clips.push(new AnimationClip(`box.${property}`, -1, tracks));

        }

        this.mixer = new AnimationMixer(clips);

    }

    update() {
        let deltaTime = this.clock.getDeltaTime();
        this.mixer.update(deltaTime);
    }

}
