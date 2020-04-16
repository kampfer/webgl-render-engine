#include './chunks/colorHead.vert'

/********************* morphTargets head start *********************/

#ifdef USE_MORPHTARGETS

    uniform float morphTargetBaseInfluence;

    attribute vec3 morphTarget0;
    attribute vec3 morphTarget1;
    attribute vec3 morphTarget2;
    attribute vec3 morphTarget3;

    #ifdef USE_MORPHNORMALS

        uniform float morphTargetInfluences[4];

        attribute vec3 morphNormal0;
        attribute vec3 morphNormal1;
        attribute vec3 morphNormal2;
        attribute vec3 morphNormal3;

    #else

        uniform float morphTargetInfluences[8];

        attribute vec3 morphTarget4;
        attribute vec3 morphTarget5;
        attribute vec3 morphTarget6;
        attribute vec3 morphTarget7;

    #endif

#endif

/********************* morphTargets head start *********************/

attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 normal;
uniform mat3 normalMatrix;
varying vec3 vNormal;

void main() {

    #include './chunks/colorMain.vert'

    /********************* normal main start *********************/

    vec3 objectNormal = vec3(normal);

    #ifdef USE_MORPHNORMALS

        objectNormal *= morphTargetBaseInfluence;
        objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
        objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
        objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
        objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];

    #endif

    vec3 transformedNormal = objectNormal;

    transformedNormal = normalMatrix * transformedNormal;

    vNormal = normalize(transformedNormal);

    /********************* normal main end *********************/

    /********************* position main start *********************/

    vec3 transformed = vec3(position);

    /********************* morphTargets main start *********************/

    #ifdef USE_MORPHTARGETS

        transformed *= morphTargetBaseInfluence;
        transformed += morphTarget0 * morphTargetInfluences[0];
        transformed += morphTarget1 * morphTargetInfluences[1];
        transformed += morphTarget2 * morphTargetInfluences[2];
        transformed += morphTarget3 * morphTargetInfluences[3];

        #ifndef USE_MORPHNORMALS

            transformed += morphTarget4 * morphTargetInfluences[4];
            transformed += morphTarget5 * morphTargetInfluences[5];
            transformed += morphTarget6 * morphTargetInfluences[6];
            transformed += morphTarget7 * morphTargetInfluences[7];

        #endif

    #endif

    /********************* morphTargets end start *********************/

    vec4 mvPosition = vec4(transformed, 1.0);

    mvPosition = modelViewMatrix * mvPosition;

    gl_Position = projectionMatrix * mvPosition;

    /********************* position main end *********************/

}