import {
    LinearInterpolation,
    StepInterpolation,
    CubicSplineInterpolation
} from '../../constants';
import LinearInterpolant from '../../math/interpolants/LinearInterpolant';
import StepInterpolant from '../../math/interpolants/StepInterpolant';
import CubicSplineInterpolant from '../../math/interpolants/CubicSplineInterpolant';

export default class KeyFrameTrack {

    constructor(node, property, times, values, interpolation = LinearInterpolation) {
        this.node = node;
        this.property = property;
        this.name = node.name + '.' + property;
        this.times = times;
        this.values = values;

        this.setInterpolant(interpolation);
    }

    getValueSize() {
        return this.values.length / this.times.length;
    }

    createLinearInterpolant() {
        return new LinearInterpolant(this.times, this.values, this.getValueSize());
    }

    createStepInterpolant() {
        return new StepInterpolant(this.times, this.values, this.getValueSize());
    }

    createCubicSplineInterpolant() {
        return new CubicSplineInterpolant(this.times, this.values, this.getValueSize());
    }

    // 子类可以通过覆盖此方法实现自定义的插值方法
    // createInterpolant() {}

    // 优先使用自定义的createInterpolant方法 
    setInterpolant(interpolation) {
        if (this.createInterpolant === undefined) {
            let factoryMethod;
            if (interpolation === LinearInterpolation) {
                factoryMethod = this.createLinearInterpolant;
            } else if (interpolation === StepInterpolation) {
                factoryMethod = this.createStepInterpolant;
            } else if (interpolation === CubicSplineInterpolation) {
                factoryMethod = this.createCubicSplineInterpolant;
            }
            this.createInterpolant = factoryMethod;
        }
        
        this.interpolant = this.createInterpolant();
    }
    
}