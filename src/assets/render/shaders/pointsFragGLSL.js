export default `
#ifdef GL_ES
precision mediump float;
#endif
varying vec4 v_Color;
void main() {
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    if (dist < 0.5) {
        gl_FragColor = v_Color;
    } else {
        discard;
    }
}
`;