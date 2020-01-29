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
            bufferType = attribute.target,
            buffer = gl.createBuffer();

        if (typeof usage === 'string') {
            attribute.usage = usage = gl[usage];
        }

        if (typeof attribute.glType === 'string') {
            attribute.glType = gl[attribute.glType];
        }

        if (bufferType === undefined) {
            if (attribute.isIndex === true) {
                bufferType = gl.ELEMENT_ARRAY_BUFFER;
            } else {
                bufferType = gl.ARRAY_BUFFER;
            }
            attribute.target = bufferType;
        }

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