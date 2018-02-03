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

//plane
const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: "green",
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

plane.rotation.x = 1.4;

scene.add(plane);

//cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshLambertMaterial({
    color: "blue"
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;


scene.add(cube);

//spotlight
const spotLight = new THREE.SpotLight("white");
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);


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

let step = 0;
const animate = function () {
    displayStats.update();


    cube.rotation.y += 0.01;

    step += 0.04;
    cube.position.x = 2 + (10 * (Math.cos(step)));
    cube.position.y = 2 + (10 * Math.abs(Math.sin(step)));

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();