import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import Stats from './stats.js';
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    //document.body.appendChild(stats.dom)
THREE.Cache.enabled = true;
const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000),
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("bg"),
        alpha: true
    });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
camera.position.setZ(4);

// lighting and helpers
const pointLight = new THREE.PointLight(0xfefddc, 1),
    ambientLight = new THREE.AmbientLight(0xffffff, 0),
    lightHelper = new THREE.PointLightHelper(pointLight),
    gridHelper = new THREE.GridHelper(800, 50)
pointLight.position.set(0, 2, 3)
const sky = new THREE.Mesh(
    new THREE.SphereGeometry(300, 4, 4),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
);
sky.material.side = THREE.DoubleSide;
let sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 3, 2),
    new THREE.MeshStandardMaterial({ color: 0x380209 })
);


let wireframe = new THREE.WireframeGeometry(sphere.geometry);
let line = new THREE.LineSegments(wireframe);
line.material.depthTest = false;
line.material.opacity = 0.25;
line.material.transparent = true;

scene.add(line);
let controls = new OrbitControls(camera, renderer.domElement)

scene.add(pointLight, ambientLight, /*lightHelper, gridHelper,*/ sphere)
let curvature = 6,
    direction = "out",
    click = 0;
document.addEventListener("mousedown", () => {
    click = .201;
    curvature = 30;
    //setTimeout(() => {
    //}, 100)
})
document.addEventListener("mouseup", () => {

    click = 0;
})
let animate = () => {
    controls.update();
    stats.begin();
    if (curvature >= 10) {
        direction = "in";
    }
    if (curvature <= 5) {
        direction = "out"
    }
    if (curvature < 10 && direction == "out") {
        curvature += 0.1;
    } else if (curvature > 5 && direction == "in") {
        curvature -= 0.1
    }
    scene.remove(sphere, line);
    sphere = new THREE.Mesh(
        new THREE.SphereGeometry((curvature / 200) + 1.8 + click, curvature + 3, curvature + 2),
        new THREE.MeshStandardMaterial({ color: 0x380209, metalness: .4, roughness: .6 })
    );
    sphere.rotation.y = 45;
    sphere.rotation.x += curvature;

    wireframe = new THREE.WireframeGeometry(sphere.geometry);
    line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    scene.add(sphere, line);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.end();
}
animate();