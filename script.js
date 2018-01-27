const THREE = require('three');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xC0DE91));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

//plane
// const planeGeometry = new THREE.PlaneGeometry(60, 20);
// const planeMaterial = new THREE.MeshLambertMaterial({
//     color: 0x91AEDE
// });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.receiveShadow = true;
// plane.position.x = 15;
// plane.position.y = 0;
// plane.position.z = 0;

// scene.add(plane);

// //cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xA9901E,
    emissive: 0xDED091
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;

cube.position.x = -4;
cube.position.y = 3;
cube.position.z = 0;

scene.add(cube);

//sphere

const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;

sphere.position.x = 20;
sphere.position.y = 4;
sphere.position.z = 2;

scene.add(sphere);

//position camera
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

const spotlight = new THREE.SpotLight(0xffffff);
spotlight.position.set(-40, 60, -10);
spotlight.castShadow = true;
scene.add(spotlight);

const animate = function () {
    requestAnimationFrame(animate);

    sphere.rotation.x += 0.05;
    sphere.rotation.y += 0.05;

    cube.rotation.x += 0.05;
    cube.rotation.y += 0.05;
    spotlight.position.x += 0.5;

    renderer.render(scene, camera);
};

animate();