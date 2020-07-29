#include './chunks/colorHead.vert'

#ifdef USE_MAP

    attribute vec2 uv;
    varying vec2 vUv;

#endif

attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {

    #include './chunks/colorMain.vert'

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mvPosition;

    #ifdef USE_MAP

        vUv = uv;

    #endif

}
