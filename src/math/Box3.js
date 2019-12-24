import Vec3 from './Vec3';

export default class Box3 {

    constructor() {
        this._max = new Vec3(-Infinity, -Infinity, -Infinity);
        this._min = new Vec3(+Infinity, +Infinity, +Infinity);
    }

    get max() {
        return this._max;
    }

    get min() {
        return this._min;
    }

    empty() {
        this._max.set(-Infinity, -Infinity, -Infinity);
        this._min.set(+Infinity, +Infinity, +Infinity);
    }

    setFromObject(object) {
        this.empty();
        this.expandByObject(object);
    }

    expandByObject(object) {
        
    }

    setFromPoints(points) {

    }

    expandByPoint(p) {
        this._max.max(p);
        this._min.min(p);
        return this;
    }

}