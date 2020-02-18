import WebGLRenderer from '../src/renderers/WebGLRenderer';
import PerspectiveCamera from '../src/cameras/PerspectiveCamera';
import Scene from '../src/objects/Scene';
import LineSegments from '../src/objects/LineSegments';
import Mesh from '../src/objects/Mesh';
import Material from '../src/materials/Material';
import Geometry from '../src/geometries/Geometry';
import BufferAttribute from '../src/renderers/BufferAttribute';
import GraphObject from '../src/objects/GraphObject';
import OrbitController from '../src/controllers/OrbitController';

let material = new Material();
material.color = [0, 0, 0, 1];

let geometry = new Geometry(),
    vertices = new Float32Array([
        0, 0, 0,
        2, 0.5, -1,
        2, 0.5, 1,
        2, -0.5, 1,
        2, -0.5, -1
    ]),
    indices = new Uint8Array([
        0, 1,
        0, 2,
        0, 3,
        0, 4,
        1, 2,
        2, 3,
        3, 4,
        4, 1
    ]);
geometry.setAttribute('position', new BufferAttribute(vertices, 3));
geometry.setIndex(new BufferAttribute(indices, 1));

let cameraBody= new LineSegments(geometry, material);

let upTriangleGeometry = new Geometry(),
    upTriangleVertices = new Float32Array([
        2, 0.6, -0.8,
        2, 1, 0,
        2, 0.6, 0.8,
    ]),
    upTriangleIndices = new Uint8Array([0, 1, 2]);
upTriangleGeometry.setAttribute('position', new BufferAttribute(upTriangleVertices, 3));
upTriangleGeometry.setIndex(new BufferAttribute(upTriangleIndices, 1));

let upTriangle = new Mesh(upTriangleGeometry, material);

let cameraViewer = new GraphObject();
cameraViewer.add(cameraBody);
cameraViewer.add(upTriangle);
cameraViewer.position.set(0, 0, 0);

let scene = new Scene();
scene.add(cameraViewer);

let camera = new PerspectiveCamera(60 * Math.PI / 180, window.innerWidth / window.innerHeight, 0.1, 100);
camera.lookAt(0, 0, 0);
camera.position.set(0, 0, 10);
camera.updateWorldMatrix();

let renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor([1, 1, 1, 1]);
document.body.appendChild(renderer.domElement);

let orbitCameraController = new OrbitController(camera, renderer.domElement);

// https://stackoverflow.com/questions/12886286/addeventlistener-for-keydown-on-canvas
renderer.domElement.setAttribute('tabindex', 1);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();