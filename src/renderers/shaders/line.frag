#ifdef GL_ES
precision mediump float;
#endif

uniform vec4 diffuse;

void main() {

    gl_FragColor = diffuse;
}