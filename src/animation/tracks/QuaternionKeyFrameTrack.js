import KeyFrameTrack from './KeyFrameTrack';
import QuaternionLinearInterpolant from '../../math/interpolants/QuaternionLinearInterpolant';

export default class QuaternionKeyFrameTrack extends KeyFrameTrack {

    constructor(...args) {
        super(...args);

        // quaternion除了线性插值以外，其他方法都不支持
        this.createStepInterpolant = null;
        this.createCubicSplineInterpolant = null;
    }

    createLinearInterpolant() {
        return new QuaternionLinearInterpolant(this.times, this.values, this.getValueSize());
    }
    
}