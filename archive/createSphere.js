const THREE = require('three');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xEEEEEE));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// //axes
// const axes = new THREE.AxesHelper(20);
// scene.add(axes);

//plane
const planeGeometry = new THREE.PlaneGeometry(60, 20, 30, 30);
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x76200E,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.x = 15;
plane.position.y = 0;
plane.position.z = 0;

scene.add(plane);

//cube
const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xA9901E,
    wireframe: true
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.x = -4;
cube.position.y = 3;
cube.position.z = 0;

scene.add(cube);

//sphere

const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777ff,
    wireframe: true
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

sphere.position.x = 20;
sphere.position.y = 4;
sphere.position.z = 20;

scene.add(sphere);

//position camera
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 10;
camera.lookAt(scene.position);

const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.03;
    cube.rotation.y += 0.01;
    plane.rotation.x -= -0.005 * Math.PI;

    renderer.render(scene, camera);
};

animate();