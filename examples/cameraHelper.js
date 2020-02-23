import Example from './Example';
import CameraHelper from '../src/helpers/CameraHelper';
import PerspectiveCamera from '../src/camera/PerspectiveCamera';
import OrthgraphicCamera from '../src/camera/OrthgraphicCamera';
import degToRad from '../src/math/utils';

export default class CameraHelperExample extends Example {

    constructor() {
        super();

        let perspectiveCamera = new PerspectiveCamera(degToRad(60), 1, ),
            orthgraphicCamera = new OrthgraphicCamera(),
            perspectiveCameraHelper = new CameraHelper(perspectiveCamera),
            orthgraphicCameraHelper = new CameraHelper(orthgraphicCamera);
    }

}