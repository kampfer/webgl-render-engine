#include "./chunks/colorHead.frag"

uniform vec3 diffuse;
varying vec3 vNormal;

#ifdef USE_MAP

    uniform sampler2D map;
    varying vec2 vUv;

#endif

void main() {

    vec4 diffuseColor = vec4(diffuse, 1);

    #include "./chunks/colorMain.frag"

    #ifdef USE_MAP

        vec4 texelColor = texture2D(map, vUv);

        diffuseColor *= texelColor;

    #endif

    gl_FragColor = diffuseColor;

}