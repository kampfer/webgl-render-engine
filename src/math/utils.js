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