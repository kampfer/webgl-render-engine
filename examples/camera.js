import Example from './Example';
import BoxGeometry from '../src/geometries/BoxGeometry';
import Material from '../src/materials/Material';
import Mesh from '../src/objects/Mesh';
import GridHelper from '../src/helpers/GridHelper';
import PerspectiveCamera from '../src/cameras/PerspectiveCamera';
import OrthographicCamera from '../src/cameras/OrthographicCamera';
import { degToRad } from '../src/math/utils';
import Vec3 from '../src/math/Vec3';
import OrbitController from '../src/controllers/OrbitController';

export default class AxesHelperExample extends Example {

    constructor() {

        let aspect = window.innerWidth / window.innerHeight,
            fovy = degToRad(60),
            near = 0.1,
            far = 100,
            target = new Vec3(0, 0, 0),
            position = new Vec3(0, 0, 10),
            frustumSize = Math.tan(fovy / 2) * position.length(),
            perspectiveCamera = new PerspectiveCamera(fovy, aspect, near, far),
            orthographicCamera = new OrthographicCamera(-frustumSize * aspect, frustumSize * aspect, frustumSize, -frustumSize, near, far);

        super({ camera: orthographicCamera });

        this.cameras = [perspectiveCamera, orthographicCamera];

        this.cameras.forEach((camera) => {
            camera.position.copy(position);
            camera.lookAt(target);
            camera.updateWorldMatrix();
        });

        let boxGeometry = new BoxGeometry(1, 1, 1),
            material = new Material({color: 'red'}),
            box = new Mesh(boxGeometry, material);
        this.scene.add(box);

        let gridHelper = new GridHelper(100, 100, '#ccc');
        this.scene.add(gridHelper);

        let tip = document.createElement('div');
        tip.innerHTML = 'orthographicCamera';
        tip.style.position = 'fixed';
        tip.style.top = 0;
        tip.style.left = 0;
        document.body.appendChild(tip);
        this.tip = tip;

        this.handleKeyPress = this.handleKeyPress.bind(this);
        window.addEventListener('keypress', this.handleKeyPress, false);

    }

    handleKeyPress(e) {
        if (e.keyCode === 112) {
            this.camera = this.cameras[0];
            this.tip.innerHTML = 'perspectiveCamera';
        } else if (e.keyCode === 111) {
            this.camera = this.cameras[1];
            this.tip.innerHTMl = 'orthographicCamera';
        }

        if (this.cameraController) {
            this.cameraController.destroy();
            this.cameraController = new OrbitController(this.camera, this.renderer.domElement);
        }
    }

    destroy() {
        super.destroy();
        window.removeEventListener('keypress', this.handleKeyPress);
    }

}
