import WebGLProgramManager from './WebGLProgramManager';
import WebGLBufferManager from './WebGLBufferManager';
import {
    OBJECT_TYPE_MESH,
    OBJECT_TYPE_LINE,
    OBJECT_TYPE_LINE_SEGMENTS,
    OBJECT_TYPE_LINE_LOOP,
    OBJECT_TYPE_POINTS
} from '../constants';
import WebGLCapabilities from './WebGLCapabilities';
import Color from '../math/Color';

export default class WebGLRenderer {

    constructor({
        canvas = document.createElement('canvas'),
        autoClear = true,
        autoClearColor = true,
        autoClearDepth = true,
        autoClearStencil = true,
        precision
    } = {}) {

        this.domElement = canvas;

        // 清理缓冲的设置
        this.autoClear = autoClear;
        this.autoClearColor = autoClearColor;
        this.autoClearDepth = autoClearDepth;
        this.autoClearStencil = autoClearStencil;

        this._pixelRatio = window.devicePixelRatio;

        this._clearColor = new Color('black');

        let gl = this.getContext(this.domElement);

        let capabilities = new WebGLCapabilities(gl, {
                precision,
            });
        this._capabilities = capabilities;

        this._programManager = new WebGLProgramManager(gl, capabilities);

        this._bufferManager = new WebGLBufferManager(gl);

    }

    getContext() {
        if (this._gl === undefined) {
            let names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"],
                canvas = this.domElement,
                context = null;
            for (let i = 0; i < names.length; i++) {
                try {
                    context = canvas.getContext(names[i]);
                } catch(e) { /**/ }
                if (context) break;
            }
            if (!context) {
                console.error('WebGLRenderer：读取context失败！');
            }
            this._gl = context;
        }
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
                    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
                    // 支持的type有：GL_BYTE, GL_UNSIGNED_BYTE, GL_SHORT, GL_UNSIGNED_SHORT, GL_FLOAT, gl.HALF_FLOAT(WebGL 2 context)
                    gl.vertexAttribPointer(programAttribute, itemSize, type, normalized, stride, offset);
                }

            }
        }
    }

    setUniforms(program, object, camera) {
        let gl = this._gl,
            programUniforms = program.getUniforms();

        programUniforms.eachUniform((uniform) => {
            let value = uniform.calculateValue(object, camera);
            uniform.setValue(gl, value);
        });
    }

    render(scene, camera) {
        let gl = this._gl,
            programManager = this._programManager;

        scene.updateWorldMatrix();

        gl.enable(gl.DEPTH_TEST);

        // 设置清理颜色缓冲区时使用的颜色
        gl.clearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, 1);

        // 清理颜色缓冲区、深度缓冲区、模板缓冲区
        if (this.autoClear) {
            this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil);
        }

        let renderList = this.getRenderList(scene);

        for(let i = 0; i < renderList.length; i++) {
            let object = renderList[i],
                geometry = object.geometry,
                material = object.material,
                index = geometry.getAttribute('index'),
                position = geometry.getAttribute('position');

            if (!index) {
                if (!position || position.count === 0) return;
            } else if (index.count === 0) {
                return;
            }

            let parameters = programManager.getParameters(object),
                programKey = programManager.getProgramKey(parameters),
                programInfo = programManager.getProgram(programKey, parameters),
                program = programInfo.getProgram();

            if (this._currentProgram !== program) {
                this._currentProgram = program;
                gl.useProgram(program);
            }

            // TODO：移入uniform.caculateValue
            // 将以下计算移入caculateValue后，需要保证先计算modelViewMatrix再计算normalMatrix。
            // 但是caculateValue的调用顺序无法保证（webgl并没有规定getActiveUniform读取变量的顺序，这完全取决于编译器的实现）。
            // 最暴力的做法是每次caculateValue都先计算modelViewMatrix再计算normalMatrix，但是这样会造成冗余计算，拖累性能。
            object.modelViewMatrix.multiplyMatrices(camera.inverseWorldMatrix, object.worldMatrix);
            object.normalMatrix.getNormalMatrix(object.modelViewMatrix);

            // TODO：不需要每个循环内都设置一次uniform
            this.setUniforms(programInfo, object, camera);

            // TODO: 每次循环生成要使用的attribute和uniform变量的快照，并与上一次循环的快照进行对比。销毁不再使用的变量，更新发生变化的变量。
            this.setAttributes(programInfo, object);

            if (material.wireframe === true) index = geometry.getWireframeAttribute();

            let drawMode = this.getDrawMode(object);

            if (index) {
                let indexBuffer = this._bufferManager.get(index);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements
                // 支持的type：gl.UNSIGNED_BYTE、gl.UNSIGNED_SHORT、gl.UNSIGNED_INT（OES_element_index_uint）
                gl.drawElements(drawMode, index.count, index.glType, 0);
            } else {
                let count = object.geometry.getAttribute('position').count;
                gl.drawArrays(drawMode, 0, count);
            }
        }
    }

    // 优先级：wireframe > object.drawMode > object.type
    getDrawMode(object) {
        let gl = this._gl,
            type = object.type,
            mode = object.drawMode;
        if (mode === undefined) {
            if (type === OBJECT_TYPE_MESH) {
                mode = gl.TRIANGLES;
            } else if (type === OBJECT_TYPE_LINE) {
                mode = gl.LINE_STRIP;
            } else if (type === OBJECT_TYPE_LINE_SEGMENTS) {
                mode = gl.LINES;
            } else if (type === OBJECT_TYPE_LINE_LOOP) {
                mode = gl.LINE_LOOP;
            } else if (type === OBJECT_TYPE_POINTS) {
                mode = gl.POINTS;
            }
        }
        if (object.material.wireframe) mode = gl.LINES;
        return mode;
    }

    setClearColor(color) {
        this._clearColor = color;
    }

    getRenderList(object) {
        let list = [];

        if (object.visible === true) {
            if (object.geometry && object.material) list.push(object);

            let children = object.children;
            for(let i = 0, l = children.length; i < l; i++) {
                list.push(...this.getRenderList(children[i]));
            }
        }

        return list;
    }

    clear(color = true, depth = true, stencil = true) {
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
