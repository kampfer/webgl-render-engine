import baseVertGLSL from './baseVertGLSL';
import baseFragGLSL from './baseFragGLSL';
import pointsVertGLSL from './pointsVertGLSL';
import pointsFragGLSL from './pointsFragGLSL';

export default {
    base: {
        vertexShader: baseVertGLSL,
        fragmentShader: baseFragGLSL,
    },
    points: {
        vertexShader: pointsVertGLSL,
        fragmentShader: pointsFragGLSL,
    }
};