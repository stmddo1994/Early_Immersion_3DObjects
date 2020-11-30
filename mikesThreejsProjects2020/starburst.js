/***********
 * starburst.js
 * Project:
 *      (1) Change the number of rays.
 *      (2) Change colors of both ends of the rays.
 *      (3) Choose colors at random. Try getRandomColor().
 *      (4) Change the radius of the starburst.
 *      (5) Vary the length of rays randomly. Use getRandomInt(min,max).
 *      (6) Generate a sphere of starbursts. Use getRandomPointOnSphere(rad)
 *          to generate a random point on a sphere of radius rad.
 *          Define a function manyStarbursts(n, rays, rad) that 
 *          calls starburst n times. When you have a starburst s,
 *          use s.position = p to position it at point p where
 *          p is a random point on the sphere. You may want manyStarbursts
 *          to add each starburst s to the scene.
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();

function starburst(n, innerColor, outerColor) {
    let rad = 10;
    let origin = new THREE.Vector3(0, 0, 0);
    let geom = new THREE.Geometry();
    for (let i = 0; i < n; i++) {
        let dest = getRandomPointOnSphere(rad);
        geom.vertices.push(origin, dest);
        geom.colors.push(innerColor, outerColor);
    }
    let mat = new THREE.LineBasicMaterial({vertexColors: true, linewidth: 2});
    return new THREE.Line(geom, mat, THREE.LineSegments);
}


function createScene() {
    let inner = getRandomColor();
    let outer = getRandomColor();
    let n = getRandomInt (100, 500);
    let mesh = starburst(n, inner, outer);
    scene.add(mesh);
}


//**********************

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
    let delta = clock.getDelta();
    cameraControls.update(delta);
	renderer.render(scene, camera);
}

function init() {
	let canvasWidth = window.innerWidth;
	let canvasHeight = window.innerHeight;
	let canvasRatio = canvasWidth / canvasHeight;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x000000, 1.0);

	camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
	camera.position.set(0, 0, 40);
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

