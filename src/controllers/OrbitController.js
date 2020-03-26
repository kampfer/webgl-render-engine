import Vec3 from '../math/Vec3';
import Spherical from '../math/Spherical';
import {
    OBJECT_TYPE_PERSPECTIVE_CAMERA,
    OBJECT_TYPE_ORTHOGRAPHIC_CAMERA,
} from '../constants';

let _offset = new Vec3(),
    _spherical = new Spherical();

export default class {

    constructor(object, domElement) {
        this.object = object;

        this.domElement = domElement;

        this.target = new Vec3(0, 0, 0);

        // TODO: 同时支持平行于屏幕的和垂直于object上方向的pan操作
        this.enablePan = true;
        this.panSpeed = 1;

        this.enableRotate = true;
        this.rotateSpeed = 1;
        // polar angle - 垂直方向 - [0, PI]
        this.minThetaAngle = 0;
        this.maxThetaAngle = Infinity;
        // azimuth angle - 水平方向 - [-PI, pI]
        this.minPhiAngle = -Infinity;
        this.maxPhiAngle = Infinity;

        this.enableZoom = true;
        this.zoomSpeed = 1;
        // 控制正交投影的缩放比例：近平面与object的尺寸比例
        this.minZoom = 0;
        this.maxZoom = Infinity;
        // 控制透视投影的缩放比例：相机与target的距离
        this.minDistance = 0;
        this.maxDistance = Infinity;

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
        _spherical.setFromVector3(_offset);

        _spherical.theta += this._deltaTheta;
        _spherical.theta = Math.max(this.minThetaAngle, Math.min(this.maxThetaAngle, _spherical.theta));

        _spherical.phi += this._deltaPhi;
        _spherical.phi = Math.max(this.minPhiAngle, Math.min(this.maxPhiAngle, _spherical.phi));

        _spherical.radius *= this._scale;
        _spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, _spherical.radius));

        this.target.add(this._panOffset);

        _offset.setFromSpherical(_spherical);
        position.copy(this.target).add(_offset);

        this.object.lookAt(this.target);

        // TODO: renderer.render中如果会调用updateWorldMatrix，这里就不需要再调用
        this.object.updateWorldMatrix();
    }

    // distance 是相机坐标系中的位移
    panLeft(distance) {
        // local matrix
        let matrix = this.object.matrix;
        _offset.setFromMatrix4Column(matrix, 0).multiplyScalar(-distance);
        this._panOffset.add(_offset);
    }

    // distance 是相机坐标系中的位移
    panUp(distance) {
        let matrix = this.object.matrix;
        _offset.setFromMatrix4Column(matrix, 1).multiplyScalar(distance);
        this._panOffset.add(_offset);
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

            deltaX *= this.panSpeed;
            deltaY *= this.panSpeed;

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

            let rotateSpeed = this.rotateSpeed,
                deltaTheta = Math.PI * 2 * deltaY / clientHeight,
                deltaPhi = Math.PI * 2 * deltaX / clientWidth;

            this.rotateLeft(rotateSpeed * deltaPhi);
            this.rotateUp(rotateSpeed * deltaTheta);

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
        if (this.object.type === OBJECT_TYPE_PERSPECTIVE_CAMERA) {
            let scale = this._scale;
            if (event.deltaY > 0) {
                scale /= Math.pow(0.95, this.zoomSpeed);
            } else if (event.deltaY < 0) {
                scale *= Math.pow(0.95, this.zoomSpeed);
            }
            // console.log('persp', scale);
            this._scale = scale;
        } else if (this.object.type === OBJECT_TYPE_ORTHOGRAPHIC_CAMERA) {
            let zoom = this.object.zoom;
            if (event.deltaY > 0) {
                zoom *= Math.pow(0.95, this.zoomSpeed);
            } else if (event.deltaY < 0) {
                zoom /= Math.pow(0.95, this.zoomSpeed);
            }
            this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
            // console.log('ortho', zoom);
            this.object.updateProjectionMatrix();
        }

        this.update();

        this._scale = 1;
    }

    _handleKeyDown(event) {
        if (event.shiftKey && !event.ctrlKey) {
            this._shiftKeyDown = true;
        }
    }

    // firefox: 调用window.prompt()后document没有触发keyup
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