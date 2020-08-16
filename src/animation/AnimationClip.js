import { generateUid } from '../math/utils';

// clip和track只用来保存动画相关的配置和数据，不应该包含任何与实现动画相关的逻辑。
// TODO：将isActivated方法已到mixer中
export default class AnimationClip {
    
    constructor(name, duration = -1, tracks) {

        this.name = name;
        this.tracks = tracks;
        this.uid = generateUid();

        // 一些常用动画配置
        // 参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation
        this.duration = duration;
        // this.delay = 0;
        // this.direction = 'normal';
        // this.fillMode = 'none';
        this.iterationCount = Infinity;

        // this._mixer = null;
        this._activated = false;

        if (this.duration < 0) {
            this.setDurationFromTracks();
        }

    }

    isActivated() {
        return this._activated;
    }

    setDurationFromTracks() {
        let tracks = this.tracks,
            duration = 0;

        for(let i = 0, l = tracks.length; i < l; i++) {
            let track = tracks[i];
            duration = Math.max(duration, track.times[track.times.length - 1]);
        }

        this.duration = duration;

        return this;
    }

}