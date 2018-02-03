const THREE = require('three');
const {
    Stats
} = require('./libs/stats');
const {
    dat
} = require('./libs/dat.gui.js');

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color("gray"));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;

// add the plane to the scene
scene.add(plane);

// position and point the camera to the center of the scene
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

// add subtle ambient lighting
var ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// add spotlight for the shadows
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

const addGeometries = function (context) {
    const geometries = [];

    geometries.push(new THREE.CylinderGeometry(1, 4, 4));
    geometries.push(new THREE.BoxGeometry(2, 2, 2));
    geometries.push(new THREE.SphereGeometry(2));
    geometries.push(new THREE.IcosahedronGeometry(4));

    // var points = [
    //     new THREE.Vector3(2, 2, 2),
    //     new THREE.Vector3(2, 2, -2),
    //     new THREE.Vector3(-2, 2, -2),
    //     new THREE.Vector3(-2, 2, 2),
    //     new THREE.Vector3(2, -2, 2),
    //     new THREE.Vector3(2, -2, -2),
    //     new THREE.Vector3(-2, -2, -2),
    //     new THREE.Vector3(-2, -2, 2)
    // ];
    // geometries.push(new THREE.ConvexGeometry(points));

    const points2 = [];
    const detail = .1;
    const radius = 3;
    for (var angle = 0.0; angle < Math.PI; angle += detail) {
        points2.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    geometries.push(new THREE.LatheGeometry(points2, 12));
    geometries.push(new THREE.OctahedronGeometry(3));
    // geometries.push(new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d, 20, 10));
    geometries.push(new THREE.TetrahedronGeometry(3));
    geometries.push(new THREE.TorusGeometry(3, 1, 10, 10));
    geometries.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

    let j = 0;
    for (var i = 0; i < geometries.length; i++) {
        const cubeMaterial = new THREE.MeshLambertMaterial({
            wireframe: true,
            color: Math.random() * 0xffffff
        });
        const materials = [
            new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff,
                flatShading: true
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true
            })
        ];

        const mesh = THREE.SceneUtils.createMultiMaterialObject(geometries[i], materials);
        mesh.traverse(function (e) {
            e.castShadow = true;
        });

        mesh.position.x = -24 + ((i % 4) * 12);
        mesh.position.y = 4;
        mesh.position.z = -8 + (j * 12);

        if ((i + 1) % 4 == 0) j++;
        scene.add(mesh);
    }



};

addGeometries(scene);

//GUI
var gui = new dat.GUI();


const initStats = function () {

    const currentStats = Stats();

    currentStats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    currentStats.domElement.style.position = 'absolute';
    currentStats.domElement.style.left = '0px';
    currentStats.domElement.style.top = '0px';

    document.getElementById("stats").appendChild(currentStats.domElement);

    return currentStats;
};

//stats
const displayStats = initStats();


const animate = function () {
    displayStats.update();

    // scene.traverse(function (e) {
    //     if (e instanceof THREE.Mesh && e !== plane) {
    //         e.rotation.x += controls.rotationSpeed;
    //         e.rotation.y += controls.rotationSpeed;
    //         e.rotation.z += controls.rotationSpeed;
    //     }
    // });

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, false);