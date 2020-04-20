import WebGLProgram from './WebGLProgram';
import {
    MATERIAL_TYPE_BASIC,
    MATERIAL_TYPE_LINE_BASIC,
    OBJECT_TYPE_SKINNED_MESH,
} from '../constants';

const shaderTypes = {
    [MATERIAL_TYPE_BASIC]: 'base',
    [MATERIAL_TYPE_LINE_BASIC]: 'line',
};

export default class WebGLProgramManager {

    constructor(gl, capabilities) {
        this._gl = gl;
        this._capabilities = capabilities;
        this._programs = {};
    }

    getMaxBones(object) {

        let capabilities = this._capabilities;

        // shader对uniform变量的数量有限制，并且旧式浏览器数量限制的较低，
        // 这导致可以用来存储骨骼信息（mat4）的uniform变量数量有限。
        // 替代方案是：使用float texture替代uniform变量来存储信息。
        // 详细解释见：https://webglfundamentals.org/webgl/lessons/webgl-skinning.html
        if (capabilities.floatVertexTextures) {

            return 1024;

        } else {

            // 不支持float texture时，需要根据shader对uniform变量的数量限制，动态计算支持的最大骨骼数量。

            let skeleton = object.skeleton,
                bones = skeleton.bones,
                maxVertexUniforms = capabilities.maxVertexUniforms,
                // maxVertexUniforms表示vec4的最大数量：https://webglstats.com/webgl2/parameter/MAX_VERTEX_UNIFORM_VECTORS
                // 1 * bone = 1 * mat4 = 4 * vec4
                // 这里给其他uniform变量留出20个vec4的空间。
                maxBones = Math.floor((maxVertexUniforms - 20) / 4);

            maxBones = Math.min(maxBones, bones.length);

            if (maxBones < bones.length) {
                console.warn(`对象包含${bones.length}个骨骼，但是此浏览器仅支持使用最多${maxBones}个骨骼。`);
                return 0;
            }

            return maxBones;

        }

    }

    getParameters(object) {

        let capabilities = this._capabilities,
            material = object.material,
            materialType = material.type,
            shaderType = shaderTypes[materialType],
            precision = capabilities.precision,
            isWebGL2 = capabilities.isWebGL2,
            maxBones = object.type === OBJECT_TYPE_SKINNED_MESH ? this.getMaxBones(object) : 0;

        if (material.precision !== null) {
            let precision = capabilities.getMaxPrecision(material.precision);
            if (precision !== material.precision) {
                console.warn(`不支持material.precision = ${material.precision}，将使用${precision}`);
            }
        }

        return {
            shaderType,
            isWebGL2,
            vertexColors: material.vertexColors,
            morphTargets: material.morphTargets,
            morphNormals: material.morphNormals,
            skinning: material.skinning && maxBones > 0,
            precision,
            maxBones,
        };

    }

    // 使用部分参数来合成key
    getProgramKey(parameters) {

        let key = [
            parameters.shaderType,
            parameters.precision,
            parameters.vertexColors,
            parameters.morphTargets,
            parameters.morphNormals,
            parameters.maxBones,
            parameters.skinning,
        ];

        return key.join();

    }

    // 使用key作为缓存的键，当配置参数相同时key相同，此时就能复用program
    getProgram(key, parameters) {
        let gl = this._gl,
            program = this._programs[key];

        if (!program) {
            this._programs[key] = program = new WebGLProgram(gl, parameters);
        }

        return program;
    }

    releaseProgram(key) {
        let program = this._programs[key];
        if (program) {
            program.destroy();
            this._programs.delete(key);
        }
    }

    destroy() {
        this._gl = null;
        for(let key in this._programs) {
            this.releaseProgram(key);
        }
        this._programs = null;
    }

}