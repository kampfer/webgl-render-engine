/************ Array Setter start ************/

function setValue1fv(gl, v) {
    gl.uniform1fv(this._addr, v);
}

function setValue2fv(gl, v) {
    gl.uniform2fv(this._addr, v);
}

function setValue3fv(gl, v) {
    gl.uniform3fv(this._addr, v);
}

function setValue4fv(gl, v) {
    gl.uniform4fv(this._addr, v);
}

function setValueMatrix2fv(gl, v) {
    gl.uniformMatrix2fv(this._addr, false, v);
}

function setValueMatrix3fv(gl, v) {
    gl.uniformMatrix3fv(this._addr, false, v);
}

function setValueMatrix4fv(gl, v) {
    gl.uniformMatrix4fv(this._addr, false, v);
}

function setValue1iv(gl, v) {
    gl.uniform1iv(this._addr, v);
}

function setValue2iv(gl, v) {
    gl.uniform2iv(this._addr, v);
}

function setValue3iv(gl, v) {
    gl.uniform3iv(this._addr, v);
}

function setValue4iv(gl, v) {
    gl.uniform4iv(this._addr, v);
}

/************ Array Setter end ************/

/************ Singular Setter start ************/

function setValue1f(gl, v) {
    gl.uniform1f(this._addr, v);
}

function setValue2f(gl, v) {
    if (v.x !== undefined) {    // vec2
        gl.uniform2f(this._addr, v.x, v.y);
    } else {    // array
        gl.uniform2fv(this._addr, v);
    }
}

function setValue3f(gl, v) {
    if (v.x !== undefined) {    // vec3
        gl.uniform3f(this._addr, v.x, v.y, v.z);
    } else if (v.r !== undefined) { // color
        gl.uniform3f(this._addr, v.r, v.g, v.b);
    } else {    // array
        gl.uniform3fv(this._addr, v);
    }
}

function setValue4f(gl, v) {
    if (v.x !== undefined) {    // vec4
        gl.uniform4f(this._addr, v.x, v.y, v.z, v.w);
    } else {    // array
        gl.uniform4fv(this._addr, v);
    }
}

function setValue1i(gl, v) {
    gl.uniform1i(this._addr, v);
}

function setValue2i(gl, v) {
    if (v.x !== undefined) {    // vec2
        gl.uniform2i(this._addr, v.x, v.y);
    } else {    // array
        gl.uniform2iv(this._addr, v);
    }
}

function setValue3i(gl, v) {
    if (v.x !== undefined) {    // vec3
        gl.uniform3i(this._addr, v.x, v.y, v.z);
    } else if (v.r !== undefined) { // color
        gl.uniform3i(this._addr, v.r, v.g, v.b);
    } else {    // array
        gl.uniform3iv(this._addr, v);
    }
}

function setValue4i(gl, v) {
    if (v.x !== undefined) {    // vec4
        gl.uniform4i(this._addr, v.x, v.y, v.z, v.w);
    } else {    // array
        gl.uniform4iv(this._addr, v);
    }
}

function setValueMatrix2f(gl, v) {

    let elements = v.elements;

    if (elements === undefined) {   // array
        gl.uniformMatrix2fv(this._addr, false, v);
    } else {    // mat2
        gl.uniformMatrix2fv(this._addr, false, elements);
    }

}

function setValueMatrix3f(gl, v) {
    
    let elements = v.elements;

    if (elements === undefined) {   // array
        gl.uniformMatrix3fv(this._addr, false, v);
    } else {    // mat3
        gl.uniformMatrix3fv(this._addr, false, elements);
    }

}

function setValueMatrix4f(gl, v) {
    
    let elements = v.elements;

    if (elements === undefined) {   // array
        gl.uniformMatrix4fv(this._addr, false, v);
    } else {    // mat4
        gl.uniformMatrix4fv(this._addr, false, elements);
    }

}

/************ Singular Setter end ************/

