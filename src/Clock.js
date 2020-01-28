export default class Clock {

    constructor(autoStart = true) {
        this._autoStart = autoStart;
        this._startTime = 0;
        this._prevTime = 0;
        this._elapsedTime = 0;
    }

    now() {
        return (performance || Date).now();
    }

    start() {
        this._startTime = this.now();
        this._prevTime = this._startTime;
        this._elapsedTime = 0;
        this.running = true;
    }

    stop() {
        this.getDeltaTime();
        this.running = false;
    }

    getDeltaTime() {
        let diff = 0;

        if (!this.running && this._autoStart) {
            this.start();
            return diff;
        }

        if (this.running) {
            let newTime = this.now();
            diff = (newTime - this._prevTime) / 1000;
            this._prevTime = newTime;
            this._elapsedTime += diff;
        }

        return diff;
    }

    getElapsedTime() {
        this.getDeltaTime();
        return this._elapsedTime;
    }

}