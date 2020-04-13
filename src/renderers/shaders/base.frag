#include "./chunks/colorHead.frag"

uniform vec3 diffuse;
varying vec3 vNormal;

void main() {

    vec4 diffuseColor = vec4(diffuse, 1);

    #include "./chunks/colorMain.frag"

    vec4 lightColor = vec4(1, 1, 1, 1);
    vec3 lightDirection = normalize(vec3(0.5, 3, 4));
    vec4 ambientColor = vec4(0.2, 0.2, 0.2, 1);

    vec3 normal = normalize(vNormal);

    float fDot = max(dot(lightDirection, normal), 0.0);
    vec4 ambient = ambientColor * diffuseColor;
    gl_FragColor = vec4((lightColor * diffuseColor * fDot).xyz + ambient.xyz, diffuseColor.a);

}