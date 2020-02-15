import * as webglUtils from '../utils/webgl';
import WebGLProgramManager from './WebGLProgramManager';
import WebGLBufferManager from './WebGLBufferManager';
import { ObjectType } from '../constants';

let mat4Array = new Float32Array(16),
    mat3Array = new Float32Array(9);

export default class WebGLRenderer {

    constructor(opts = {
        canvas: document.createElement('canvas'),
        autoClearColor: true,
        autoClearDepth: true,
        autoClearStencil: true
    }) {

        this.domElement = opts.canvas;

        // 清理缓冲的设置
        this.autoClearColor = opts.autoClearColor;
        this.autoClearDepth = opts.autoClearDepth;
        this.autoClearStencil = opts.autoClearStencil;

        this._pixelRatio = window.devicePixelRatio;

        this._gl = webglUtils.getWebGLContext(this.domElement);

        this._clearColor = [0, 0, 0, 1];

        this._programManager = new WebGLProgramManager(this._gl);
        this._bufferManager = new WebGLBufferManager(this._gl);

    }

    getContext() {
        return this._gl;
    }

    setSize(width, height, upateStyle) {
        this._width = width;
        this._height = height;

        this.domElement.width = Math.floor(width * this._pixelRatio);
        this.domElement.height = Math.floor(height * this._pixelRatio);

        if (upateStyle !== false) {
            this.domElement.style.width = width + 'px';
            this.domElement.style.height = height + 'px';
        }

        this.setViewport(0, 0, width, height);
    }

    setViewport(x, y, width, height) {
        this._gl.viewport(x, y, width, height);
    }

    // TODO 每次初始化完成后需要禁用不再使用的attribute
    setAttributes(program, object) {
        let gl = this._gl,
            programAttributes = program.getAttributes(),    // name - addr
            geometryAttributes = object.geometry.getAttributes();   // name - buffer

        for(let name in programAttributes) {

            let programAttribute = programAttributes[name];

            if (programAttribute >= 0) {

                let geometryAttribute = geometryAttributes[name];

                if (geometryAttribute) {
                    let buffer = this._bufferManager.get(geometryAttribute),
                        itemSize = geometryAttribute.itemSize,
                        type = geometryAttribute.glType,
                        target = geometryAttribute.target,
                        normalized = geometryAttribute.normalized,
                        stride = geometryAttribute.stride,
                        offset = geometryAttribute.offset;

                    gl.enableVertexAttribArray(programAttribute);
                    gl.bindBuffer(target, buffer);
                    gl.vertexAttribPointer(programAttribute, itemSize, type, normalized, stride, offset);
                }

            }
        }
    }

    setUniformM4(addr, transpose, v) {
        mat4Array.set(v.elements);
        this._gl.uniformMatrix4fv(addr, transpose, mat4Array);
    }

    setUniformM3(addr, transpose, v) {
        mat3Array.set(v.elements);
        this._gl.uniformMatrix3fv(addr, transpose, mat3Array);
    }

    setUniforms(program, object, camera) {
        let gl = this._gl,
            material = object.material,
            programUniforms = program.getUniforms();

        this.setUniformM3(programUniforms.normalMatrix, false, object.normalMatrix)

        this.setUniformM4(programUniforms.modelMatrix, false, object.worldMatrix);

        this.setUniformM4(programUniforms.viewMatrix, false, camera.inverseWorldMatrix);

        this.setUniformM4(programUniforms.projectionMatrix, false, camera.projectionMatrix);

        if (material.color) {
            gl.uniform4fv(programUniforms.color, material.color);
        }
    }

    render(scene, camera) {
        let gl = this._gl;

        scene.updateWorldMatrix();

        gl.enable(gl.DEPTH_TEST);

        // 设置清理颜色缓冲区时使用的颜色
        gl.clearColor(...this._clearColor);

        // 清理颜色缓冲区、深度缓冲区、模板缓冲区
        this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil);

        let renderList = this.getRenderList(scene);

        for(let i = 0; i < renderList.length; i++) {
            let object = renderList[i];

            let programInfo = this._programManager.getProgram(object),
                program = programInfo.getProgram();
            if (this._currentProgram !== program) {
                this._currentProgram = program;
                gl.useProgram(program);
            }

            // object.geometry.update();

            object.modelViewMatrix.multiplyMatrices(camera.inverseWorldMatrix, object.worldMatrix);
            object.normalMatrix.getNormalMatrix(object.modelViewMatrix);

            // TODO：不需要每个循环内都设置一次uniform
            this.setUniforms(programInfo, object, camera);

            this.setAttributes(programInfo, object);

            let index = object.geometry.getAttribute('index');
            if (index) {
                let indexBuffer = this._bufferManager.get(index);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            }

            if (index) {
                gl.drawElements(gl.TRIANGLES, index.count, index.glType, 0);
            } else {
                let count = object.geometry.getAttribute('position').count;
                gl.drawArrays(object.drawMode, 0, count);
            }
        }
    }

    setClearColor(color) {
        this._clearColor = color;
    }

    getRenderList(object) {
        let list = [];

        if (object.type === ObjectType.Mesh) {
            list.push(object);
        }

        let children = object.children;
        for(let i = 0, l = children.length; i < l; i++) {
            list.push(...this.getRenderList(children[i]));
        }

        return list;
    }

    clear(color, depth, stencil) {
        let bits = 0, gl = this._gl;

        if (color) bits |= gl.COLOR_BUFFER_BIT;
        if (depth) bits |= gl.DEPTH_BUFFER_BIT;
        if (stencil) bits |= gl.STENCIL_BUFFER_BIT;

        gl.clear(bits);
    }

    destroy() {
        this.domElement = null;
        this._gl = null;
        this._programManager.destroy();
        this._bufferManager.destroy();
    }

}
