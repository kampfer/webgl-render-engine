/* global test, expect */

const webglRenderEngine = require('../build/webglRenderEngine.min');
const {
    degToRad,
    radToDeg,
    clamp,
    arrayMax,
    generateUid
} = webglRenderEngine.mathUtils;

test('degToRad(30) === PI / 6', () => {
    expect(degToRad(30)).toBe(Math.PI / 6);
});

test('radToDeg(PI / 2) === 90', () => {
    expect(radToDeg(Math.PI / 2)).toBe(90);
});

test('clamp(1, 2, 3) === 2', () => {
    expect(clamp(1, 2, 3)).toBe(2);
});

test('clamp(4, 2, 3) === 3', () => {
    expect(clamp(4, 2, 3)).toBe(3);
});

test('arrayMax equals Math.max', () => {
    let arr = [1, 2, 3, 4];
    expect(arrayMax(arr)).toBe(Math.max(...arr));
});

test('generateUid() !== generateUid()', () => {
    expect(generateUid()).not.toBe(generateUid());
});