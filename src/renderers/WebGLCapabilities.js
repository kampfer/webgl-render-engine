export default class WebGLCapabilities {

    constructor(gl, {
        precision = 'highp'
    }) {

        this._gl = gl;

        let isWebGL2 = ( typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext ) ||
        ( typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext );

        this.isWebGL2 = isWebGL2;

        let maxPrecision = this.getMaxPrecision(precision);

        if ( maxPrecision !== precision ) {
            precision = maxPrecision;
        }

        this.precision = precision;

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