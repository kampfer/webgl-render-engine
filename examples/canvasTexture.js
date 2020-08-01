import Example from './Example';
import CanvasTexture from '../src/textures/CanvasTexture';
import PlaneGeometry from '../src/geometries/PlaneGeometry';
import Material2D from '../src/materials/Material2D';
import Mesh from '../src/objects/Mesh';
import BufferAttribute from '../src/renderers/BufferAttribute';

export default class canvasTextureExample extends Example {

    constructor() {

        super();

        const offscreen = new OffscreenCanvas(256, 256);
        offscreen.width = 256;
        offscreen.height = 256;

        const ctx = offscreen.getContext('2d');
        ctx.font = `100px monospace`;
        ctx.textAlign = "center" ;
        ctx.textBaseline = "top";
        ctx.fillStyle = 'red';
        ctx.fillText('Hi, there!', 0, 0);

        const texture = new CanvasTexture({ image: offscreen });
        const geometry = new PlaneGeometry(2, 2);
        const material = new Material2D();
        const mesh = new Mesh(geometry, material);

        material.map = texture;

        geometry.setAttribute('uv', new BufferAttribute(
            new Float32Array([
                1, 1,
                0, 1,
                0, 0,
                1, 0
            ]),
            2
        ));

        this.scene.add(mesh);

    }

}
