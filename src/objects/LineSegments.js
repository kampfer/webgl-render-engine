import GraphObject from '../GraphObject';
import {
    OBJECT_TYPE_LINE_SEGMENTS,
    GL_DRAW_MODE_LINES 
} from '../constants';

export default class LineSegments extends GraphObject {

    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = OBJECT_TYPE_LINE_SEGMENTS;
        this.drawMode = GL_DRAW_MODE_LINES;
    }

}