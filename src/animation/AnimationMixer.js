export default class AnimationMixer {

    constructor(animationClips) {
        this._time = 0;
        this.timeScale = 1;
        this._clips = [];
        this._activatedClips = [];

        for(let i = 0, l = animationClips.length; i < l; i++) {

            let clip = animationClips[i];

            this.addClip(clip);

        }
    }

    addClip(clip) {

        clip._mixer = this;

        this._clips.push(clip);

    }

    removeClip(clip) {

        let index = -1,
            indexAtActivated = -1;

        if (typeof clip === 'string') {

            for(let i = 0, l = this._clips.length; i < l; i++) {

                if (this._clips[i].name === name) {
                    clip = this._clips[i];
                    index = i;
                    break;
                }

            }

            for(let i = 0, l = this._activatedClips.length; i < l; i++) {

                if (this._activatedClips[i].name === name) {
                    indexAtActivated = i;
                    break;
                }

            }

        } else {

            index = this._clips.indexOf(clip);
            indexAtActivated = this._activatedClips.indexOf(clip);

        }

        if (index >= 0) this._clips.splice(index, 1);
        if (indexAtActivated >= 0) this._activatedClips.splice(indexAtActivated, 1);

        clip._mixer = null;
        clip._activated = false;

    }

    getClipByName(name) {

        for(let i = 0, l = this._clips.length; i < l; i++) {

            let clip = this._clips[i];

            if (clip.name === name) return clip;

        }

    }

    isActivatedClip(clipName) {

        let clip = this.getClipByName(clipName);

        return clip._activated;

    }

    playClip(clip) {

        if (typeof clip === 'string') clip = this.getClipByName(clip);

        if (!clip._activated) {

            clip._activated = true;

            this._activatedClips.push(clip);

        }

    }

    stopClip(clip) {

        if (typeof clip === 'string') clip = this.getClipByName(clip);

        if (clip._activated) {

            clip._activated = false;

            let index = this._activatedClips.indexOf(clip);

            if (index >= 0) this._activatedClips.splice(index, 1);

        }

    }

    stopAllClips() {

        for(let i = 0, l = this._activatedClips; i < l; i++) {

            this.stopClip(this._activatedClips[i]);

        }

    }

    update(deltaTimeInSeconds) {
        deltaTimeInSeconds *= this.timeScale;

        this._time += deltaTimeInSeconds;

        let time = this._time,
            clips = this._activatedClips;

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

    destroy() {

        for(let i = 0, l = this._clips.length; i < l; i++) {

            let clip = this._clips[i];

            clip._mixer = null;
            clip._activated = false;

        }

    }

}