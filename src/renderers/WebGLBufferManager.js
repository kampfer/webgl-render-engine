/*
 * 负责管理buffer
 * three.js: WebGLAttributes
 * weakMap: [attribue instance] = buffer
 */

export default class WebGLBufferManager {

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
        let buffer = this.get(attribute);
        if (buffer) {
            this._gl.deleteBuffer(buffer);
            this._buffers.delete(attribute);
        }
    }

    update() { }

    destroy() {
        this._gl = null;
        // weakmap没有clear方法，也无法遍历，这里先粗暴的赋值为null
        this._buffers = null;
    }

}