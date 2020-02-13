// [WebGL 中 wireframe 的实现](https://zhuanlan.zhihu.com/p/48499247)

import WebGLRenderer from '../src/renderers/WebGLRenderer';
import PerspectiveCamera from '../src/cameras/PerspectiveCamera';
import Scene from '../src/Scene';
import Mesh from '../src/Mesh';
import BoxGeometry from '../src/geometries/BoxGeometry';
import Material from '../src/materials/Material';

let geometry = new BoxGeometry(2, 2, 2),
    material = new Material(),
    mesh = new Mesh(geometry, material),
    scene = new Scene(),
    renderer = new WebGLRenderer(),
    camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);

material.color = [0.5, 0.4, 0.3, 1];

camera.lookAt(0, 0, 0);
camera.position.set(0.1, 0.2, 10);
camera.updateWorldMatrix();

scene.add(mesh);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor([1, 1, 1, 1]);

document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.01;
    mesh.rotation.x += 0.01;
    renderer.render(scene, camera);
}

animate();