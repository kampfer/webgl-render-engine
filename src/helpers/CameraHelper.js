import LineSegments from '../objects/LineSegments';
import BufferAttribute from '../renderers/BufferAttribute';
import Camera from '../cameras/Camera';
import Vec3 from '../math/Vec3';
import Color from '../math/Color';
import LineBasicMaterial from '../materials/LineBasicMaterial';
import Geometry from '../geometries/Geometry';

let _camera = new Camera(),
    _vec3 = new Vec3();

export default class CameraHelper extends LineSegments {

    constructor(camera) {

        let vertices = [],
            colors = [],
            pointMap = {};

        let colorFrustum = new Color(0xffaa00),
            colorCone = new Color(0xff0000),
            colorUp = new Color(0x00aaff),
            colorTarget = new Color(0xffffff),
            colorCross = new Color(0x333333);

        function addLine(p1, p2, color) {
            addPoint(p1, color);
            addPoint(p2, color);
        }

        function addPoint(p, color) {

            vertices.push(0, 0, 0);
            colors.push(color.r, color.g, color.b);

            if (pointMap[p] === undefined) {
                pointMap[p] = [];
            }

            pointMap[p].push(vertices.length / 3 - 1);

        }

        // 锥体
        addLine('p', 'n1', colorCone);
        addLine('p', 'n2', colorCone);
        addLine('p', 'n3', colorCone);
        addLine('p', 'n4', colorCone);

        // 近平面
        addLine('n1', 'n2', colorFrustum);
        addLine('n2', 'n3', colorFrustum);
        addLine('n3', 'n4', colorFrustum);
        addLine('n4', 'n1', colorFrustum);

        // 远平面
        addLine('f1', 'f2', colorFrustum);
        addLine('f2', 'f3', colorFrustum);
        addLine('f3', 'f4', colorFrustum);
        addLine('f4', 'f1', colorFrustum);

        // 侧平面
        addLine('n1', 'f1', colorFrustum);
        addLine('n2', 'f2', colorFrustum);
        addLine('n3', 'f3', colorFrustum);
        addLine('n4', 'f4', colorFrustum);

        // 上方向
        addLine('u1', 'u2', colorUp);
        addLine('u2', 'u3', colorUp);
        addLine('u3', 'u1', colorUp);

        // 朝向
        addLine('p', 'c', colorTarget);
        addLine('c', 't', colorTarget);

        // cross
        addLine('cn1', 'cn3', colorCross);
        addLine('cn2', 'cn4', colorCross);

        addLine('cf1', 'cf3', colorCross);
        addLine('cf2', 'cf4', colorCross);

        let geometry = new Geometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));

        let material = new LineBasicMaterial({vertexColors: true});

        super(geometry, material);

        this._pointMap = pointMap;

        this._camera = camera;

        // 直接将camera的worldMatrix的引用拷贝到this.matrix，这样对camera的变换会自动同步给camer helper
        this.matrix = camera.worldMatrix;
        this.matrixAutoUpdate = false;

        this.update();

    }

    // 当camera发生变化时需要调用此方法，更新CameraHelper
    update() {

        let position = this.geometry.getAttribute('position'),
            pointMap = this._pointMap;

        function setPoint(point, x, y, z) {

            _vec3.set(x, y, z).unproject(_camera);
        
            let points = pointMap[point];

            if (points && position) {

                for(let i = 0, l = points.length; i < l; i++) {

                    position.setXYZ(points[i], _vec3.x, _vec3.y, _vec3.z);

                }

            }
        }

        // camera的参数更改后需要手动updateProjectionMatrix，这里调用updateProjectionMatrix就能保证参数被更新到projectionMatrix
        this._camera.updateProjectionMatrix();

        // 只需要将顶点从NDC变换到相机坐标系，所以这里只复制相机的逆投影矩阵，不复制相机的逆视图矩阵（即相机的worldMatrix）
        _camera.projectionMatrixInverse.copy(this._camera.projectionMatrixInverse);

        // p的值需要保持为(0,0,0)，unproject反而会导致值得改变，这不是我们想要的结果，所以这里不能调用setPoint
        // setPoint('p', 0, 0, 0);

        setPoint('c', 0, 0, -1);
        setPoint('t', 0, 0, 1);

        setPoint('n1', 1, 1, -1);
        setPoint('n2', -1, 1, -1);
        setPoint('n3', -1, -1, -1);
        setPoint('n4', 1, -1, -1);

        setPoint('f1', 1, 1, 1);
        setPoint('f2', -1, 1, 1);
        setPoint('f3', -1, -1, 1);
        setPoint('f4', 1, -1, 1);

        setPoint('u1', 0.7 * 1, 1.1 * 1, -1);
        setPoint('u2', 0, 2 * 1, -1);
        setPoint('u3', 0.7 * -1, 1.1 * 1, -1);

        setPoint('cn1', 0, 1, -1);
        setPoint('cn2', -1, 0, -1);
        setPoint('cn3', 0, -1, -1);
        setPoint('cn4', 1, 0, -1);

        setPoint('cf1', 0, 1, 1);
        setPoint('cf2', -1, 0, 1);
        setPoint('cf3', 0, -1, 1);
        setPoint('cf4', 1, 0, 1);

        // 通知renderer更新buffer
        position.needsUpdate = true;

    }

}