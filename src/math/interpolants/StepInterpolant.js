import Interpolant from './Interpolant';

export default class StepInterpolant extends Interpolant {

    _interpolate(i1/*, t0, t, t1*/) {
        let yArray = this.yArray,
            stride = this.ySize,
            result = new yArray.constructor(stride),
            offset = i1 - 1;

        for(let i = 0, l = result.length; i < l; i++) {
            result[i] = yArray[offset + i];
        }

        return result;
    }

}