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


const step = 0;


//GUI
const gui = new dat.GUI();

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