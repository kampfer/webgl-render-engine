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

/********************* morphTargets head end *********************/

/********************* skin head start *********************/

#ifdef USE_SKINNING

    attribute vec4 skinIndex;
    attribute vec4 skinWeight;

    uniform mat4 bindMatrix;
    uniform mat4 bindMatrixInverse;

    #ifdef BONE_TEXTURE

    #else

        uniform mat4 boneMatrices[MAX_BONES];

        // 存储限定符 参数限定符 变量类型 变量名
        mat4 getBoneMatrix(const in float i) {
            mat4 bone = boneMatrices[int(i)];
            return bone;
        }

    #endif

#endif

/********************* skin head end *********************/

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

    #ifdef USE_SKINNING

        mat4 skinMatrix = mat4(0.0);
        skinMatrix += skinWeight.x * boneMatX;
        skinMatrix += skinWeight.y * boneMatY;
        skinMatrix += skinWeight.z * boneMatZ;
        skinMatrix += skinWeight.w * boneMatW;
        skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;

        objectNormal = vec4(skinMatrix * vec4(objectNormal, 0.0)).xyz;

        #ifdef USE_TANGENT

            objectTangent = vec4(skinMatrix * vec4(objectTangent, 0.0)).xyz;

        #endif

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

    /********************* skin main start *********************/

    #ifdef USE_SKINNING

        mat4 boneMatX = getBoneMatrix(skinIndex.x);
        mat4 boneMatY = getBoneMatrix(skinIndex.y);
        mat4 boneMatZ = getBoneMatrix(skinIndex.z);
        mat4 boneMatW = getBoneMatrix(skinIndex.w);

        vec4 skinVertex = bindMatrix * vec4(transformed, 1.0);

        vec4 skinned = vec4(0.0);
        skinned += boneMatX * skinVertex * skinWeight.x;
        skinned += boneMatY * skinVertex * skinWeight.y;
        skinned += boneMatZ * skinVertex * skinWeight.z;
        skinned += boneMatW * skinVertex * skinWeight.w;

        transformed = (bindMatrixInverse * skinned).xyz;

    #endif

    /********************* skin main end *********************/

    vec4 mvPosition = vec4(transformed, 1.0);

    mvPosition = modelViewMatrix * mvPosition;

    gl_Position = projectionMatrix * mvPosition;

    /********************* position main end *********************/

}