import GraphObject from './GraphObject';
import { OBJECT_TYPE_MESH } from '../constants';

export default class Mesh extends GraphObject {

    constructor(geometry, material) {
        super();

        this.geometry = geometry;
        this.material = material;
        this.type = OBJECT_TYPE_MESH;

        this.updateMorphTargetInfluences();
    }

    clone(recursive) {
        return new this.constructor(this.geometry, this.material).copy(this, recursive);
    }

    updateMorphTargets() {

        let geometry = this.geometry,
            material = this.material,
            morphTargets = material.morphTargets && geometry.getMorphAttribute('position'),
            morphNormals = material.morphNormals && geometry.getMorphAttribute('normal'),
            morphTargetInfluences = this.morphTargetInfluences,
            morphInfluencesSum = 0;

        for(let i = 0; i < 8; i++) {

            let influence = morphTargetInfluences[i];

            if (influence) {

                if (morphTargets) geometry.setAttribute(`morphTarget${i}`, morphTargets[i]);
                if (morphNormals) geometry.setAttribute(`morphNormal${i}`, morphNormals[i]);

                morphInfluencesSum += influence;

            }

        }

        this.morphTargetBaseInfluence = geometry.morphTargetsRelative ? 1 : 1 - morphInfluencesSum;

    }

    updateMorphTargetInfluences() {

        let geometry = this.geometry,
            morphAttributes = geometry.getMorphAttributes(),
            keys = Object.keys(morphAttributes);

        if (keys.length > 0) {

            let morphAttributeName = keys[0],
                morphAttribute = morphAttributes[morphAttributeName];

            if (morphAttribute !== undefined) {

                this.morphTargetInfluences = [];

                for(let i = 0, l = morphAttribute.length; i < l; i++) {

                    // threejs将所有权重初始化为0，gltf文档支持非0值。
                    // threejs这么做可能是因为morph targets动画一般是从0开始的，设置非0值会引起权重突变，导致画面跳动？
                    this.morphTargetInfluences.push(0);

                }

            }

        }

    }

}
