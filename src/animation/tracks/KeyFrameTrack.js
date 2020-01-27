export default class KeyFrameTrack {

    constructor(name, times, values, interpolation) {
        if (name === undefined) {
            throw new Error('KeyFrameTrack: name为空');
        }

        if (times === undefined || times.length <= 0) {
            throw new Error('KeyFrameTrack: times为空');
        }

        this.name = name;

        this.times = times;

        this.values = values;

        this.setInterpolation(interpolation);
    }

    getValueSize() {
        return this.values.length / this.times.length;
    }

    setInterpolation(interpolation) {
        this.createInterpolant  = interpolation;
    }
    
}