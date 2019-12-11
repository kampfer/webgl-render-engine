import WebGLRenderer from '../../src/renderers/WebGLRenderer';
import PerspectiveCamera from '../../src/cameras/PerspectiveCamera';
import GLTFLoader from './GLTFLoader';

let renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor([1, 1, 1, 1]);
document.body.appendChild(renderer.domElement);

let camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100);
camera.setPosition(2, 2, 5);
camera.lookAt(0, 0, 0);

let glTFLoader = new GLTFLoader();
glTFLoader.load('./gltf2/cube/Cube.gltf').then(function (gltf) {
    console.log('gltf:', gltf);
    let scene = gltf.scenes[gltf.scene];
    renderer.render(scene, camera);
});
