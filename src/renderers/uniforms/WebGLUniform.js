function setValue1fv(gl, addr, v) {
    gl.uniform1fv(addr, v);
}

function setValue2fv(gl, addr, v) {
    gl.uniform2fv(addr, v);
}

function setValue3fv(gl, addr, v) {
    gl.uniform3fv(addr, v);
}

function setValue4fv(gl, addr, v) {
    gl.uniform4fv(addr, v);
}

function setValueMatrix2fv(gl, addr, v) {
    gl.uniformMatrix2fv(addr, false, v);
}

function setValueMatrix3fv(gl, addr, v) {
    gl.uniformMatrix3fv(addr, false, v);
}

function setValueMatrix4fv(gl, addr, v) {
    gl.uniformMatrix4fv(addr, false, v);
}

function setValue1iv(gl, addr, v) {
    gl.uniform1iv(addr, v);
}

function setValue2iv(gl, addr, v) {
    gl.uniform2iv(addr, v);
}

function setValue3iv(gl, addr, v) {
    gl.uniform3iv(addr, v);
}

function setValue4iv(gl, addr, v) {
    gl.uniform4iv(addr, v);
}

function getArraySetter(type) {

    switch ( type ) {

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

    setValue(gl, value) {
        let addr = this._addr,
            setter = getArraySetter(this._info.type);
        setter.call(this, gl, addr, value);
    }

    calculateValue(/*object, camera*/) {
        throw('子类没有实现方法: WebGLUnifrom.calculateValue(object, camera)');
    }

}