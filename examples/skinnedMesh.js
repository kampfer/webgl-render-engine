import Example from './Example';
import SkinnedMesh from '../src/objects/SkinnedMesh';
import Skeleton from '../src/objects/Skeleton';
import Bone from '../src/objects/Bone';
import BoxGeometry from '../src/geometries/BoxGeometry';
import Material from '../src/materials/Material';

// https://webglfundamentals.org/webgl/lessons/webgl-skinning.html
export default class SkinnedMeshExample extends Example {

    constructor() {

        super({ useOrbit: false });

        let bone = new Bone(),
            bones = [bone],
            skeleton = new Skeleton(bones),
            geometry = new BoxGeometry(1, 1, 1),
            material = new Material(),
            mesh = new SkinnedMesh(geometry, material);

        mesh.bind(skeleton);

        // 将bone加入GraphObject的阶层结构，每次render时才能自动更新worldMatrix
        // 否则需要手动调用updateWorldMatrix方法
        mesh.add(bone);

        this.scene.add(mesh);

        this.renderer.autoClear = false;

    }

    update() {

        let mesh = this.scene.children[0],
            bone = mesh.skeleton.bones[0];

        bone.rotation.x += 0.01;

    }

    render() {

        let mesh = this.scene.children[0];

        this.renderer.clear();

        mesh.position.x = 0;
        mesh.rotation.z = 0;

        this.renderer.render(mesh, this.camera);

        mesh.position.x = 1;
        mesh.rotation.z = Math.PI / 3;

        this.renderer.render(mesh, this.camera);

    }

}
