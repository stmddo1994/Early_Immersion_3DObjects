/***********
 * cubeMatrix.js
 * Project:
 *      (1) Vary the number of cubes in each dimension.
 *      (2) Vary the distance between neighboring cubes.
 *      (3) Replace the boxes by a different geometry. For example:
 *          new THREE.TorusKnotGeometry(1.0, 0.25, 100, 16, 4, 3)
 *          new THREE.TorusGeometry(1.0, 0.5, 16, 16)
 *          new THREE.IcosahedronGeometry(1.0) -- for this add
 *          this property: shading: THREE.FlatShading to 
 *          the call to MeshLambertMaterial()
 *          Vary the arguments passed to these geometry functions.
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let mat;

// m x n x r matrix of boxes with center offset
function cubeMatrix(m, n, r, offset) {
    let boxes = new THREE.Object3D();
    let side = 1.0;
    offset = offset !== undefined ? offset : 2.0;
    let geom = new THREE.CubeGeometry(side, side, side);
    mat = new THREE.MeshLambertMaterial({transparent: true});
    let xMin = -offset * ((m-1) / 2.0);
    let yMin = -offset * ((n-1) / 2.0);
    let zMin = -offset * ((r-1) / 2.0);
    for (let i = 0, x = xMin; i < m; i++, x += offset) {
        for (let j = 0, y = yMin; j < n; j++, y += offset) {
            for (let k = 0, z = zMin; k < r; k++, z += offset) {
                let box = new THREE.Mesh(geom, mat)
                box.position.x = x;
                box.position.y = y;
                box.position.z = z;
                boxes.add(box);
            }
        }
    }
    return boxes;
}


function createScene() {
    var m = 9;
    var n = 9;
    var r = 9;
    var offset = 2.0;
    boxes = cubeMatrix(m, n, r, offset);
    scene.add(boxes);

    // light
    let light = new THREE.PointLight(0xFFFFFF, 1, 1000 );
    light.position.set(0, 0, 10);
    let ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(light);
    scene.add(ambientLight);
}

let controls = new function() {
    this.color = '#ff0000';
    this.opacity = 0.8;
}


//******************

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
    let delta = clock.getDelta();
    cameraControls.update(delta);
    mat.color = new THREE.Color(controls.color);
    mat.opacity = controls.opacity;
	renderer.render(scene, camera);
}

function init() {
	let canvasWidth = window.innerWidth;
	let canvasHeight = window.innerHeight;
	let canvasRatio = canvasWidth / canvasHeight;

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

    let gui = new dat.GUI();
    gui.addColor(controls, 'color');
    gui.add(controls, 'opacity', 0.0, 1.0).step(0.1);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function addToDOM() {
	let container = document.getElementById('container');
	let canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}



init();
createScene();
addToDOM();
animate();


