#include './chunks/colorHead.vert'

attribute vec4 position;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {

    #include './chunks/colorMain.vert'

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * position;

}