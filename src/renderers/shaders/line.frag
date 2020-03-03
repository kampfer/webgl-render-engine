#include "./chunks/colorHead.frag"

uniform vec3 diffuse;

void main() {

    vec4 diffuseColor = vec4(diffuse, 1);

    #include "./chunks/colorMain.frag"

    gl_FragColor = diffuseColor;

}