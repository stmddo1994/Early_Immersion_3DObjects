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

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

function starburst(n, innerColor, outerColor) {
    var rad = 10;
    var origin = new THREE.Vector3(0, 0, 0);
    var geom = new THREE.Geometry();
    for (var i = 0; i < n; i++) {
        var dest = getRandomPointOnSphere(rad);
        geom.vertices.push(origin, dest);
        geom.colors.push(innerColor, outerColor);
    }
    var mat = new THREE.LineBasicMaterial({vertexColors: true, linewidth: 2});
    return new THREE.Line(geom, mat, THREE.LineSegments);
}


function createScene() {
    var inner = new THREE.Color(0x00BFFF);
    var outer = new THREE.Color(0x8A2BE2);
    var n = 400;
    var mesh = starburst(n, inner, outer);
    scene.add(mesh);
}


//**********************

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
	renderer.render(scene, camera);
}

function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

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

