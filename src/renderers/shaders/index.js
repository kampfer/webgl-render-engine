import baseVertGLSL from './base.vert';
import baseFragGLSL from './base.frag';
import pointsVertGLSL from './pointsVertGLSL';
import pointsFragGLSL from './pointsFragGLSL';
import lineVertGLSL from './line.vert';
import lineFragGLSL from './line.frag';

export default {
    base: {
        vertex: baseVertGLSL,
        fragment: baseFragGLSL,
    },
    points: {
        vertex: pointsVertGLSL,
        fragment: pointsFragGLSL,
    },
    line: {
        vertex: lineVertGLSL,
        fragment: lineFragGLSL,
    }
};