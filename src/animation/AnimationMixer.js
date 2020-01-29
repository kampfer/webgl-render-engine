export default class AnimationMixer {

    constructor(animationClips) {
        this._time = 0;
        this._clips = animationClips;
        this.timeScale = 1;
    }

    update(deltaTimeInSeconds) {
        deltaTimeInSeconds *= this.timeScale;

        this._time += deltaTimeInSeconds;

        let time = this._time,
            clips = this._clips;

        for(let i = 0, l = clips.length; i < l; i++) {
            let clip = clips[i],
                tracks = clip.tracks;
            for(let j = 0, jl = tracks.length; j < jl; j++) {
                let track = tracks[j],
                    node = track.node,
                    property = track.property,
                    interpolant = track.interpolant;

                time %= clip.duration;

                let result = interpolant.evaluate(time);
                node[property].setFromArray(result);
            }
        }
    }

}