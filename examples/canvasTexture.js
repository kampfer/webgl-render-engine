import Example from './Example';
import CanvasTexture from '../src/textures/CanvasTexture';
import PlaneGeometry from '../src/geometries/PlaneGeometry';
import Material2D from '../src/materials/Material2D';
import Mesh from '../src/objects/Mesh';
import BufferAttribute from '../src/renderers/BufferAttribute';
import OrthographicCamera from '../src/cameras/OrthographicCamera';
import Material from '../src/materials/Material';
import Color from '../src/math/Color';

export default class canvasTextureExample extends Example {

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
        const geometry = new PlaneGeometry(256 / window.innerWidth, 256 / window.innerHeight);
        const material = new Material2D();
        const mesh = new Mesh(geometry, material);

        const rect = new Mesh(geometry, new Material({ color: new Color('red') }));
        this.scene.add(rect);

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

        this.update = function () {

            


        }

    }

}
