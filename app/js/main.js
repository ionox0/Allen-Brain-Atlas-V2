var scene, renderer, camera, controls, brain;

init();
render();

function init(){
  createScene();
  createRenderer();
  addCamera();
  addControls();
  addLights();
  //addBrain();
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// Scene:
function createScene(){
  scene = new THREE.Scene();
}

// Renderer:
function createRenderer(){
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  $('#main').append(renderer.domElement);
}

// Camera:
function addCamera(){
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
  camera.position.set(1, 1, 15);
  scene.add(camera);
}

// Controls:
function addControls(){
  controls = new THREE.OrbitControls(camera, renderer.domElement);
}
  
// Lights:
function addLights(){
  var light = new THREE.PointLight(0xfffff3, 0.8);
  light.position.set(-10, 20, 10);
  scene.add(light);
  var light2 = new THREE.PointLight(0xd7f0ff, 0.2);
  light2.position.set(20, 20, 10);
  scene.add(light2);
  var light3 = new THREE.PointLight(0xFFFFFF, 0.5);
  light3.position.set(-50, -20, -10);
  scene.add(light3);
  var light4 = new THREE.PointLight(0xFFFFFF, 0.5);
  light4.position.set(15, -20, -10);
  scene.add(light4);

  // LightHelpers:
  var sphereSize = 1;
  var pointLightHelper = new THREE.PointLightHelper( light, sphereSize ); 
  scene.add( pointLightHelper );
  var pointLightHelper2 = new THREE.PointLightHelper( light2, sphereSize ); 
  scene.add( pointLightHelper2 );
  var pointLightHelper3 = new THREE.PointLightHelper( light3, sphereSize ); 
  scene.add( pointLightHelper3 );
  var pointLightHelper4 = new THREE.PointLightHelper( light4, sphereSize ); 
  scene.add( pointLightHelper4 );
}
  
function addBrain(){
  try {
    brain = PinaCollada('brain2', 1);
  } catch (err) {
    console.error("Error creating brain model: " + err);
  }
}

// For initial testing...
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// Collada Loader for the .dae brain model
function PinaCollada(modelname, scale) {
  var loader = new THREE.ColladaLoader();
  var localObject;
  loader.options.convertUpAxis = true;
  loader.load( 'dae-models/' + modelname + '.dae', function( collada ) {
    localObject = collada.scene;
    localObject.scale.x = localObject.scale.y = localObject.scale.z = scale;
    localObject.updateMatrix();
    localObject.position.set(0, 0, 0); //x,z,y- if you think in blender dimensions
    localObject.scale.set(1.5, 1.5, 1.5);
    scene.add(localObject); // Scene shouldn't be global...
  });
  return localObject;
}

