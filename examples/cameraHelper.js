import Example from './Example';
import CameraHelper from '../src/helpers/CameraHelper';
import PerspectiveCamera from '../src/camera/PerspectiveCamera';
import OrthgraphicCamera from '../src/camera/OrthgraphicCamera';
import { degToRad } from '../src/math/utils';
import Mesh from '../src/objects/Mesh';
import BoxGeometry from '../src/geometries/BoxGeometry';
import Material from '../src/materials/Material';
import WebGLRenderer from '../src/renderers/WebGLRenderer';

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 600;

export default class CameraHelperExample extends Example {

    constructor() {
        super();

        let perspectiveCamera = new PerspectiveCamera(degToRad(60), 1, aspect, 1, 1000),
            orthgraphicCamera = new OrthgraphicCamera(
                -0.5 * frustumSize * aspect / 2,
                0.5 * frustumSize * aspect / 2,
                frustumSize / 2,
                -frustumSize / 2
            ),
            perspectiveCameraHelper = new CameraHelper(perspectiveCamera),
            orthgraphicCameraHelper = new CameraHelper(orthgraphicCamera);

        this.setActiveCamera = function (type) {
            if (this.activeHelper) {
                this.scene.remove(this.activeHelper);
            }
    
            if (type === 'perspective') {
                this.activeCamera = perspectiveCamera;
                this.activeHelper = perspectiveCameraHelper;
            } else if (type === 'orthgraphic') {
                this.activeCamera = orthgraphicCamera;
                this.activeHelper = orthgraphicCameraHelper;
            }
    
            this.scene.add(this.activeHelper);
        }

        this.setActiveCamera('perspective');

        let boxGeometry = new BoxGeometry(1, 1, 1),
            material = new Material(),
            mesh = new Mesh(boxGeometry, material);
        this.scene.add(mesh);

        let renderer = new WebGLRenderer();
        this.renderer = renderer;
        document.body.appendChild(renderer.domElement);

        this.handleKeyPress = function (e) {
            if (e.keyCode === 80) {
                this.setActiveCamera('perspective');
            } else if (e.keyCode === 79) {
                this.setActiveCamera('orthgraphic');
            }
        }

        window.document.addEventListener('keypress', this.handleKeyPress, false);
    }

    render() {
        this.renderer.render(this.scene, this.activeCamera);
    }

    destroy() {
        super.destroy();
        document.body.removeChild(this.renderer.domElement);
        window.document.removeEventListener('keypress', this.handleKeyPress);
    }

}