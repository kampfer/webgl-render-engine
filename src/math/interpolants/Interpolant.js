export default class Interpolant {

    constructor(xArray, yArray, ySize) {
        this.xArray = xArray;
        this.yArray = yArray;
        this.ySize = ySize;
    }

    evaluate(t) {
        let xArray = this.xArray,
            i1, t0, t1;

        for(let i = 0, l = xArray.length; i < l; i++) {
            if (t === xArray[i]) {
                if (i === 0) {
                    i1 = i + 1;
                    t0 = xArray[i];
                    t1 = xArray[i1];
                } else {
                    i1 = i;
                    t0 = xArray[i - 1];
                    t1 = xArray[i1];
                }
                break;
            } else if (t > xArray[i] && t < xArray[i + 1]) {
                i1 = i + 1;
                t0 = xArray[i];
                t1 = xArray[i1];
                break;
            }
        }

        return this._interpolate(i1, t0, t, t1);
    }

}