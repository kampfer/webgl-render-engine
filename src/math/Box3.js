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

    setEmpty() {
        this._max.set(-Infinity, -Infinity, -Infinity);
        this._min.set(+Infinity, +Infinity, +Infinity);
        return this;
    }

    isEmpty() {
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    }

    setFromObject(object) {
        this.empty();
        this.expandByObject(object);
        return this;
    }

    expandByObject(object) {
        object.updateRelativeWorldMatrix(false, false);

        let geometry = object.geometry;
        if (geometry) {
            let boundingBox = geometry.getBoundingBox();
            _box.copy(boundingBox);
            _box.applyMatrix4(object.worldMatrix);

            this.expandByPoint(_box.max);
            this.expandByPoint(_box.min);
        }

        let children = this.children;
        for(let i = 0, l = children.length; i < l; i++) {
            this.expandByObject(children[i]);
        }

        return this;
    }

    setFromPoints(points) {
        this.setEmpty();
        for(let i = 0, l = points.length; i < l; i++) {
            this.expandByPoint(points[i]);
        }
        return this;
    }

    expandByPoint(p) {
        this._max.max(p);
        this._min.min(p);
        return this;
    }

    setFromBufferAttribute(attribute) {
        let minX = +Infinity,
            minY = +Infinity,
            minZ = +Infinity,
            maxX = -Infinity,
            maxY = -Infinity,
            maxZ = -Infinity;
        
        for(let i = 0, l = attribute.count; i < l; i++) {
            
            let x = attribute.getX(i),
                y = attribute.getY(i),
                z = attribute.getZ(i);

            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (z < minZ) minZ = z;

            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            if (z > maxZ) maxZ = z;

        }

        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);

        return this;
    }

    // https://github.com/mrdoob/three.js/blob/master/src/math/Box3.js#L205
    // threejs要求转入target参数，为什么？性能原因？
    getSize() {
        let size = new Vec3();
        if (this.isEmpty()) {
            size.set(0, 0, 0);
        } else {
            size.setFromVectorsSum(this._min, this._max).mutiplyScalar(0.5);
        }
        return size;
    }

    getCenter() {
        let center = new Vec3();
        if (this.isEmpty()) {
            center.set(0, 0, 0);
        } else {
            center.setFromVectorsDiff(this._max, this._min);
        }
        return center;
    }

}

let _box = new Box3();