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

// t = (s_2 - s_1) / (v_1 - v_2)
// t_1 = (0 - 50) / (50 - 150) = 0.5;
// t_2 = (150 - 100) / (100 - 300) = -0.25;
const data = [
    {
        values: [50, 100, 200],
    },
    {
        values: [0, 150, 450],
    }
];

// https://learnui.design/tools/data-color-picker.html#palette
const colors = [
    '#003f5c',
    '#2f4b7c',
    '#665191',
    '#a05195',
    '#d45087',
    '#f95d6a',
    '#ff7c43',
    '#ffa600',
];

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

        const x = 100;
        const y = 100;
        const size = 30;
        const padding = 20;

        const growTacks = [];
        const changeTracks = [];

        for(let i = 0, l = data.length; i < l; i++) {

            let item = data[i],
                startValue = item.values[0],
                latestValue = item.values[item.values.length - 1],
                buffer1,
                buffer2;

            if (startValue !== undefined) buffer1 = this.makePositionBuffer(x, y + i * (padding + size), startValue, size);
            if (latestValue !== undefined) buffer2 = this.makePositionBuffer(x, y + i * (padding + size), latestValue, size);

            const geometry = new Geometry();
            geometry.setAttribute('position', buffer1); 
            geometry.setMorphAttribute('position', [buffer2]);
            geometry.setIndex(new BufferAttribute(new Uint8Array([0, 2, 3, 0, 3, 1]), 1));

            const material = new Material({ color: colors[i] });
            material.morphTargets = true;

            const rect = new Mesh(geometry, material)
            this.scene.add(rect);

            growTacks.push(new NumberKeyFrameTrack(
                rect, 'morphTargetInfluences', item.values.map((v, i) => i * 1), item.values.map(v => v / latestValue)
            ));

            // const changeTrack = new VectorKeyFrameTrack();

        }

        this.mixer = new AnimationMixer([
            new AnimationClip('grow', undefined, growTacks),
            // new AnimationClip('change', undefined, changeTracks)
        ]);

        this.mixer.playClip('grow');
        // this.mixer.playClip('change');

    }

    update() {
        this.mixer.update(this.clock.getDeltaTime());
    }

    pixel2NDC(x, y, z = 0) {
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        return new Vec3((x - halfWidth) / halfWidth, (halfHeight - y) / halfHeight, z);
    }

    makePositionBuffer(x, y, width, height) {
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