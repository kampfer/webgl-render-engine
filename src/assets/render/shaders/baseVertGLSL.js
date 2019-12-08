export default `
attribute vec4 position;
attribute vec4 color;
varying vec4 v_Color;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * position;
    v_Color = color;
}
`;