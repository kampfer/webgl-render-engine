#ifdef USE_COLOR
    varying vec3 vColor;
    attribute vec3 color;
#endif

attribute vec4 position;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {

    #ifdef USE_COLOR
        vColor = color;
    #endif

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * position;

}