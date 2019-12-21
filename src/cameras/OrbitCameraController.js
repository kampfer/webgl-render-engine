import normalize from '../math/normalize';

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

    getOrthCoord(x, y) {
        let vx = x / this.domElement.width * 2 - 1,
            vy = y / this.domElement.height * 2 - 1,
            vz = 0,
            s = vx * vx + vy * vy;

        vy = -vy;

        if (s <= 1) {
            vz = Math.sqrt(1 - s);
        }

        return normalize([vx, vy, vz]);
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
        this._LastX = mousePosition[0];
        this._LastY = mousePosition[1];
    }

    _handleMouseMove(event) {
        if (!this._dragging) {
            return;
        }

        let mousePosition = this.getMousePosition(event),
            oldArcballOrthCoord = this.getOrthCoord(this._LastX, this._LastY),
            oldArcballSpheCoord = this.orthCoordToSpheCoord(oldArcballOrthCoord),
            arcballOrthCoord = this.getOrthCoord(mousePosition[0], mousePosition[1]),
            arcballSpheCoord = this.orthCoordToSpheCoord(arcballOrthCoord);

        this.spheCoord[1] -= arcballSpheCoord[1] - oldArcballSpheCoord[1];
        this.spheCoord[2] -= arcballSpheCoord[2] - oldArcballSpheCoord[2];
        this.camera.position.setFromArray(this.spheCoordToOrthCoord(this.spheCoord));

        this._LastX = mousePosition[0];
        this._LastY = mousePosition[1];
    }

    _handleMouseUp(event) {
        this._dragging = false;
    }

    update() {
        this.camera.lookAt(0, 0, 0);
    }

    destroy() {
        this.domElement.removeEventListener('mousedown', this);
        this.domElement.removeEventListener('mousemove', this);
        this.domElement.removeEventListener('mouseup', this);
    }

}