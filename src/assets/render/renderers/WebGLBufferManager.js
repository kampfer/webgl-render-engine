/*
 * 负责管理buffer
 * three.js:
 * weakMap: [attribue instance] = buffer
 */

export default class WebGLAttributeManager {

    constructor(gl) {
        this._gl = gl;
        this._buffers = new WeakMap();
    }

    createBuffer(attribute) {
        let gl = this._gl,
            array = attribute.array,
            usage = attribute.usage,
            bufferType = attribute.isIndex ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER,
            buffer = gl.createBuffer();

        if (usage === undefined) {
            attribute.usage = usage = gl.STATIC_DRAW;
        }

        let type = gl.FLOAT;
        if (array instanceof Float32Array) {
            type = gl.FLOAT;
        } else if (array instanceof Float64Array) {
            console.warn('Unsupported data buffer format: Float64Array.');
        } else if (array instanceof Uint16Array) {
            type = gl.UNSIGNED_SHORT;
        } else if (array instanceof Int16Array) {
            type = gl.SHORT;
        } else if (array instanceof Uint32Array) {
            type = gl.UNSIGNED_INT;
        } else if (array instanceof Int32Array) {
            type = gl.INT;
        } else if (array instanceof Int8Array) {
            type = gl.BYTE;
        } else if (array instanceof Uint8Array) {
            type = gl.UNSIGNED_BYTE;
        }
        attribute.type = type;

        gl.bindBuffer(bufferType, buffer);
        gl.bufferData(bufferType, array, usage);

        return buffer;
    }

    get(attribute) {
        let buffer = this._buffers.get(attribute);
        if (!buffer) {
            buffer = this.createBuffer(attribute);
            this._buffers.set(attribute, buffer);
        }
        return buffer;
    }

    remove(attribute) {
        this.buffer.delete(attribute);
    }

    update() { }

}