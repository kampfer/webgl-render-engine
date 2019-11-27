import * as WebGLUtil from './utils/webgl';
import shaders from './shaders';
import Mat4 from './math/mat4';

export default class WebGLRenderer {

    constructor() {
        this._canvas = document.createElement('canvas');
        this._pixelRatio = window.devicePixelRatio;
        this._gl = WebGLUtil.getWebGLContext(this._canvas);
        this._programCache = {};
        this.domElement = this._canvas;
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

    render(scene, camera) {
        let gl = this._gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let MVPMatrix = new Mat4().set(camera.projectionMatrix).multiply(camera.viewMatrix);

        for(let i = 0; i < scene.children.length; i++) {
            let object = scene.children[i];

            let program = this.getWebGLProgam(object);
            if (this._currentProgram !== program) {
                gl.useProgram(program.program);
                this._currentProgram = program;
            }

            gl.uniformMatrix4fv(program.uniforms.uMVPMatrix, false, MVPMatrix.elements);

            gl.vertexAttrib3fv(program.attributes.aColor, object.material.color);

            if (object.type === 'Points') {
                gl.vertexAttrib1f(program.attributes.aPointSize, object.material.pointSize);
            }

            // vertices
            let vertices = new Float32Array(object.geometry.vertices);
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            gl.vertexAttribPointer(program.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.attributes.aPosition);

            if (object.geometry.indices && object.geometry.indices.length > 0) {
                // indices
                let indexBuffer = gl.createBuffer(),
                    indices = object.geometry.indices.length > 256 ? new Uint16Array(object.geometry.indices) : new Uint8Array(object.geometry.indices);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            }

            let count = object.geometry.vertices.length / 3;
            if (object.geometry.indices && object.geometry.indices.length > 0) {
                if (object.type === 'Points') {
                    gl.drawElements(gl.TRIANGLES, object.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
                }
            } else {
                if (object.type === 'Points') {
                    gl.drawArrays(gl.POINTS, 0, count);
                } else if (object.type === 'Line') {
                    gl.drawArrays(gl.LINE_LOOP, 0, count);
                } else if (object.type === 'Plane') {
                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
                }
            }
        }
    }

    getWebGLProgam(graphObject) {
        let gl = this._gl;

        let glslType;
        switch(graphObject.type) {
            case 'Points':
                glslType = 'points';
                break;
            case 'Line':
            case 'Plane':
                glslType = 'base';
                break;
            case 'wireframe':
                glslType = 'wireframe';
                break;
            default:
                throw '不支持的类型';
        }

        let webglProgram = this._programCache[glslType];
        if (!webglProgram) {
            let glsl = shaders[glslType],
                program = WebGLUtil.createProgramBySource(gl, glsl.vertexShader, glsl.fragmentShader);
            this._programCache[glslType] = webglProgram = {
                program,
                attributes: {
                    aPosition: gl.getAttribLocation(program, 'a_Position'),
                    aColor: gl.getAttribLocation(program, 'a_Color')
                },
                uniforms: {
                    uMVPMatrix: gl.getUniformLocation(program, 'u_MVPMatrix')
                }
            };
            if (glslType === 'points') {
                webglProgram.attributes.aPointSize = gl.getAttribLocation(program, 'a_PointSize');
            }
        }

        return webglProgram;
    }

};
