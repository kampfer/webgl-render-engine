import {
    LinearInterpolation,
    StepInterpolation,
    CubicSplineInterpolation
} from '../../constants';
import LinearInterpolant from '../../math/interpolants/LinearInterpolant';
import StepInterpolant from '../../math/interpolants/StepInterpolant';
import CubicSplineInterpolant from '../../math/interpolants/CubicSplineInterpolant';

export default class KeyFrameTrack {

    constructor(node, property, times, values, interpolation) {
        this.node = node;
        this.property = property;
        this.times = times;
        this.values = values;

        this.setInterpolant(interpolation);
    }

    getValueSize() {
        return this.values.length / this.times.length;
    }

    setInterpolant(interpolation) {
        if (interpolation === LinearInterpolation) {
            this.interpolant = new LinearInterpolant(this.times, this.values, this.getValueSize());
        } else if (interpolation === StepInterpolation) {
            this.interpolant = new StepInterpolant(this.times, this.values, this.getValueSize());
        } else if (interpolation === CubicSplineInterpolation) {
            this.interpolant = new CubicSplineInterpolant(this.times, this.values, this.getValueSize());
        }
    }
    
}