const THREE = require('three');
const {
    Stats
} = require('./libs/stats');
const {
    dat
} = require('./libs/dat.gui.js');

//scene
const scene = new THREE.Scene();
scene.overrideMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
});

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


var step = 0;

const controls = new function () {
    this.rotationSpeed = 0.02;
    this.numberOfObjects = scene.children.length;

    this.removeCube = function () {
        const allChildren = scene.children;
        const lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
            scene.remove(lastObject);
            this.numberOfObjects = scene.children.length;
        }
    };

    this.addCube = function () {

        var cubeSize = Math.ceil((Math.random() * 3));
        var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
        });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = "cube-" + scene.children.length;


        // position the cube randomly in the scene

        cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
        cube.position.y = Math.round((Math.random() * 5));
        cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

        // add the cube to the scene
        scene.add(cube);
        this.numberOfObjects = scene.children.length;
    };

    this.outputObjects = function () {
        console.log(scene.children);
    };
};

//GUI
var gui = new dat.GUI();
gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'addCube');
gui.add(controls, 'removeCube');
gui.add(controls, 'outputObjects');
gui.add(controls, 'numberOfObjects').listen();


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

    scene.traverse(function (e) {
        if (e instanceof THREE.Mesh && e !== plane) {
            e.rotation.x += controls.rotationSpeed;
            e.rotation.y += controls.rotationSpeed;
            e.rotation.z += controls.rotationSpeed;
        }
    });

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