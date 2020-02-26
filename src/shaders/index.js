import baseVertGLSL from './base.vert';
import baseFragGLSL from './base.frag';
import pointsVertGLSL from './pointsVertGLSL';
import pointsFragGLSL from './pointsFragGLSL';
import lineVertGLSL from './line.vert';
import lineFragGLSL from './line.frag';

export default {
    base: {
        vertexShader: baseVertGLSL,
        fragmentShader: baseFragGLSL,
    },
    points: {
        vertexShader: pointsVertGLSL,
        fragmentShader: pointsFragGLSL,
    },
    line: {
        vertexShader: lineVertGLSL,
        fragmentShader: lineFragGLSL,
    }
};