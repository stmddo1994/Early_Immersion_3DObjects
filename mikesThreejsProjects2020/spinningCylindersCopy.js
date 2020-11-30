/*******
 * spinningCylinders.js
 * Project:
 *      (1) Vary parameters: number, radii, height, offsets, opacity, yjiggle of cylinders.
 *      (2) Change the cylinders to a different geometry such as sphere or torus.
 ******/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let theObjects = [];

function randomCylinder(args) {
    args = args || {}
    const minRad = 'minRad' in args ? args.minRad : 1.0;
    const maxRad = 'maxRad' in args ? args.maxRad : 1.0;
    const minHeight = 'minHeight' in args ? args.minHeight : 0.2;
    const maxHeight = 'maxHeight' in args ? args.maxHeight : 0.6;
    const minOpacity = 'minOpacity' in args ? args.minOpacity : 0.1;
    const maxOpacity = 'maxOpacity' in args ? args.maxOpacity : 1.0;
    const yjiggle = 'yjiggle' in args ? args.yjiggle : 1.0;
    radius = getRandomFloat(minRad, maxRad);
    height = getRandomFloat(minHeight, maxHeight);
    opacity = getRandomFloat(minOpacity, maxOpacity);
    color = getRandomColor();
    let geom = new THREE.CylinderGeometry(radius, radius, height, 12);
    let mat = new THREE.MeshLambertMaterial({color: color, transparent: true, opacity: opacity});
    let mesh = new THREE.Mesh(geom, mat);
    // vertical offset
    mesh.position.y = getRandomFloat(-yjiggle, yjiggle);
    return mesh;
}


function rotatingObject(object, offset, rate) {
    let parent = new THREE.Object3D();
    object.position.x = offset;
    parent.add(object);
    return {object: parent, rate: rate}
}

function createRotatingCylinders(n, args) {
    // rate is seconds per revolution; eg. rate==2 means a revolution every 2 seconds
    // offset is horizontal distance from vertical y axis
    const minRate = 'minRate' in args ? args.minRate : 4.0
    const maxRate = 'maxRate' in args ? args.maxRate : 10.0
    const minOffset = 'minOffset' in args ? args.minOffset : 1.0
    const maxOffset = 'maxOffset' in args ? args.maxOffset : 5.0
    for (let i = 0; i < n; i++) {
        offset = getRandomFloat(minOffset, maxOffset);
        rate = getRandomFloat(minRate, maxRate);
        cylinder = randomCylinder(args);
        object = rotatingObject(cylinder, offset, rate);
        theObjects.push(object);
        scene.add(object.object);
    }
}


function createScene() {
    let n = 400;
    let args = {minRate: 4, maxRate: 10, minOffset: 2.0, maxOffset: 10.0, minRad: 0.5, yjiggle: 0.4};
    createRotatingCylinders(n, args);

    // light
    let light = new THREE.PointLight(0xFFFFFF, 1, 1000 );
    light.position.set(0, 0, 10);
    let light2 = new THREE.PointLight(0xFFFFFF, 1, 1000 );
    light2.position.set(0, 10, 0);
    let ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
}

//*********************

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function render() {
    var delta = clock.getDelta();
    for (var i = 0; i < theObjects.length; i++) {
        object = theObjects[i].object;
        rate = theObjects[i].rate;
        // rate is number of seconds per revolution
        curAngle = object.rotation.y + (2 * Math.PI * delta / rate);
        if (curAngle >= 2*Math.PI)
            curAngle -= 2*Math.PI;
        object.rotation.y = curAngle;
    }
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);
    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.enableDamping = true; 
    cameraControls.dampingFactor = 0.1;
    window.addEventListener( 'resize', onWindowResize, false );
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}



init();
createScene();
addToDOM();
animate();
