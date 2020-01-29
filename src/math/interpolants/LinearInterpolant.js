import Interpolant from './Interpolant';

export default class LinearInterpolant extends Interpolant {

    _interpolate(i1, t0, t, t1) {
        let yArray = this.yArray,
            stride = this.ySize,
            result = new yArray.constructor(stride),
            offset1 = i1 * stride,
            offset0 = offset1 - stride,
            weight1 = (t - t0) / (t1 - t0),
            weight0 = 1 - weight1;

        for(let i = 0, l = result.length; i < l; i++) {
            result[i] = yArray[offset0 + i] * weight0 + yArray[offset1 + i] * weight1;
        }

        return result;
    }

}