import Example from './example';
import PlaneGeometry from '../src/geometries/PlaneGeometry';
import Material2D from '../src/materials/Material2D';
import Mesh from '../src/objects/Mesh';
import Texture from '../src/textures/Texture';
import BufferAttribute from '../src/renderers/BufferAttribute';
import { NEAREST_FILTER } from '../src/constants';

export default class TextureExample extends Example {

    constructor() {

        super({ useOrbit: false });

        const img = new Image();

        img.crossOrigin = "anonymous";

        img.onload = () => {

            const ratio = img.width / img.height;
            const width = 6;
            const height = width / ratio;

            const geometry = new PlaneGeometry(width, height);

            const uv = new BufferAttribute(
                new Float32Array([
                    1, 1,
                    0, 1,
                    0, 0,
                    1, 0
                ]),
                2
            );
            geometry.setAttribute('uv', uv);

            const texture = new Texture({ image: img, minFilter: NEAREST_FILTER });
            const materail = new Material2D();
            materail.map = texture;

            const mesh = new Mesh(geometry, materail);

            this.scene.add(mesh);

        };

        img.src = 'http://img.mp.itc.cn/upload/20170116/ac4a8b4914464fa9bcf6df8c5a85a61d_th.jpg';

    }

}
