import Interpolant from './Interpolant';
import Quaternion from '../Quaternion';

export default class QuaternionLinearInterpolant extends Interpolant {

    _interpolate(i1, t0, t, t1) {
         let yArray = this.yArray,
            stride = this.ySize,
            offset = i1 * stride,
            alpha = (t - t0) / (t1 - t0),
            result = new yArray.constructor(stride);

        Quaternion.slerpFlat(result, 0, yArray, offset - stride, yArray, offset, alpha);

        return result;
    }

}