/***********
 * triangle.js
 * Project:
 *      (1) Change the colors associated with the triangle's corners.
 *      (2) Change the positions of the three vertices.
 *      (3) Create a square from two triangles. You'll need
 *          to generate four vertices instead of three, six colors
 *          instead of three, and two triangular faces instead of one.
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {
    // triangle geometry
    let geom = new THREE.Geometry();
    geom.vertices.push(new THREE.Vector3(0, 0, 0));
    geom.vertices.push(new THREE.Vector3(10, 0, 0));
    geom.vertices.push(new THREE.Vector3(0, 6, 0));
    geom.vertices.push(new THREE.Vector3(0, 0, 6));
    let face = new THREE.Face3(0, 1, 2);
    face.vertexColors.push(new THREE.Color(0xff0000));
    face.vertexColors.push(new THREE.Color(0x00ff00));
    face.vertexColors.push(new THREE.Color(0x0000ff));
    face.vertexColors.push(new THREE.Color(0xff0000));
    face.vertexColors.push(new THREE.Color(0x00ff00));
    face.vertexColors.push(new THREE.Color(0x0000ff));
    geom.faces.push(face);
    // material
    let matArgs =  {vertexColors: THREE.VertexColors, side: THREE.DoubleSide};
    let mat = new THREE.MeshBasicMaterial(matArgs);
    //  mesh
    let mesh = new THREE.Mesh(geom, mat);

    // some lighting for the axes!
    let light = new THREE.PointLight(0xFFFFFF, 1, 1000 );
    light.position.set(10, 10, 20);
    scene.add(light);
    let ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    scene.add(mesh);
}

//*********************


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


function showAxes() {
    scene.add(makeAxes({axisLength:11, axisRadius:0.1}));
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
showAxes();
createScene();
addToDOM();
animate();

