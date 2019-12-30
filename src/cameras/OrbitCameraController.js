// https://en.wikibooks.org/wiki/OpenGL_Programming/Modern_OpenGL_Tutorial_Arcball

import Vec3 from '../math/Vec3';

function degreeToRadian(degree) {
    return degree / 180 * Math.PI;
}

function radianToDegree(radian) {
    return radian * 180 / Math.PI;
}

export default class {

    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.spheCoord = this.orthCoordToSpheCoord([
            this.camera.position.x,
            this.camera.position.y,
            this.camera.position.z
        ]);

        this._domElementRect = domElement.getBoundingClientRect();

        domElement.addEventListener('mousedown', this, false);
        domElement.addEventListener('mousemove', this, false);
        domElement.addEventListener('mouseup', this, false);
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
                this._handleMouseUp(event);
                break;
            default:
                // do nothing
        }
    }

    // 计算光标在画布上的位置
    getMousePosition(event) {
        return [
            event.clientX - this._domElementRect.left,
            event.clientY - this._domElementRect.top
        ];
    }

    getArchBallVector([x, y]) {
        let w = this.domElement.width,
            h = this.domElement.height,
            v = new Vec3(2 * x / w - 1, 1 - 2 * y / h), // x、y归一化，并且y的值要取反
            sq = v.x * v.x + v.y * v.y;

        if (sq <= 1) {
            v.z = Math.sqrt(1 - sq);
        } else {
            v.normalize();
        }

        return v;
    }

    // https://en.wikipedia.org/wiki/Spherical_coordinate_system
    // wiki上的坐标系与webgl坐标系不同，需要注意；另外角度的取值范围也必须对应；
    // t 与y轴正方向的夹角  [0, PI]
    // p xoz平面的投影与z轴正方向的夹角 [0, 2 * PI)
    orthCoordToSpheCoord([x, y, z]) {
        let r = Math.sqrt(x * x + y * y + z * z),
            t = Math.acos(y / r),
            p = Math.atan(x / z);
        if (z === 0) {
            if (x > 0) {
                p = Math.PI / 2;
            } else if (x < 0) {
                p = -Math.PI / 2;
            } else {
                p = 0;
            }
        } else {
            if (x >= 0 && z > 0) {
                // do nothing
            } else if (x < 0 && z > 0) {
                p += Math.PI * 2;
            } else if (x >= 0 && z < 0) {
                p += Math.PI;
            } else if (x < 0 && z < 0) {
                p += Math.PI;
            }
        }
        return [r, radianToDegree(t), radianToDegree(p)];
    }

    // https://zh.wikipedia.org/wiki/球座標系
    // wiki上的坐标系与webgl坐标系不同，需要注意
    // t 与y轴正方向的夹角
    // p xoz平面的投影与z轴正方向的夹角
    spheCoordToOrthCoord([r, t, p]) {
        t = degreeToRadian(t);
        p = degreeToRadian(p);
        return [
            r * Math.sin(t) * Math.sin(p),
            r * Math.cos(t),
            r * Math.sin(t) * Math.cos(p),
        ];
    }

    _handleMouseDown(event) {
        this._dragging = true;
        let mousePosition = this.getMousePosition(event);
        this._lastMousePosition = mousePosition;
    }

    _handleMouseMove(event) {
        if (!this._dragging) {
            return;
        }

        let mousePosition = this.getMousePosition(event),
            va = this.getArchBallVector(this._lastMousePosition),
            vb = this.getArchBallVector(mousePosition),
            angle = Math.acos(va.dot(vb)),
            axis = va.cross(vb);

        this.camera.rotateOnAxis(angle, axis);

        this._lastMousePosition = mousePosition;
    }

    _handleMouseUp() {
        this._dragging = false;
    }

    destroy() {
        this.domElement.removeEventListener('mousedown', this);
        this.domElement.removeEventListener('mousemove', this);
        this.domElement.removeEventListener('mouseup', this);
    }

}