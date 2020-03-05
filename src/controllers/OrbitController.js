import Vec3 from '../math/Vec3';
import Spherical from '../math/Spherical';
import {
    OBJECT_TYPE_PERSPECTIVE_CAMERA,
    OBJECT_TYPE_ORTHOGRAPHIC_CAMERA,
} from '../constants';

let _v = new Vec3(),
    _offset = new Vec3();

export default class {

    constructor(object, domElement) {
        this.object = object;

        this.domElement = domElement;

        this.spherical = new Spherical();

        this.target = new Vec3(0, 0, 0);

        this.enablePan = true;

        this.panSpeed = 1;

        this._panOffset = new Vec3();
        this._deltaTheta = 0;
        this._deltaPhi = 0;
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
        let position = this.object.position;

        // 直接使用position，球坐标是以原点为中心的，而我们期望的是以target为中心计算球坐标
        // 所以这里先计算出向量再转换成球坐标。
        _offset.copy(position).sub(this.target);

        this.spherical.setFromVector3(_offset);

        this.spherical.theta += this._deltaTheta;
        this.spherical.phi += this._deltaPhi;
        this.spherical.radius *= this._scale;

        _offset.setFromSpherical(this.spherical);

        position.copy(this.target).add(_offset);

        this.object.lookAt(this.target);

        this.object.updateWorldMatrix();
    }

    panLeft(distance) {
        // local matrix
        let matrix = this.object.matrix;
        _v.setFromMatrix4Column(matrix, 0).multiplyScalar(-distance);
        this._panOffset.add(_v);
    }

    panUp(distance) {
        let matrix = this.object.matrix;
        _v.setFromMatrix4Column(matrix, 1).multiplyScalar(distance);
        this._panOffset.add(_v);
    }

    
    // 鼠标右滑，deltaX > 0，phi减小
    rotateLeft(angle) {
        this._deltaPhi -= angle;
    }

    // 鼠标下滑，deltaY > 0，theta减小
    rotateUp(angle) {
        this._deltaTheta -= angle;
    }

    _handleMouseDown(event) {
        this._dragging = true;
        this._lastMousePosition = this.getMousePosition(event);
    }

    _handleMouseMove(event) {
        if (!this._dragging) return;

        let object = this.object,
            domElement = this.domElement,
            clientWidth = domElement.clientWidth,
            clientHeight = domElement.clientHeight,
            mousePosition = this.getMousePosition(event),
            deltaX = mousePosition[0] - this._lastMousePosition[0],
            deltaY = mousePosition[1] - this._lastMousePosition[1];

        if (this.enablePan && this._shiftKeyDown) {

            if (object.type === OBJECT_TYPE_PERSPECTIVE_CAMERA) {

                let position = object.position,
                    targetDistance;

                _offset.copy(position).sub(this.target);

                targetDistance = _offset.length();
                targetDistance *= Math.tan(object.fovy * 0.5);

                this.panLeft(deltaX * (targetDistance / (clientWidth / 2)));
                this.panUp(deltaY * (targetDistance / (clientHeight / 2)));

            } else if (object.type === OBJECT_TYPE_ORTHOGRAPHIC_CAMERA) {

                this.panLeft(deltaX * ((object.right - object.left) / clientWidth));
                this.panUp(deltaY * ((object.top - object.bottom) / clientHeight));

            } else {

                console.warn('object不是camera，不支持pan操作');
                this.enablePan = false;

            }

        } else {

            let deltaTheta = Math.PI * 2 * deltaY / clientHeight,
                deltaPhi = Math.PI * 2 * deltaX / clientWidth;

            this.rotateLeft(deltaPhi);
            this.rotateUp(deltaTheta);

        }

        this.update();

        this._panOffset.set(0, 0, 0);
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