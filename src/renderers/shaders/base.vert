attribute vec4 position;
attribute vec3 normal;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
varying vec3 vNormal;
void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * position;
    vNormal = normalMatrix * normal;
}