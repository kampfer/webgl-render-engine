const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

export function degToRad( degrees ) {
    return degrees * DEG2RAD;
}

export function radToDeg(radians) {
    return radians * RAD2DEG;
}

export function arrayMax(array) {
    if (array.length === 0) return -Infinity;

    let max = array[0];

    for(let i = 1, l = array.length; i < l; i++) {
        if (array[i] > max) max = array[i];
    }

    return max;
}

let _uid = 0;

export function generateUid() {
    return _uid++;
}

export function isPowerOfTwo(value) {
    // `&`的优先级低于`===`
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
    return (value & (value - 1)) === 0 && value !== 0;
}

export function floorPowerOfTwo(value) {
    return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
}

export function ceilPowerOfTwo(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}