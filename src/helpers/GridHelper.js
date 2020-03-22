import LineSegments from '../objects/LineSegments';
import BufferAttribute from '../renderers/BufferAttribute';
import Geometry from '../geometries/Geometry';
import LineBasicMaterial from '../materials/LineBasicMaterial';
import Color from '../math/Color';

export default class GridHelper extends LineSegments {

    constructor(size, divisions, color='#ccc', colorX = '#ff3352', colorZ = '#2890ff') {

        let halfSize = size / 2,
            step = size / divisions,
            vertices = [],
            colors = [],
            center = divisions / 2;

        color = new Color(color);
        colorX = new Color(colorX);
        colorZ = new Color(colorZ);

        for(let i = 0, k = -halfSize; i <= divisions; i++, k += step) {

            // x轴方向
            vertices.push(-halfSize, 0, k, halfSize, 0, k);
            if (i === center) {
                colorX.toArray(colors, colors.length);
                colorX.toArray(colors, colors.length);
            } else {
                color.toArray(colors, colors.length);
                color.toArray(colors, colors.length);
            }

            // z轴方向
            vertices.push(k, 0, -halfSize, k, 0, halfSize);
            if (i === center) {
                colorZ.toArray(colors, colors.length);
                colorZ.toArray(colors, colors.length);
            } else {
                color.toArray(colors, colors.length);
                color.toArray(colors, colors.length);
            }
        }

        let geometry = new Geometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));

        let material = new LineBasicMaterial({ vertexColors: true });

        super(geometry, material);

    }

}