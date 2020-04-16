#include './chunks/colorHead.vert'

attribute vec4 position;
// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {

    #include './chunks/colorMain.vert'

    gl_Position = projectionMatrix * modelViewMatrix * position;

}