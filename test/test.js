const webglRenderEngine = require('../build/webglRenderEngine.min');

const { degToRad } = webglRenderEngine.mathUtils;

test('convert 180 degrees to PI', () => {
    expect(degToRad(180)).toBe(Math.PI);
});