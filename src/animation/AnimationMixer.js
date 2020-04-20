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

            time %= clip.duration;

            for(let j = 0, jl = tracks.length; j < jl; j++) {

                let track = tracks[j],
                    node = track.node,
                    property = track.property,
                    interpolant = track.interpolant,
                    result = interpolant.evaluate(time);

                if (result) {

                    if (property === 'morphTargetInfluences') {
                        node[property] = result;
                    } else {
                        node[property].setFromArray(result);
                    }

                }
            }
        }
    }

    destroy() {}

}