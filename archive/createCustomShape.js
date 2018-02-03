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
scene.add(plane);

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

const vertices = [
    new THREE.Vector3(1, 3, 1),
    new THREE.Vector3(1, 3, -1),
    new THREE.Vector3(1, -1, 1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(-1, 3, -1),
    new THREE.Vector3(-1, 3, 1),
    new THREE.Vector3(-1, -1, -1),
    new THREE.Vector3(-1, -1, 1)
];

const faces = [
    new THREE.Face3(0, 2, 1),
    new THREE.Face3(2, 3, 1),
    new THREE.Face3(4, 6, 5),
    new THREE.Face3(6, 7, 5),
    new THREE.Face3(4, 5, 1),
    new THREE.Face3(5, 0, 1),
    new THREE.Face3(7, 6, 2),
    new THREE.Face3(6, 3, 2),
    new THREE.Face3(5, 7, 0),
    new THREE.Face3(7, 2, 0),
    new THREE.Face3(1, 3, 4),
    new THREE.Face3(3, 6, 4),
];

const geometry = new THREE.Geometry();
geometry.vertices = vertices;
geometry.faces = faces;
geometry.computeFaceNormals();

const materials = [
    new THREE.MeshLambertMaterial({
        opacity: 0.6,
        color: 0x44ff44,
        transparent: true
    }),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true
    })
];

const mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
mesh.children.forEach(function (e) {
    e.castShadow = true;
});
//        mesh.children[0].translateX(0.5);
//        mesh.children[0].translateZ(0.5);

scene.add(mesh);

function addControl(x, y, z) {
    const controls = new function () {
        this.x = x;
        this.y = y;
        this.z = z;
    };

    return controls;
}

const controlPoints = [];
controlPoints.push(addControl(3, 5, 3));
controlPoints.push(addControl(3, 5, 0));
controlPoints.push(addControl(3, 0, 3));
controlPoints.push(addControl(3, 0, 0));
controlPoints.push(addControl(0, 5, 0));
controlPoints.push(addControl(0, 5, 3));
controlPoints.push(addControl(0, 0, 0));
controlPoints.push(addControl(0, 0, 3));


//GUI
const gui = new dat.GUI();
gui.add(new function () {
    this.clone = function () {

        const clonedGeometry = mesh.children[0].geometry.clone();
        const materials2 = [
            new THREE.MeshLambertMaterial({
                opacity: 0.6,
                color: 0xff44ff,
                transparent: true
            }),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true
            })

        ];

        const mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry, materials2);
        mesh2.children.forEach(function (e) {
            e.castShadow = true;
        });

        mesh2.translateX(5);
        mesh2.translateZ(5);
        mesh2.name = "clone";
        scene.remove(scene.getObjectByName("clone"));
        scene.add(mesh2);
    };
}, 'clone');

for (var i = 0; i < 8; i++) {
    let f1;
    f1 = gui.addFolder('Vertices ' + (i + 1));
    f1.add(controlPoints[i], 'x', -10, 10);
    f1.add(controlPoints[i], 'y', -10, 10);
    f1.add(controlPoints[i], 'z', -10, 10);

}


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

    var vertices = [];
    for (var i = 0; i < 8; i++) {
        vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
    }

    mesh.children.forEach(function (e) {
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;
        e.geometry.computeFaceNormals();
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