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

    copy(box) {
        this._max.copy(box.max);
        this._min.copy(box.min);
        return this;
    }

    isEmpty() {
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    }

    setFromObject(object) {
        this.setEmpty();
        this.expandByObject(object);
        return this;
    }

    expandByObject(object) {
        // 注意：因为在后面会递归的expandByObject子辈，所以这里不需更新子辈的matrix
        // TODO: 参考threejs，这里也没有更新父辈的matrix，是否合适？
        object.updateRelativeWorldMatrix(false, false);

        let geometry = object.geometry;
        // 没有geometry的对象不会被计算，比如：camera
        if (geometry) {
            let boundingBox = geometry.getBoundingBox();
            _box.copy(boundingBox);
            _box.applyMatrix4(object.worldMatrix);

            this.expandByPoint(_box.max);
            this.expandByPoint(_box.min);
        }

        let children = object.children;
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
            size.setFromVectorsDiff(this._max, this._min);
        }
        return size;
    }

    getCenter() {
        let center = new Vec3();
        if (this.isEmpty()) {
            center.set(0, 0, 0);
        } else {
            center.setFromVectorsSum(this._min, this._max).multiplyScalar(0.5);
        }
        return center;
    }

    applyMatrix4(matrix) {
        if (!this.isEmpty()) {
            // 分别从max和min中取出component组合成新的点，求这些点中的最大值，是简单的组合问题：C^1_2 * C^1_2 * C^1_2 = 8
            _points[ 0 ].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
            _points[ 1 ].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
            _points[ 2 ].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
            _points[ 3 ].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
            _points[ 4 ].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
            _points[ 5 ].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
            _points[ 6 ].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
            _points[ 7 ].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 111

            this.setFromPoints(_points);
        }

        return this;
    }

}

let _box = new Box3(),
    _points = [
        new Vec3(),
        new Vec3(),
        new Vec3(),
        new Vec3(),
        new Vec3(),
        new Vec3(),
        new Vec3(),
        new Vec3()
    ];
