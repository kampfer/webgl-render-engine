import {
    UNSIGNED_BYTE_TYPE,
    FLOAT_TYPE,
    RGBA_FORMAT,
} from '../constants';

export function convertConstantToGLenum(constant, gl) {

    if (constant === UNSIGNED_BYTE_TYPE) return gl.UNSIGNED_BYTE;
    if (constant === FLOAT_TYPE) return gl.FLOAT;

    if (constant === RGBA_FORMAT) return gl.RGBA;

}