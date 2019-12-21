// array(geometry) - type array(attribute) - buffer(webgl buffer) 一份数据三分拷贝，能否精简？

export default class BufferAttribute {

    constructor(
        array,
        target,
        itemSize,
        normalized,
        stride = 0,
        offset = 0
    ) {
        this.name = '';
        this.array = array;
        this.target = target;
        this.itemSize = itemSize;
        this.count = array.length / itemSize;
        this.normalized = normalized;
        this.usage = 'STATIC_DRAW';
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

}