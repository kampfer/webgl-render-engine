import Example from './Example';
import CanvasTexture from '../src/textures/CanvasTexture';
import Material2D from '../src/materials/Material2D';
import Mesh from '../src/objects/Mesh';
import BufferAttribute from '../src/renderers/BufferAttribute';
import OrthographicCamera from '../src/cameras/OrthographicCamera';
import Geometry from '../src/geometries/Geometry';
import Vec3 from '../src/math/Vec3';
import * as constants from '../src/constants';

const x = 100;
const y = 100;
const width = 128;
const height = 128;

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

        // https://webglfundamentals.org/webgl/webgl-3d-textures-repeat-clamp.html
        const geometry = this.makeGeometry(x, y, width * 2, height * 2);
        geometry.setAttribute('uv', new BufferAttribute(
            new Float32Array([
                0, 1,
                2, 1,
                0, -1,
                2, -1
            ]),
            2
        ));

        const texture = this.makeCanvasTexture();
        texture.wrapT = constants.REPEAT_WRAPPING;
        texture.wrapS = constants.MIRRORED_REPEAT_WRAPPING;

        const material = new Material2D();
        material.map = texture;

        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);

        this.update = function () {
            const text = `${new Date().getTime()}`;
            const ctx = texture.image.getContext('2d');
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = 'red';
            ctx.fillRect(0, 0, width, height);
            ctx.strokeStyle = 'green';
            ctx.strokeRect(0, 0, width, height);
            ctx.fillStyle = 'black';
            ctx.fillText(text, 0, 0);
        }

    }

    makeVertexFromPixel(x, y) {
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        return new Vec3((x - halfWidth) / halfWidth, (halfHeight - y) / halfHeight, 0);
    }

    /**
     * 0 - 1
     * |   |
     * 2 - 3
     */
    makeGeometry(x, y, width, height) {

        const camera = this.camera;
        const vertex1 = this.makeVertexFromPixel(x, y).unproject(camera);
        const vertex2 = this.makeVertexFromPixel(x + width, y).unproject(camera);
        const vertex3 = this.makeVertexFromPixel(x, y + height).unproject(camera);
        const vertex4 = this.makeVertexFromPixel(x + width, y + height).unproject(camera);
        const vertices = [
            vertex1.x, vertex1.y, vertex1.z,
            vertex2.x, vertex2.y, vertex2.z,
            vertex3.x, vertex3.y, vertex3.z,
            vertex4.x, vertex4.y, vertex4.z,
        ];

        const geometry = new Geometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        geometry.setIndex(new BufferAttribute(new Uint8Array([0, 2, 3, 0, 3, 1]), 1));

        return geometry;

    }

    makeCanvasTexture() {

        // const offscreen = new OffscreenCanvas(width, height);
        const offscreen = document.createElement('canvas');
        offscreen.width = width;
        offscreen.height = height;
        document.body.appendChild(offscreen);

        const ctx = offscreen.getContext('2d');
        ctx.font = `12px monospace`;
        ctx.textAlign = "left" ;
        ctx.textBaseline = "top";
        ctx.fillStyle = 'black';

        const texture = new CanvasTexture({ image: offscreen });

        return texture;

    }

}
