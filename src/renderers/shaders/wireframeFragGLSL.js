export default `
attribute a_Position;
attribute a_Barycentric;
attribute vec3 a_Color;
uniform mat4 u_MVPMatrix;
varying vec3 v_Color;
varying vec3 v_Barycentric;

void main () {
    gl_Position = u_MVPMatrix * a_Position;
    v_Color = a_Color;
    v_Barycentric = a_Barycentric;
}
`;