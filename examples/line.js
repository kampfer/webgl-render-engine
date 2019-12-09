import Scene from '../src/Scene';
import PerspectiveCamera from '../src/cameras/PerspectiveCamera';
import WebGLRenderer from '../src/renderers/WebGLRenderer';
import Geometry from '../src/geometries/Geometry';
import Material from '../src/materials/Material';
import Line from '../src/Line';
import PlaneGeometry from '../src/geometries/PlaneGeometry';
import Plane from '../src/Plane';
import OrbitCameraController from '../src/cameras/OrbitCameraController';

let renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor([1, 1, 1, 1]);
document.body.appendChild(renderer.domElement);

// camera上方向默认为y轴正方向
let camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100);
camera.setPosition(2, 2, 5);
camera.lookAt(0, 0, 0);

let scene = new Scene();

// 坐标轴
let w = 0.02;
[{
    color: [1.0, 0.0, 0.0],
    vertices: [[1, 0, 0], [-1, 0, 0]]
}, {
    color: [0.0, 1.0, 0.0],
    vertices: [[0, 1, 0], [0, -1, 0]]
}, {
    color: [0, 0, 1],
    vertices: [[0, 0, 1], [0, 0, -1]]
}, {
    color: [1.0, 0.0, 0.0],
    vertices: [[1 - w, w, 0], [1.0, 0.0, 0.0], [1 - w, -w, 0.0]]
}, {
    color: [0.0, 1.0, 0.0],
    vertices: [[w, 1.0 - w, 0.0], [0.0, 1.0, 0.0], [-w, 1.0 - w, 0.0]]
}, {
    color: [0.0, 0.0, 1.0],
    vertices: [[0.0, w, 1.0 - w], [0.0, 0.0, 1.0], [0.0, -w, 1.0 - w]]
}].forEach((item) => {
    let geometry = new Geometry();
    item.vertices.forEach((vertex) => {
        geometry.vertices.push(...vertex);
        geometry.colors.push(...item.color);
    });
    let material = new Material({ color: item.color }),
    line = new Line(geometry, material);
    scene.add(line);
});

let planeGeometry = new PlaneGeometry(1, 1),
    planeMaterial = new Material({ color: [1, 1, 0]}),
    plane = new Plane(planeGeometry, planeMaterial);
scene.add(plane);

let cameraController = new OrbitCameraController(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    cameraController.update();
    renderer.render(scene, camera);
}

animate();
