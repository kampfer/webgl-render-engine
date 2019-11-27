export default `
attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;
uniform mat4 u_MVPMatrix;
void main() {
    gl_Position = u_MVPMatrix * a_Position;
    gl_PointSize = 5.0;
    v_Color = a_Color;
}
`;