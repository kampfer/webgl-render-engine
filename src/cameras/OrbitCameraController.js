import Vec3 from '../math/Vec3';
import Spherical from '../math/Spherical';

export default class {

    constructor(camera, domElement) {
        this.camera = camera;

        this.domElement = domElement;

        this.spherical = new Spherical();
        this.spherical.setFromCartesianCoords(
            this.camera.position.x,
            this.camera.position.y,
            this.camera.position.z
        )

        this.target = new Vec3(0, 0, 0);

        domElement.addEventListener('mousedown', this, false);
        domElement.addEventListener('mousemove', this, false);
        domElement.addEventListener('mouseup', this, false);
        domElement.addEventListener('mouseout', this, false);
    }

    handleEvent(event) {
        switch(event.type) {
            case 'mousedown':
                this._handleMouseDown(event);
                break;
            case 'mousemove':
                this._handleMouseMove(event);
                break;
            case 'mouseup':
            case 'mouseout':
                this._handleMouseUp(event);
                break;
            default:
                // do nothing
        }
    }

    // 计算光标在画布上的位置
    getMousePosition(event) {
        return [event.clientX, event.clientY];
    }

    _handleMouseDown(event) {
        this._dragging = true;
        this._lastMousePosition = this.getMousePosition(event);
    }

    _handleMouseMove(event) {
        if (!this._dragging) {
            return;
        }

        let mousePosition = this.getMousePosition(event),
            deltaX = mousePosition[0] - this._lastMousePosition[0],
            deltaY = mousePosition[1] - this._lastMousePosition[1],
            deltaTheta = Math.PI * 2 * deltaY / this.domElement.clientHeight,
            deltaPhi = Math.PI * 2 * deltaX / this.domElement.clientWidth;

        // 鼠标下滑，deltaY > 0，theta减小
        // 鼠标右滑，deltaX > 0，phi减小
        this.spherical.theta -= deltaTheta;
        this.spherical.phi -= deltaPhi;

        this.camera.position.setFromSpherical(this.spherical);
        this.camera.lookAt(this.target);

        this._lastMousePosition = mousePosition;
    }

    _handleMouseUp() {
        this._dragging = false;
    }

    destroy() {
        this.domElement.removeEventListener('mousedown', this);
        this.domElement.removeEventListener('mousemove', this);
        this.domElement.removeEventListener('mouseup', this);
        this.domElement.removeEventListener('mouseout', this);
    }

}