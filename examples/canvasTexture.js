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
        const ctx = offscreen.getContext('2d');

        const text = `${new Date().getTime()}`;
        const textRect = ctx.measureText(text);
        const textHeight = 20;
        const textWidth = textRect.width;

        ctx.font = `20px monospace`;
        ctx.textAlign = "left" ;
        ctx.textBaseline = "top";
        ctx.fillStyle = 'black';
        ctx.fillText(text, 0, 0);

        const texture = new CanvasTexture({ image: offscreen });
        const geometry = new PlaneGeometry(2, 2);
        const material = new Material2D();
        const mesh = new Mesh(geometry, material);

        material.map = texture;

        geometry.setAttribute('uv', new BufferAttribute(
            new Float32Array([
                textWidth / 256, 1,
                0, 1,
                0, 1 - (textHeight / 256),
                textWidth / 256, 1 - (textHeight / 256)
            ]),
            2
        ));

        this.scene.add(mesh);

        document.body.appendChild(offscreen);

        this.update = function () {

            


        }

    }

}
