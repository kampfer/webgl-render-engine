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

        const buffer = this.makeRectangleBuffer(100, 100, 0, 30);
        const buffer2 = this.makeRectangleBuffer(100, 100, 100, 30);
        const geometry = new Geometry();

        geometry.setAttribute('position', buffer);
        geometry.setMorphAttribute('position', [buffer2]);
        geometry.setIndex(new BufferAttribute(new Uint8Array([0, 2, 3, 0, 3, 1]), 1));

        const material = new Material({ color: 'red' });
        material.morphTargets = true;

        const mesh = new Mesh(geometry, material);

        this.scene.add(mesh);

        this.mixer = new AnimationMixer([
            new AnimationClip('grow', undefined, [
                new NumberKeyFrameTrack(mesh, 'morphTargetInfluences', [0, 2], [0, 1])
            ])
        ]);

        this.mixer.playClip('grow');

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

}