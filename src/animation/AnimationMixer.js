export default class AnimationMixer {

    constructor() {
        this._time = 0;
        this.timeScale = 1;
    }

    update(deltaTimeInSeconds) {
        // console.log(deltaTime);
        deltaTimeInSeconds *= this.timeScale;

        this._time += deltaTimeInSeconds;

        let time = this._time;
    }

}