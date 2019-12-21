import './main.less';

import WebGLRenderer from '../../src/renderers/WebGLRenderer';
import PerspectiveCamera from '../../src/cameras/PerspectiveCamera';
import GLTFLoader from './GLTFLoader';

let glTFLoader = new GLTFLoader(),
    gltfPath = location.search.match(/\?gltf=(.*)/);

if (gltfPath) {
    gltfPath = gltfPath[1];
} else {
    gltfPath = './gltf2/Triangle/Triangle.gltf';
}

// https://gltf-viewer.donmccurdy.com/
// https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0
// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#properties-reference
glTFLoader.load(gltfPath)
    .then(function (gltf) {
        console.log('gltf:', gltf);

        let scene = gltf.scenes[gltf.scene];

        let cameras = []
        scene.children.forEach((child) => {
            if (child.type === 'PerspectiveCamera' || child.type === 'OrthographicCamera') {
                cameras.push(child);
            }
        });

        let camera = null,
            index = 0;
        if (cameras.length > 0 && cameras[index]) {
            camera = cameras[index];
        } else {
            camera = new PerspectiveCamera(30 * (Math.PI / 180), window.innerWidth / window.innerHeight, 1, 100);
            camera.position.set(1, 1, 5);
        }
        camera.lookAt(0, 0, 0);

        let renderer = new WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor([1, 1, 1, 1]);
        document.body.appendChild(renderer.domElement);

        renderer.render(scene, camera);
    })
    .catch(function (error) {
        console.log(error);
    });
