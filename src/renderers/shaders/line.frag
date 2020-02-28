#ifdef USE_COLOR
    varying vec3 vColor;
#endif

uniform vec3 diffuse;

void main() {

    vec4 diffuseColor = vec4(diffuse, 1);

    #ifdef USE_COLOR
        diffuseColor.rgb *= vColor;
    #endif

    gl_FragColor = diffuseColor;

}