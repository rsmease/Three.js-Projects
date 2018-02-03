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

const step = 0;

const controls = new function () {
    this.rotationSpeed = 0.02;
    this.numberOfObjects = scene.children.length;

    this.removePlanet = function () {
        const allChildren = scene.children;
        const lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
            scene.remove(lastObject);
            this.numberOfObjects = scene.children.length;
        }
    };

    this.xPosition = 0;

    this.addPlanet = function () {

        const planetSize = Math.ceil((Math.random() * 3));
        const planetGeometry = new THREE.SphereGeometry(planetSize, 10, 10);
        const planetMaterial = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.castShadow = true;
        planet.name = "planet-" + scene.children.length;


        // position the planet randomly in the scene

        planet.position.x = Math.random() * (window.innerHeight / 10 + -window.innerHeight / 20) + -window.innerHeight / 20;
        planet.position.y = 0;
        planet.position.z = 0;

        // add the planet to the scene
        scene.add(planet);
        this.numberOfObjects = scene.children.length;
    };

    this.outputObjects = function () {
        console.log(scene.children);
    };
};

//GUI
const gui = new dat.GUI();
gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'xPosition', -window.innerHeight / 20, window.innerHeight / 10);
gui.add(controls, 'addPlanet');
gui.add(controls, 'removePlanet');
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
        if (e instanceof THREE.Mesh) {
            e.rotation.x += controls.rotationSpeed;
            e.rotation.y += controls.rotationSpeed;
            e.rotation.z += controls.rotationSpeed;
            e.position.x = controls.xPosition;
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