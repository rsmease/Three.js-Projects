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
const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;

// add the plane to the scene
// scene.add(plane);

// position and point the camera to the center of the scene
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

// add subtle ambient lighting
const ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// add spotlight for the shadows
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

const material = new THREE.MeshLambertMaterial({
    color: 0x44ff44
});
const geometry = new THREE.BoxGeometry(5, 8, 3);
const cube = new THREE.Mesh(geometry, material);
cube.position.y = 4;
cube.castShadow = true;
scene.add(cube);

const step = 0;

const controls = new function () {
    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleZ = 1;

    this.positionX = 0;
    this.positionY = 0;
    this.positionZ = 0;

    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.scale = 1;

    this.translateX = 0;
    this.translateY = 0;
    this.translateZ = 0;

    this.visible = true;

    this.translate = function () {

        cube.translateX(controls.translateX);
        cube.translateY(controls.translateY);
        cube.translateZ(controls.translateZ);

        controls.positionX = cube.position.x;
        controls.positionY = cube.position.y;
        controls.positionZ = cube.position.z;
    };
};

const gui = new dat.GUI();

const guiScale = gui.addFolder('scale');
guiScale.add(controls, 'scaleX', 0, 5);
guiScale.add(controls, 'scaleY', 0, 5);
guiScale.add(controls, 'scaleZ', 0, 5);

const guiPosition = gui.addFolder('position');
const contX = guiPosition.add(controls, 'positionX', -10, 10);
const contY = guiPosition.add(controls, 'positionY', -4, 20);
const contZ = guiPosition.add(controls, 'positionZ', -10, 10);

contX.listen();
contX.onChange(function (value) {
    cube.position.x = controls.positionX;
});

contY.listen();
contY.onChange(function (value) {
    cube.position.y = controls.positionY;
});

contZ.listen();
contZ.onChange(function (value) {
    cube.position.z = controls.positionZ;
});

const guiRotation = gui.addFolder('rotation');
guiRotation.add(controls, 'rotationX', -4, 4);
guiRotation.add(controls, 'rotationY', -4, 4);
guiRotation.add(controls, 'rotationZ', -4, 4);

const guiTranslate = gui.addFolder('translate');
guiTranslate.add(controls, 'translateX', -10, 10);
guiTranslate.add(controls, 'translateY', -10, 10);
guiTranslate.add(controls, 'translateZ', -10, 10);
guiTranslate.add(controls, 'translate');

gui.add(controls, 'visible');


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

    cube.visible = controls.visible;

    cube.rotation.x = controls.rotationX;
    cube.rotation.y = controls.rotationY;
    cube.rotation.z = controls.rotationZ;

    cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);

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