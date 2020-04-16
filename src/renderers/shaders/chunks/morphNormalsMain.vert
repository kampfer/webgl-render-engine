// morphTargetBaseInfluence和transformed的算法由Geometry.morphTargetsRelative决定：
// 当morphTargetsRelative等于false时: position + (morphTarget - position) * morphTargetInfluences，此时morphTargetBaseInfluence等于1 - sum(morphTargetInfluences)
// 等morphTargetsRelative等于true时: position + morphTarget * morphTargetInfluences，此时morphTargetBaseInfluence等于sum(morphTargetInfluences)

#ifdef USE_MORPHNORMALS

    objectNormal *= morphTargetBaseInfluence;
    objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
    objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
    objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
    objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];

#endif