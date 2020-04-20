// morphTargetBaseInfluence和transformed的算法由Geometry.morphTargetsRelative决定：
// 当morphTargetsRelative等于false时: position + (morphTarget - position) * morphTargetInfluences，此时morphTargetBaseInfluence等于1 - sum(morphTargetInfluences)
// 等morphTargetsRelative等于true时: position + morphTarget * morphTargetInfluences，此时morphTargetBaseInfluence等于sum(morphTargetInfluences)

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