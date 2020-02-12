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
    camera = new PerspectiveCamera(60, 1, 0.1, 100);

material.color = [0.5, 0.4, 0.3, 1];

scene.add(mesh);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor([0.1, 0.1, 0.1, 1]);

document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);