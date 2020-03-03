import GridHelper from '../src/helpers/GridHelper';
import PerspectiveCamera from '../src/cameras/PerspectiveCamera';
import { degToRad } from '../src/math/utils';
import CameraHelper from '../src/helpers/CameraHelper';
import Example from './Example';

export default class GridHelperExample extends Example {

    constructor() {
        super();

        let camera = new PerspectiveCamera(degToRad(60), window.innerWidth / window.innerHeight, 1, 10),
            cameraHelper = new CameraHelper(camera);
        this.scene.add(cameraHelper);

        let gridHelper = new GridHelper(100, 100, 'red');
        this.scene.add(gridHelper);

    }

}