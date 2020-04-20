import baseVertGLSL from './base.vert';
import baseFragGLSL from './base.frag';
import pointsVertGLSL from './points.vert';
import pointsFragGLSL from './points.frag';
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