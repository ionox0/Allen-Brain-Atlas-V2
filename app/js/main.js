var abaApi = require("./abaApi.js");
var _ = require("underscore");
var utils = require("./utils");
var promise = require("./promise");

init();
render();

function init(){
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({maxLights: 8});
  renderer.setSize(window.innerWidth, window.innerHeight);
  $('#main').append(renderer.domElement);
  //Camera :
  var height = 100;
  var width = 100;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
  //camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
  camera.position.set(150, 0, 0);
  camera.lookAt(scene.position);
  scene.add(camera);
  // Controls:
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  addLights();
  //addBrain();
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// Lights:
function addLights(){
  var scale = 10;
  var sphereSize = 0.5;
  var light = new THREE.PointLight(0xFF0000, 0.8);
  light.position.set(scale, 0, 0);
  scene.add(light);
  var light2 = new THREE.PointLight(0x00FF00, 0.8);
  light2.position.set(-scale, 0, 0);
  scene.add(light2);
  var light3 = new THREE.PointLight(0xFFFFFF, 0.8);
  light3.position.set(0, scale, 0);
  scene.add(light3);
  var light4 = new THREE.PointLight(0x0000FF, 0.8);
  light4.position.set(0, -scale, 0);
  scene.add(light4);

  // LightHelpers:
  var pointLightHelper = new THREE.PointLightHelper(light, sphereSize); 
  scene.add(pointLightHelper);
  var pointLightHelper2 = new THREE.PointLightHelper(light2, sphereSize); 
  scene.add(pointLightHelper2);
  var pointLightHelper3 = new THREE.PointLightHelper(light3, sphereSize); 
  scene.add(pointLightHelper3);
  var pointLightHelper4 = new THREE.PointLightHelper(light4, sphereSize); 
  scene.add(pointLightHelper4);
}
  
function addBrain(){
  try {
    brain = PinaCollada('brain2', 26);
  } catch (err) {
    console.error("Error adding brain model: " + err);
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
  loader.load('dae-models/' + modelname + '.dae', function(collada) {
    localObject = collada.scene;
    localObject.scale.x = localObject.scale.y = localObject.scale.z = scale;
    localObject.updateMatrix();
    localObject.position.set(0, 0, 0); //x,z,y - if you think in blender dimensions
    localObject.scale.set(scale, scale, scale);
    scene.add(localObject); // Scene shouldn't be global...
  });
  return localObject;
}

(function(){
  var firstKey = true;
  //Listen for 'return' in gene-entry field:
  $("#gene-entry").keyup(function (e) {
    if (firstKey === true && e.keyCode != (17|91)) {
      $('#gene-entry').val(String.fromCharCode(e.keyCode));
    }
    firstKey = false;
    if (e.keyCode == 13) {
      $("#spinner").css('display', 'block');
      var geneAcronym = $('#gene-entry').val().toUpperCase();
      var exprVals = abaApi.getExpressionData(geneAcronym, parseExpressionData);
    }
  });
})();

function parseExpressionData(exprData) {
  console.log("PARSEEXPRESSIONDATA", exprData);

  //exprVals.msg.probes[0].expression_level - Expression levels
  //exprVals.msg.samples[x].sample.mri - [x,y,z] coordinates
  var exprVals2 = exprData.msg.probes[0].expression_level;
  var coordinates = _.pluck(exprData.msg.samples, 'sample');
  var coordinates2 = _.pluck(coordinates, 'mri');
  //return new promise([exprVals2, coordinates2], );
  buildExpressionCloud(exprVals2, coordinates2);
}

function buildExpressionCloud(exprVals, coordinates) {
  console.log("BUILDEXPRESSIONCLOUD");
  // Exprvals.length should equal coordinates.length:
  console.log(exprVals.length, exprVals);
  console.log(coordinates.length, coordinates);

  var xCorrection = -100;
  var yCorrection = 90;
  var zCorrection = -100;

  var brainGeometry = new THREE.Geometry();
  for (var i = 0; i < coordinates.length; i++){
    brainGeometry.vertices.push(new THREE.Vector3(
      (coordinates[i][0]) + xCorrection,
      -(coordinates[i][1]) + yCorrection,
      (coordinates[i][2]) + zCorrection
    ));
  }

  var material = new THREE.PointCloudMaterial({
    size: 0.5,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.7,
    vertexColors: THREE.VertexColors
  });

  var maxExpressionValue = 8;
  var minExpressionValue = 0;

  // Vertex colors
  var colors = [];
  for(var j = 0; j < brainGeometry.vertices.length; j++) {
      colors[j] = new THREE.Color();
      colors[j].setHSL(exprVals[j] / maxExpressionValue, 1.0, 0.5);
  }
  brainGeometry.colors = colors;

  var brain = new THREE.PointCloud(brainGeometry, material);
  brain.name = "brain";

  // Remove last brain:
  var selectedObject = scene.getObjectByName("brain");
  scene.remove(selectedObject);

  scene.add(brain);
  console.log(brain);
  $("#spinner").css('display', 'none');
  var render = function () {
    requestAnimationFrame(render);
    brain.rotation.y += 0.01;
    renderer.render(scene, camera);
  };
  render();
}