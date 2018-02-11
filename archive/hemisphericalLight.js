const THREE = require('three');
const { Stats } = require('./libs/stats');
const { dat } = require('./libs/dat.gui.js');

//scene
const scene = new THREE.Scene();

//fog
scene.fog = new THREE.Fog(0xaaaaaa, 0.01, 200);

//camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(new THREE.Vector3(10, 0, 0));

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color('gray'));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

//textured ground plane material
const textureGrass = THREE.ImageUtils.loadTexture(
  './assets/textures/ground/grasslight-big.jpg'
);
textureGrass.wrapS = THREE.RepeatWrapping;
textureGrass.wrapT = THREE.RepeatWrapping;
textureGrass.repeat.set(4, 4);

// create the ground plane
const planeGeometry = new THREE.PlaneGeometry(100, 100, 20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ map: textureGrass });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;

// add the plane to the scene
scene.add(plane);

// create a cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3333 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;

// position the cube
cube.position.x = -4;
cube.position.y = 3;
cube.position.z = 0;

// add the cube to the scene
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// position the sphere
sphere.position.x = 10;
sphere.position.y = 5;
sphere.position.z = 10;
sphere.castShadow = true;

// add the sphere to the scene
scene.add(sphere);

// add spotlight for the shadows
const spotLight0 = new THREE.SpotLight(0xcccccc);
spotLight0.position.set(-40, 60, -10);
spotLight0.lookAt(plane);
scene.add(spotLight0);

//hermispherical light set-up (not sure how target is used yet)
const target = new THREE.Object3D();
target.position = new THREE.Vector3(5, 0, 0);

const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
hemiLight.position.set(0, 500, 0);
scene.add(hemiLight);

//point light
const pointColor = '#ffffff';
//    var dirLight = new THREE.SpotLight( pointColor);
const dirLight = new THREE.DirectionalLight(pointColor);
dirLight.position.set(30, 10, -50);
dirLight.castShadow = true;
//        dirLight.shadowCameraNear = 0.1;
//        dirLight.shadowCameraFar = 100;
//        dirLight.shadowCameraFov = 50;
dirLight.target = plane;
dirLight.shadowCameraNear = 0.1;
dirLight.shadowCameraFar = 200;
dirLight.shadowCameraLeft = -50;
dirLight.shadowCameraRight = 50;
dirLight.shadowCameraTop = 50;
dirLight.shadowCameraBottom = -50;
dirLight.shadowMapWidth = 2048;
dirLight.shadowMapHeight = 2048;

scene.add(dirLight);

let step = 0;

const controls = new function() {
  this.rotationSpeed = 0.03;
  this.bouncingSpeed = 0.03;

  this.hemisphere = true;
  this.color = 0x00ff00;
  this.skyColor = 0x0000ff;
  this.intensity = 0.6;
}();

const gui = new dat.GUI();

gui.add(controls, 'hemisphere').onChange(function(e) {
  if (!e) {
    hemiLight.intensity = 0;
  } else {
    hemiLight.intensity = controls.intensity;
  }
});
gui.addColor(controls, 'color').onChange(function(e) {
  hemiLight.groundColor = new THREE.Color(e);
});
gui.addColor(controls, 'skyColor').onChange(function(e) {
  hemiLight.color = new THREE.Color(e);
});
gui.add(controls, 'intensity', 0, 5).onChange(function(e) {
  hemiLight.intensity = e;
});

const initStats = function() {
  const currentStats = Stats();

  currentStats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  currentStats.domElement.style.position = 'absolute';
  currentStats.domElement.style.left = '0px';
  currentStats.domElement.style.top = '0px';

  document.getElementById('stats').appendChild(currentStats.domElement);

  return currentStats;
};

//stats
const displayStats = initStats();

const animate = function() {
  displayStats.update();

  // rotate the cube around its axes
  cube.rotation.x += controls.rotationSpeed;
  cube.rotation.y += controls.rotationSpeed;
  cube.rotation.z += controls.rotationSpeed;

  // bounce the sphere up and down
  step += controls.bouncingSpeed;
  sphere.position.x = 20 + 10 * Math.cos(step);
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

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