// [WebGL Uniform types](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Constants#Uniform_types)
// [WebGL Data types](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Constants#Data types)
function getSingularSetter(type) {

    switch (type) {

        case 0x1406: return setValue1f; // FLOAT
        case 0x8b50: return setValue2f; // _VEC2
        case 0x8b51: return setValue3f; // _VEC3
        case 0x8b52: return setValue4f; // _VEC4

        case 0x8b5a: return setValueMatrix2f; // _MAT2
        case 0x8b5b: return setValueMatrix3f; // _MAT3
        case 0x8b5c: return setValueMatrix4f; // _MAT4

        case 0x1404: case 0x8b56: return setValue1i; // INT, BOOL
        case 0x8b53: case 0x8b57: return setValue2i; // _VEC2
        case 0x8b54: case 0x8b58: return setValue3i; // _VEC3
        case 0x8b55: case 0x8b59: return setValue4i; // _VEC4

        // 暂时不支持的类型
        // case 0x8b5e: case 0x8d66: return setValueT1; // SAMPLER_2D, SAMPLER_EXTERNAL_OES
        // case 0x8b5f: return setValueT3D1; // SAMPLER_3D
        // case 0x8b60: return setValueT6; // SAMPLER_CUBE
        // case 0x8DC1: return setValueT2DArray1; // SAMPLER_2D_ARRAY

    }

}

// [WebGL Uniform types](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Constants#Uniform_types)
// [WebGL Data types](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Constants#Data types)
function getArraySetter(type) {

    switch (type) {

        case 0x1406: return setValue1fv; // FLOAT
        case 0x8b50: return setValue2fv; // _VEC2
        case 0x8b51: return setValue3fv; // _VEC3
        case 0x8b52: return setValue4fv; // _VEC4

        case 0x8b5a: return setValueMatrix2fv; // _MAT2
        case 0x8b5b: return setValueMatrix3fv; // _MAT3
        case 0x8b5c: return setValueMatrix4fv; // _MAT4

        case 0x1404: case 0x8b56: return setValue1iv; // INT, BOOL
        case 0x8b53: case 0x8b57: return setValue2iv; // _VEC2
        case 0x8b54: case 0x8b58: return setValue3iv; // _VEC3
        case 0x8b55: case 0x8b59: return setValue4iv; // _VEC4

        // 暂时不支持的类型
        // case 0x8b5e: // SAMPLER_2D
        // case 0x8d66: // SAMPLER_EXTERNAL_OES
        // case 0x8dca: // INT_SAMPLER_2D
        // case 0x8dd2: // UNSIGNED_INT_SAMPLER_2D
        // case 0x8b62: // SAMPLER_2D_SHADOW
        //     return setValueT1Array;

        // case 0x8b60: // SAMPLER_CUBE
        // case 0x8dcc: // INT_SAMPLER_CUBE
        // case 0x8dd4: // UNSIGNED_INT_SAMPLER_CUBE
        // case 0x8dc5: // SAMPLER_CUBE_SHADOW
        //     return setValueT6Array;

    }

}

export default class WebGLUnifrom {

    constructor(info, addr) {
        this._info = info;
        this._addr = addr;
    }

    calculateValue(/*object, camera*/) {
        throw('WebGLUnifrom子类没有实现 calculateValue(object, camera) 方法');
    }

    // 所有子类实现的setValue方法必须保持统一：
    // 接受且只接受两个，第一个参数是webgl上下文对象，第二个参数是uniform变量的值
    setValue(/*gl, value*/) {
        throw('WebGLUnifrom子类没有实现 setValue(object, camera) 方法');
    }

}

export class SingleUniform extends WebGLUnifrom {

    constructor(info, addr) {
        super(info, addr);
        this.setValue = getSingularSetter(info.type);
    }

}

export class PureArrayUniform extends WebGLUnifrom {

    constructor(info, addr) {
        super(info, addr);
        this.setValue = getArraySetter(info.type);
    }

}

export class StructuredUniform {

}