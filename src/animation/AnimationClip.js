let uid = 0;

export default class AnimationClip {
    
    constructor(name, duration = -1, tracks) {
        this._name = name;
        this._duration = duration;
        this._tracks = tracks;
        this.uuid = ++uid;

        if (this._duration < 0) {
            this.setDurationFromTracks();
        }
    }

    setDurationFromTracks() {
        let tracks = this._tracks,
            duration = 0;

        for(let i = 0, l = tracks.length; i < l; i++) {
            let track = tracks[i];
            duration = Math.max(duration, track.times[track.times.length - 1]);
        }

        this._duration = duration;

        return this;
    }

}