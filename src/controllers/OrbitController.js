import Vec3 from '../math/Vec3';
import Spherical from '../math/Spherical';

export default class {

    constructor(camera, domElement) {
        this.camera = camera;

        this.domElement = domElement;

        this.spherical = new Spherical();

        this.target = new Vec3(0, 0, 0);

        this._deltaTheta = 0;
        this._deltaPhi = 0;

        this._offset = new Vec3();
        this.panSpeed = 1;

        this._scale = 1;

        domElement.addEventListener('mousedown', this, false);
        domElement.addEventListener('mousemove', this, false);
        domElement.addEventListener('mouseup', this, false);
        domElement.addEventListener('mouseout', this, false);
        domElement.addEventListener('wheel', this, false);
        document.addEventListener('keydown', this, false);
        document.addEventListener('keyup', this, false);
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
            case 'wheel':
                this._handleMouseWheel(event);
                break;
            case 'keydown':
                this._handleKeyDown(event);
                break;
            case 'keyup':
                this._handleKeyUp(event);
                break;
            default:
                // do nothing
        }
    }

    // 计算光标在画布上的位置
    getMousePosition(event) {
        return [event.clientX, event.clientY];
    }

    update() {
        let position = this.camera.position;

        // 直接使用position，球坐标是以原点为中心的，而我们期望的是以target为中心计算球坐标
        // 所以这里先计算出向量再转换成球坐标。
        this._offset.copy(position).sub(this.target);

        this.spherical.setFromVector3(this._offset);

        this.spherical.theta += this._deltaTheta;
        this.spherical.phi += this._deltaPhi;
        this.spherical.radius *= this._scale;

        this._offset.setFromSpherical(this.spherical);

        position.copy(this.target).add(this._offset);

        this.camera.lookAt(this.target);

        this.camera.updateWorldMatrix();
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
            deltaY = mousePosition[1] - this._lastMousePosition[1];

        if (this._shiftKeyDown) {
            this.target.x -= deltaX * this.panSpeed;
            this.target.y += deltaY * this.panSpeed;
        } else {
            let deltaTheta = Math.PI * 2 * deltaY / this.domElement.clientHeight,
                deltaPhi = Math.PI * 2 * deltaX / this.domElement.clientWidth;

            // 鼠标下滑，deltaY > 0，theta减小
            // 鼠标右滑，deltaX > 0，phi减小
            this._deltaTheta -= deltaTheta;
            this._deltaPhi -= deltaPhi;
        }

        this.update();

        this._deltaTheta = 0;
        this._deltaPhi = 0;

        this._lastMousePosition = mousePosition;
    }

    _handleMouseUp() {
        this._dragging = false;
    }

    _handleMouseWheel(event) {
        let height = this.domElement.clientHeight;

        // if (event.deltaY > 0) {
        //     scale *= (1 + event.deltaY / height);
        // } else if (event.deltaY < 0) {
        //     scale *= (1 + event.deltaY / height);
        // }
        this._scale *= (1 + event.deltaY / height);

        this.update();

        this._scale = 1;
    }

    _handleKeyDown(event) {
        if (event.shiftKey) {
            this._shiftKeyDown = true;
        }
    }

    _handleKeyUp() {
        this._shiftKeyDown = false;
    }

    destroy() {
        this.domElement.removeEventListener('mousedown', this);
        this.domElement.removeEventListener('mousemove', this);
        this.domElement.removeEventListener('mouseup', this);
        this.domElement.removeEventListener('mouseout', this);
        this.domElement.removeEventListener('wheel', this);
        document.removeEventListener('keydown', this);
        document.removeEventListener('keyup', this);
    }

}