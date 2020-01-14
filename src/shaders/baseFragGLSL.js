export default `
#ifdef GL_ES
precision mediump float;
#endif
uniform vec4 color;
varying vec3 vNormal;
void main() {
    vec4 lightColor = vec4(1, 1, 1, 1);
    vec3 lightDirection = normalize(vec3(0.5, 3, 4));
    vec4 ambientColor = vec4(0.2, 0.2, 0.2, 1);
    vec3 normal = normalize(vNormal);
    float fDot = max(dot(lightDirection, normal), 0.0);
    vec4 ambient = ambientColor * color;
    gl_FragColor = vec4((lightColor * color * fDot).xyz + ambient.xyz, color.a);
}
`;