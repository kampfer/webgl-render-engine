import * as webglUtils from '../utils/webgl';
import WebGLProgramManager from './WebGLProgramManager';
import WebGLBufferManager from './WebGLBufferManager';

export default class WebGLRenderer {

    constructor() {
        this._canvas = document.createElement('canvas');
        this._pixelRatio = window.devicePixelRatio;
        this._gl = webglUtils.getWebGLContext(this._canvas);
        this.domElement = this._canvas;

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

        this._canvas.width = Math.floor(width * this._pixelRatio);
        this._canvas.height = Math.floor(height * this._pixelRatio);

        if (upateStyle !== false) {
            this._canvas.style.width = width + 'px';
            this._canvas.style.height = height + 'px';
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

    setUniforms(program, object, camera) {
        let gl = this._gl,
            material = object.material,
            programUniforms = program.getUniforms();

        gl.uniformMatrix4fv(programUniforms.modelMatrix, false, object.matrix.elements);
        gl.uniformMatrix4fv(programUniforms.viewMatrix, false, camera.viewMatrix.elements);
        gl.uniformMatrix4fv(programUniforms.projectionMatrix, false, camera.projectionMatrix.elements);

        if (material.color) {
            gl.uniform4fv(programUniforms.color, material.color);
        }
    }

    render(scene, camera) {
        let gl = this._gl;

        gl.clearColor(...this._clearColor);
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let renderList = this.getRenderList(scene);

        for(let i = 0; i < renderList.length; i++) {
            let object = renderList[i];

            let programInfo = this._programManager.getProgram(object),
                program = programInfo.getProgram();
            if (this._currentProgram !== program) {
                this._currentProgram = program;
                gl.useProgram(program);
            }

            object.geometry.update();

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

        if (object.type === 'Mesh') {
            list.push(object);
        }

        let children = object.children;
        for(let i = 0, l = children.length; i < l; i++) {
            list.push(...this.getRenderList(children[i]));
        }

        return list;
    }

}
