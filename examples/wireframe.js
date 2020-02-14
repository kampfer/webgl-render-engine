// [WebGL 中 wireframe 的实现](https://zhuanlan.zhihu.com/p/48499247)

import WebGLRenderer from '../src/renderers/WebGLRenderer';
import PerspectiveCamera from '../src/cameras/PerspectiveCamera';
import Scene from '../src/Scene';
import Mesh from '../src/Mesh';
import BoxGeometry from '../src/geometries/BoxGeometry';
import WireframeGeometry from '../src/geometries/WireframeGeometry';
import Material from '../src/materials/Material';

let material = new Material();
material.color = [0.5, 0.4, 0.3, 1];

let scene = new Scene();

let boxGeometry = new BoxGeometry(2, 2, 2),
    box = new Mesh(boxGeometry, material);
box.position.set(3, 0, 0);
scene.add(box);

let wireframeGeometry = new WireframeGeometry(boxGeometry),
    box2 = new Mesh(wireframeGeometry, material);
box2.drawMode = 1;
box2.position.set(-3, 0, 0);
scene.add(box2);

let camera = new PerspectiveCamera(60 * Math.PI / 180, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(1, 1, 10);
camera.updateWorldMatrix();

let renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor([1, 1, 1, 1]);
document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    scene.traverse(function (child) {
        child.rotation.x += 0.01;
        child.rotation.y += 0.01;
    });
    renderer.render(scene, camera);
}

animate();