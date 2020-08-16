export default class AnimationMixer {

    constructor(animationClips = []) {

        this._time = 0;
        this.timeScale = 1;

        this._clips = [];
        this._activatedClips = [];

        this._originalStateOfClip = new WeakMap();

        // this._clipStates = new WeakMap();

        for(let i = 0, l = animationClips.length; i < l; i++) {

            let clip = animationClips[i];

            this.addClip(clip);

        }

    }

    addClip(clip) {

        // clip._mixer = this;

        this._clips.push(clip);

        // 初始化一些运行时需要的状态
        // if (!this._clipStates.has(clip)) {
        //     this._clipStates.set(clip, {
        //         iterationCount: 0,
        //         activated: false
        //     });
        // }

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

        // clip._mixer = null;
        clip._activated = false;

        // this._clipStates.delete(clip);

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

    saveOriginalStateOfClip(clip) {

        if (typeof clip === 'string') clip = this.getClipByName(clip);

        let state = this._originalStateOfClip.get(clip);

        if (!state) state = new WeakMap();

        for(let i = 0, l = clip.tracks.length; i < l; i++) {

            let track = clip.tracks[i],
                property = track.property,
                node = track.node,
                v;

            if (property === 'morphTargetInfluences') {
                if (node[property]) v = [...(node[property])];
            } else {
                v = node[property].clone();
            }

            state.set(track, v);

        }

        this._originalStateOfClip.set(clip, state);

    }

    restoreOriginalStateOfClip(clip) {

        let state = this._originalStateOfClip.get(clip);

        if (state) {

            for(let i = 0, l = clip.tracks.length; i < l; i++) {

                let track = clip.tracks[i],
                    property = track.property,
                    node = track.node,
                    v = state.get(track);

                if (property === 'morphTargetInfluences') {
                    if (v) node[property] = [...v];
                } else {
                    node[property].copy(v);
                }

            }

        }

    }

    playClip(clip) {

        if (typeof clip === 'string') clip = this.getClipByName(clip);

        if (!clip._activated) {

            clip._activated = true;

            this._activatedClips.push(clip);

            this.saveOriginalStateOfClip(clip);

        }

    }

    stopClip(clip) {

        if (typeof clip === 'string') clip = this.getClipByName(clip);

        if (clip._activated) {

            clip._activated = false;

            let index = this._activatedClips.indexOf(clip);

            if (index >= 0) {

                this._activatedClips.splice(index, 1);

                this.restoreOriginalStateOfClip(clip);

            }

        }

    }

    stopAllClips() {

        for(let i = 0, l = this._activatedClips.length; i < l; i++) {

            this.stopClip(this._activatedClips[i]);

        }

    }

    update(deltaTimeInSeconds) {
        deltaTimeInSeconds *= this.timeScale;

        this._time += deltaTimeInSeconds;

        const time = this._time;
        const clips = this._activatedClips;

        for(let i = 0, l = clips.length; i < l; i++) {

            const clip = clips[i],
                iterationCount = Math.floor(time / clip.duration),
                // clipState = this._clipStates.get(clip),
                tracks = clip.tracks;

            let clipTime = time - iterationCount * clip.duration;

            if (iterationCount >= clip.iterationCount) clipTime = clip.duration;

            for(let j = 0, jl = tracks.length; j < jl; j++) {

                let track = tracks[j],
                    node = track.node,
                    property = track.property,
                    interpolant = track.interpolant,
                    result = interpolant.evaluate(clipTime);

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

            // clip._mixer = null;
            clip._activated = false;

        }

    }

}