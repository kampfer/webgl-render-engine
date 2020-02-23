import WebGLRenderer from '../src/renderers/WebGLRenderer';
import Scene from '../src/objects/Scene';
import PerspectiveCamera from '../src/cameras/PerspectiveCamera';
import OrbitController from '../src/controllers/OrbitController';

export default class Example {

    constructor() {
        this.scene = new Scene();

        let renderer = new WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor([1, 1, 1, 1]);
        document.body.appendChild(renderer.domElement);
        this.renderer = renderer;
        
        let camera = new PerspectiveCamera(60 * Math.PI / 180, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.lookAt(0, 0, 0);
        camera.position.set(0, 0, 10);
        camera.updateWorldMatrix();
        this.camera = camera;

        this.cameraController = new OrbitController(camera, renderer.domElement);

        this.animate = this.animate.bind(this);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        this._animationTimer = requestAnimationFrame(this.animate);
        this.render();
    }

    run() {
        this.animate();
    }

    destroy() {
        this.cameraController.destroy();
        cancelAnimationFrame(this._animationTimer);
    }

}