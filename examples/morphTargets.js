import Example from './example';
import {
    Geometry,
    Material,
    Mesh,
    AnimationMixer,
    AnimationClip,
    OrthographicCamera,
    Vec3,
    BufferAttribute,
    NumberKeyFrameTrack,
    VectorKeyFrameTrack,
} from '../src';

export default class MorphTargetsExample extends Example {

    constructor() {

        const ratio = window.innerWidth / window.innerHeight;
        const camera = new OrthographicCamera(-ratio / 2, ratio / 2, 0.5, -0.5, 0.1, 100);
        camera.lookAt(0, 0, 0);
        camera.position.set(0, 0, 1);
        camera.updateWorldMatrix();

        super({
            camera,
            useOrbit: false
        });

        const rect1 = this.makeRectangle(100, 100, 100, 30, 'red');
        const rect2 = this.makeRectangle(100, 150, 200, 30, 'blue');

        const start = this.pixel2NDC(100, 100).unproject(camera);
        const end = this.pixel2NDC(100, 150).unproject(camera);
        const diff = end.sub(start);

        this.scene.add(rect1);
        this.scene.add(rect2);

        this.mixer = new AnimationMixer([
            new AnimationClip('grow', undefined, [
                new NumberKeyFrameTrack(rect1, 'morphTargetInfluences', [0, 1], [0, 1]),
                new NumberKeyFrameTrack(rect2, 'morphTargetInfluences', [0, 1], [0, 1])
            ]),
            new AnimationClip('change', undefined, [
                new VectorKeyFrameTrack(rect1, 'position', [0, 0.5, 0.6], [0, 0, 0, diff.x, diff.y, diff.z]),
                new VectorKeyFrameTrack(rect2, 'position', [0, 0.5, 0.6], [0, 0, 0, -diff.x, -diff.y, -diff.z])
            ])
        ]);

        this.mixer.playClip('grow');
        this.mixer.playClip('change');

    }

    update() {
        this.mixer.update(this.clock.getDeltaTime());
    }

    pixel2NDC(x, y, z = 0) {
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        return new Vec3((x - halfWidth) / halfWidth, (halfHeight - y) / halfHeight, z);
    }

    makeRectangleBuffer(x, y, width, height) {
        const camera = this.camera;
        const vertex1 = this.pixel2NDC(x, y).unproject(camera);
        const vertex2 = this.pixel2NDC(x + width, y).unproject(camera);
        const vertex3 = this.pixel2NDC(x, y + height).unproject(camera);
        const vertex4 = this.pixel2NDC(x + width, y + height).unproject(camera);
        const vertices = [
            vertex1.x, vertex1.y, vertex1.z,
            vertex2.x, vertex2.y, vertex2.z,
            vertex3.x, vertex3.y, vertex3.z,
            vertex4.x, vertex4.y, vertex4.z,
        ];
        return new BufferAttribute(new Float32Array(vertices), 3);
    }

    makeRectangle(x, y, width, height, color) {
        const buffer = this.makeRectangleBuffer(x, y, 0, height);
        const buffer2 = this.makeRectangleBuffer(x, y, width, height);
        const geometry = new Geometry();

        geometry.setAttribute('position', buffer);
        geometry.setMorphAttribute('position', [buffer2]);
        geometry.setIndex(new BufferAttribute(new Uint8Array([0, 2, 3, 0, 3, 1]), 1));

        const material = new Material({ color });
        material.morphTargets = true;

        const mesh = new Mesh(geometry, material);

        return mesh;
    }

}