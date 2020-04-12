import Interpolant from './Interpolant';

export default class CubicSplineInterpolant extends Interpolant {

    // https://github.com/kampfer/KBM/blob/master/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9B%BE%E5%BD%A2%E5%AD%A6/Hermite%E6%9B%B2%E7%BA%BF.md
    _interpolate(i1, t0, t, t1) {

        let xArray = this.xArray,
            yArray = this.yArray,
            stride = this.ySize,
            result = new yArray.constructor(stride),
            iPrev = i1 - 2,
            iNext = i1 + 1,
            tPrev = xArray[iPrev],
            tNext = xArray[iNext];

        if (tPrev === undefined) {
            iPrev = i1;
            tPrev = t1;
        }

        if (tNext === undefined) {
            iNext = i1 - 1;
            tNext = t0;
        }

        let p = (t - t0) / (t1 - t0),
            pp = p * p,
            ppp = pp * p,
            sp = (t0 - t1) / (t0 - tPrev) * 0.5,
            sn = (t0 - t1) / (tNext - t1) * 0.5,
            s0 = -(ppp - 2 * pp + p) * sp,
            s1 = (1 + sp) * ppp + (-1.5 - 2 * sp) * pp + (-0.5 + sp) * p + 1,
            s2 = (-1 - sn) * ppp + (1.5 + sn) * pp + 0.5 * p,
            s3 = sn * ppp - sn * pp,
            o0 = iPrev * stride,
            o2 = i1 * stride,
            o1 = o2 - stride,
            o3 = iNext * stride;

        for(let i = 0; i < stride; i++) {
            result[i] = s0 * yArray[o0 + i] + s1 * yArray[o1 + i] + s2 * yArray[o2 + i] + s3 * yArray[o3 + i];
        }

        return result;

    }

}