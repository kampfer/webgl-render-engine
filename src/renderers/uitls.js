import {
    UNSIGNED_BYTE_TYPE
} from '../constants';

export function convertConstantToGLenum(constant, gl) {

    if ( constant === UNSIGNED_BYTE_TYPE ) return gl.UNSIGNED_BYTE;

}