import Example from './Example';
import CameraHelper from '../src/helpers/CameraHelper';
import PerspectiveCamera from '../src/cameras/PerspectiveCamera';
import OrthographicCamera from '../src/cameras/OrthographicCamera';
import { degToRad } from '../src/math/utils';
import Mesh from '../src/objects/Mesh';
import BoxGeometry from '../src/geometries/BoxGeometry';
import Material from '../src/materials/Material';
import Color from '../src/math/Color';

const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
const aspect = winWidth / winHeight;
const frustumSize = 10;

export default class CameraHelperExample extends Example {

    constructor() {
        super();

        let boxGeometry = new BoxGeometry(1, 1, 1),
            material = new Material(),
            mesh = new Mesh(boxGeometry, material);
        material.color = new Color('red');
        mesh.position.set(5, 0, 0);
        this.scene.add(mesh);

        this.camera = new PerspectiveCamera(degToRad(60), 0.5 * aspect, 1, 10000);
        this.camera.position.set(0, 0, 20);
        this.camera.lookAt(0, 0, 0);
        this.camera.updateWorldMatrix();

        let perspectiveCamera = new PerspectiveCamera(degToRad(60), 0.5 * aspect, 1, 10),
            orthographicCamera = new OrthographicCamera(
                -0.5 * frustumSize * aspect / 2,
                0.5 * frustumSize * aspect / 2,
                frustumSize / 2,
                -frustumSize / 2,
                1, 10
            );

        perspectiveCamera.lookAt(mesh.position);
        perspectiveCamera.updateWorldMatrix();

        orthographicCamera.lookAt(mesh.position);
        orthographicCamera.updateWorldMatrix();

        let perspectiveCameraHelper = new CameraHelper(perspectiveCamera),
            orthographicCameraHelper = new CameraHelper(orthographicCamera);

        perspectiveCameraHelper.visible = false;
        orthographicCameraHelper.visible = false;

        this.scene.add(perspectiveCameraHelper);
        this.scene.add(orthographicCameraHelper);

        this.setActiveCamera = function (type) {
            if (type === 'perspective') {
                this.activeCamera = perspectiveCamera;
                this.activeHelper = perspectiveCameraHelper;
            } else if (type === 'orthgraphic') {
                this.activeCamera = orthographicCamera;
                this.activeHelper = orthographicCameraHelper;
            }
        }

        this.renderer.autoClear = false;

        this.setActiveCamera('orthgraphic');

        let self = this;
        this.handleKeyPress = function (e) {
            if (e.keyCode === 112) {    // p
                self.setActiveCamera('perspective');
            } else if (e.keyCode === 111) { // o
                self.setActiveCamera('orthgraphic');
            }
        }

        window.document.addEventListener('keypress', this.handleKeyPress, false);
    }

    render() {
        let renderer = this.renderer;

        renderer.clear();

        this.activeCamera.rotation.y += 0.005;
        this.activeCamera.updateWorldMatrix();

        this.scene.children[0].rotation.y += 0.01;

        // 上帝视角
        this.activeHelper.visible = true;
        renderer.setViewport(0, 0, winWidth / 2, winHeight);
        renderer.render(this.scene, this.camera);

        this.activeHelper.visible = false;
        renderer.setViewport(winWidth / 2, 0, winWidth / 2, winHeight);
        renderer.render(this.scene, this.activeCamera);

    }

    destroy() {
        super.destroy();
        document.body.removeChild(this.renderer.domElement);
        window.document.removeEventListener('keypress', this.handleKeyPress);
    }

}