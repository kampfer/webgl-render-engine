import Example from './Example';
import SkinnedMesh from '../src/objects/SkinnedMesh';
import Skeleton from '../src/objects/Skeleton';
import Bone from '../src/objects/Bone';
import BoxGeometry from '../src/geometries/BoxGeometry';
import Material from '../src/materials/Material';
import Mat4 from '../src/math/Mat4';
import BufferAttribute from '../src/renderers/BufferAttribute';
import GridHelper from '../src/helpers/GridHelper';

// https://webglfundamentals.org/webgl/lessons/webgl-skinning.html
export default class SkinnedMeshExample extends Example {

    constructor() {

        super();

        let bone = new Bone(), 
            bones = [bone],
            skeleton = new Skeleton(bones),
            geometry = new BoxGeometry(1, 1, 1),
            material = new Material(),
            mesh = new SkinnedMesh(geometry, material),
            count = geometry.getAttribute('position').count,
            skinIndex = new BufferAttribute(new Float32Array(count * 4), 4),
            skinWeight = new BufferAttribute(new Float32Array(count * 4), 4),
            bindMatrix = new Mat4();

        geometry.setAttribute('skinIndex', skinIndex);
        geometry.setAttribute('skinWeight', skinWeight);

        for(let i = 0, l = count; i < l; i++) {

            skinIndex.setXYZW(i, 0, 0, 0, 0);
            skinWeight.setXYZW(i, 1, 0, 0, 0);

        }

        // bindMatrix.translate(0, 0, 2);

        mesh.position.x = 2;
        // mesh.rotation.set(0, 0.5, 0);

        // bone.position.z = 1;

        mesh.bind(skeleton, bindMatrix);

        mesh.bindMode = SkinnedMesh.DETACHED_MODE;

        this.mesh = mesh;
        this.bone = bone;

        this.gridHelper = new GridHelper(100, 100);

        this.renderer.autoClear = false;

    }

    update() {

        let bone = this.bone;

        bone.rotation.y += 0.05;
        // bone.rotation.y = 3;
        // bone没有加入节点的阶层结构，所以需要手动更新
        bone.updateWorldMatrix();

    }

    render() {

        this.renderer.clear();
        this.renderer.render(this.gridHelper, this.camera);
        this.renderer.render(this.mesh, this.camera);

    }

}
