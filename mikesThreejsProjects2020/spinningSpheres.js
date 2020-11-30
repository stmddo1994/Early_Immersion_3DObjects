/*******
 * spinningSpheres.js
 * Project:
 *      (1) Vary some of the constants in randomSphere() and createRotatingObjects().
 *      (2) Replace the sphere geometry by a different geometry.
 *          such as new THREE.CylinderGeometry(radius, radius, height, 12).
 ******/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let theObjects = [];

function randomSphere(args) {
    args = args || {}
    const minRad = 'minRad' in args ? args.minRad : 1.0;
    const maxRad = 'maxRad' in args ? args.maxRad : 1.0;
    const minHeight = 'minHeight' in args ? args.minHeight : 0.2;
    const maxHeight = 'maxHeight' in args ? args.maxHeight : 1.0;
    const minOpacity = 'minOpacity' in args ? args.minOpacity : 0.1;
    const maxOpacity = 'maxOpacity' in args ? args.maxOpacity : 1.0;
    const yjiggle = 'yjiggle' in args ? args.yjiggle : 1.0;
    radius = getRandomFloat(minRad, maxRad);
    height = getRandomFloat(minHeight, maxHeight);
    opacity = getRandomFloat(minOpacity, maxOpacity);
    color = getRandomColor();
    let geom = new THREE.SphereGeometry(radius, 16, 16);
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
    return {object: parent, rate: rate, axis: getRandomPointOnSphere(), angle: 0.0};
}

function createRotatingObjects(n, args) {
    // rate is seconds per revolution; eg. rate==2 means a revolution every 2 seconds
    // offset is horizontal distance from vertical y axis
    const minRate = 'minRate' in args ? args.minRate : 4.0
    const maxRate = 'maxRate' in args ? args.maxRate : 10.0
    const minOffset = 'minOffset' in args ? args.minOffset : 1.0
    const maxOffset = 'maxOffset' in args ? args.maxOffset : 5.0
    for (let i = 0; i < n; i++) {
        offset = getRandomFloat(minOffset, maxOffset);
        rate = getRandomFloat(minRate, maxRate);
        cylinder = randomSphere(args);
        object = rotatingObject(cylinder, offset, rate);
        theObjects.push(object);
        scene.add(object.object);
    }
}


function createScene() {
    var n = 400;
    var args = {minRate: 4, maxRate: 10, minOffset: 5.0, maxOffset: 5.0, minRad: 0.5, maxRad: 0.5, yjiggle: 0.4};
    createRotatingObjects(n, args);

    // light
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000 );
    light.position.set(0, 0, 10);
    var light2 = new THREE.PointLight(0xFFFFFF, 1, 1000 );
    light2.position.set(0, 10, 0);
    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
}



//******************

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function render() {
    var delta = clock.getDelta();
    for (var i = 0; i < theObjects.length; i++) {
        var theObject = theObjects[i];
        var object = theObject.object;
        var rate = theObject.rate;
        // rate is number of seconds per revolution
        var curAngle = theObject.angle + (2 * Math.PI * delta / rate);
        if (curAngle >= 2*Math.PI)
            curAngle -= 2*Math.PI;
        theObject.angle = curAngle;
        object.setRotationFromAxisAngle(theObject.axis, curAngle);
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


function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}



init();
createScene();
addToDOM();
animate();
