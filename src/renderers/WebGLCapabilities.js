/* global WebGL2ComputeRenderingContext */

// webgl特性测试：https://webglreport.com/

export default class WebGLCapabilities {

    constructor(gl, extensions, {
        precision = 'highp'
    }) {

        this._gl = gl;

        let isWebGL2 = ( typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext ) ||
        ( typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext );

        this.isWebGL2 = isWebGL2;

        // 精度
        let maxPrecision = this.getMaxPrecision(precision);
        if ( maxPrecision !== precision ) precision = maxPrecision;
        this.precision = precision;

        // vertex shader是否支持纹理
        let maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
            vertexTextures = maxVertexTextures > 0;
        this.vertexTextures = vertexTextures;

        // fragment shader是否支持float texture
        let floatFragmentTextures = isWebGL2 || !!extensions.getExtension('OES_texture_float');
        this.floatFragmentTextures = floatFragmentTextures;

        // vertex shader是否支持float texture
        this.floatVertexTextures = vertexTextures && floatFragmentTextures;

        // https://webglstats.com/webgl2/parameter/MAX_VERTEX_UNIFORM_VECTORS
        this.maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);

        // 纹理单元的最大数量
        this.maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    }

    getMaxPrecision(precision) {

        let gl = this._gl;

        if (precision === 'highp') {
            if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision > 0 &&
                gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision > 0 ) {
                return 'highp';
            }
            precision = 'mediump';
        }

        if (precision === 'mediump') {
            if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision > 0 &&
                gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision > 0 ) {
                return 'mediump';
            }
        }

        return 'lowp';

    }

}