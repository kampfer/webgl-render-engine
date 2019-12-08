export default function normalize(p) {
    let s = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
    return [p[0] / s, p[1] / s, p[2] / s];
}