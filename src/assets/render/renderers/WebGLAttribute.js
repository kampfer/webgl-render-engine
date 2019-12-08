// array(geometry) - type array(attribute) - buffer(webgl buffer) 一份数据三分拷贝，能否精简？

export class BufferAttribute {

    constructor(array, itemSize, normalized) {
        this.name = '';
        this.array = array;
        this.itemSize = itemSize;
        this.count = array.length / itemSize;
        this.normalized = normalized;
        this.usage = undefined;
        this.type = undefined;
        this.bytesPerElement = array.BYTES_PER_ELEMENT;
    }

}

export class Float64BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized) {
        super(new Float64Array(array), itemSize, normalized);
    }

}

export class Float32BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized) {
        super(new Float32Array(array), itemSize, normalized);
    }

}

export class Uint32BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized) {
        super(new Uint32Array(array), itemSize, normalized);
    }

}

export class Int32BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized) {
        super(new Int32Array(array), itemSize, normalized);
    }

}

export class Uint16BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized) {
        super(new Uint16Array(array), itemSize, normalized);
    }

}

export class Int16BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized) {
        super(new Int16Array(array), itemSize, normalized);
    }

}

export class Uint8BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized) {
        super(new Uint8Array(array), itemSize, normalized);
    }

}

export class Int8BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized) {
        super(new Int8Array(array), itemSize, normalized);
    }

}

export class Uint8ClampedBufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized) {
        super(new Uint8ClampedArray(array), itemSize, normalized);
    }

}