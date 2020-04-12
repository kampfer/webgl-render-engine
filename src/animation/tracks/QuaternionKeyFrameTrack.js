import KeyFrameTrack from './KeyFrameTrack';
import QuaternionLinearInterpolant from '../../math/interpolants/QuaternionLinearInterpolant';

export default class QuaternionKeyFrameTrack extends KeyFrameTrack {

    createLinearInterpolant() {
        return new QuaternionLinearInterpolant(this.times, this.values, this.getValueSize());
    }

}