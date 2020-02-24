// array(geometry) - type array(attribute) - buffer(webgl buffer) 一份数据三分拷贝，能否精简？

export default class BufferAttribute {

    constructor(
        array,
        itemSize,
        normalized = false,
        stride = 0,
        offset = 0,
        target,
        usage = 'STATIC_DRAW'
    ) {
        this.name = undefined;
        this.array = array;
        this.target = target;
        this.itemSize = itemSize;
        this.count = array.length / itemSize;
        this.normalized = normalized;
        this.usage = usage;
        this.glType = this.getGLType(array);
        this.bytesPerElement = array.BYTES_PER_ELEMENT;
        this.offset = offset;
        this.stride = stride;
    }

    getGLType(array) {
        let type;
        if (array instanceof Float32Array) {
            type = 'FLOAT';
        } else if (array instanceof Float64Array) {
            console.warn('Unsupported data buffer format: Float64Array.');
        } else if (array instanceof Uint16Array) {
            type = 'UNSIGNED_SHORT';
        } else if (array instanceof Int16Array) {
            type = 'SHORT';
        } else if (array instanceof Uint32Array) {
            type = 'UNSIGNED_INT';
        } else if (array instanceof Int32Array) {
            type = 'INT';
        } else if (array instanceof Int8Array) {
            type = 'BYTE';
        } else if (array instanceof Uint8Array) {
            type = 'UNSIGNED_BYTE';
        }
        return type;
    }

    getX(i) {
        return this.array[this.itemSize * i];
    }

    getY(i) {
        return this.array[this.itemSize * i + 1];
    }

    getZ(i) {
        return this.array[this.itemSize * i + 2];
    }

    getW(i) {
        return this.array[this.itemSize * i + 3];
    }

    setXYZ(i, x, y, z) {
        let index = this.itemSize * i;

        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;

        return this;
    }

}