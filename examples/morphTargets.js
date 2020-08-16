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

const data = [
    {
        label: 'one',
        values: [50, 100, 200],
    },
    {
        label: 'two',
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

        const canvasWidth = this.renderer.domElement.width;
        const canvasHeight = this.renderer.domElement.height;
        const x = 100;
        const y = 100;
        const size = 30;
        const padding = 20;

        const growTacks = [];
        const columns = [];

        for(let i = 0, l = data.length; i < l; i++) {

            let item = data[i],
                startValue = item.values[0],
                latestValue = item.values[item.values.length - 1],
                buffer1,
                buffer2;

            if (startValue !== undefined) buffer1 = this.makePositionBuffer(canvasWidth / 2, canvasHeight / 2, startValue, size);
            if (latestValue !== undefined) buffer2 = this.makePositionBuffer(canvasWidth / 2, canvasHeight / 2, latestValue, size);

            const geometry = new Geometry();
            geometry.setAttribute('position', buffer1); 
            geometry.setMorphAttribute('position', [buffer2]);
            geometry.setIndex(new BufferAttribute(new Uint8Array([0, 2, 3, 0, 3, 1]), 1));

            const material = new Material({ color: colors[i] });
            material.morphTargets = true;

            const rect = new Mesh(geometry, material);
            this.scene.add(rect);

            growTacks.push(new NumberKeyFrameTrack(
                rect, 'morphTargetInfluences', item.values.map((v, i) => i * 1), item.values.map(v => v / latestValue)
            ));

            // 将数据按列储存
            item.values.forEach((v, i) => {
                if (columns[i] === undefined) columns[i] = [];
                columns[i].push({ value: v, node: rect });
            });

        }

        const orders = new Map();
        // 从大到小排序
        columns.forEach(arr => {

            arr.sort((a, b) => b.value - a.value)
                .forEach((item, i) => {

                    let order = orders.get(item.node);

                    if (!order) {
                        order = [i];
                        orders.set(item.node, order);

                        // 设置node的初始位置
                        const position = this.pixel2NDC(x, y + i * (padding + size)).unproject(camera);
                        position.sub(new Vec3());
                        item.node.position.copy(position);
                    } else {
                        order.push(i);
                    }

                });

        });

        // 生成transform track
        const transformTracks = [];

        for(let [node, order] of orders) {

            const values = [];
            const intervals = [];

            let i = 0;

            while(i < order.length - 1) {

                if (order[i] !== order[i + 1]) {

                    intervals.push((i + 1) * 1 - 0.5);
                    intervals.push((i + 1) * 1);

                    let position1 = this.pixel2NDC(x, y + order[i] * (padding + size)).unproject(camera)
                    values.push(position1.x, position1.y, position1.z);

                    let position2 = this.pixel2NDC(x, y + order[i + 1] * (padding + size)).unproject(camera)
                    values.push(position2.x, position2.y, position2.z);

                    i += 2;

                }

                i++;

            }

            // value: [50, 100, 200] [0, 150, 450]
            // order: [0, 1, 1] [1, 0, 0]
            // g_t: [0, 1, 2] [0, 1, 2]
            // t_t: [0.5, 1, 2] [0.5, 1, 2]
            transformTracks.push(
                new VectorKeyFrameTrack(node, 'position', intervals, values)
            );

        }

        this.mixer = new AnimationMixer([
            new AnimationClip('grow', undefined, growTacks),
            new AnimationClip('transform', undefined, transformTracks)
        ]);

        this.mixer.playClip('grow');
        this.mixer.playClip('transform');

    }

    update() {
        this.mixer.update(this.clock.getDeltaTime());
    }

    pixel2NDC(x, y, z = 0) {
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        return new Vec3((x - halfWidth) / halfWidth, (halfHeight - y) / halfHeight, z);
    }

    /**
     * 0 - 1
     * |   |
     * 2 - 3
     */
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