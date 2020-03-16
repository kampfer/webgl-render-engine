// [WebGL 中 wireframe 的实现](https://zhuanlan.zhihu.com/p/48499247)
// https://threejs.org/examples/?q=wire#webgl_materials_wireframe

import Mesh from '../src/objects/Mesh';
import BoxGeometry from '../src/geometries/BoxGeometry';
import WireframeGeometry from '../src/geometries/WireframeGeometry';
import Material from '../src/materials/Material';
import Example from './Example';

export default class AxesHelperExample extends Example {

    constructor() {

        super();

        let material = new Material({color: '#ccc'});

        let boxGeometry = new BoxGeometry(2, 2, 2),
            box = new Mesh(boxGeometry, material);
        box.position.set(3, 0, 0);
        this.scene.add(box);

        let wireframeGeometry = new WireframeGeometry(boxGeometry),
            box2 = new Mesh(wireframeGeometry, material);
        box2.drawMode = 1;
        box2.position.set(-3, 0, 0);
        this.scene.add(box2);

    }

    update() {
        this.scene.traverse(function (child) {
            child.rotation.y += 0.01;
        });
    }

}
