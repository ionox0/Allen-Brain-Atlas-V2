var abaApi = require("./abaApi.js");
var _ = require("underscore");

var scene, renderer, camera, controls, brain;

init();
render();

function init(){
  createScene();
  createRenderer();
  addCamera();
  addControls();
  addLights();
  addBrain();
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
  renderer = new THREE.WebGLRenderer({maxLights: 8});
  renderer.setSize(window.innerWidth, window.innerHeight);
  $('#main').append(renderer.domElement);
}

// Camera:
function addCamera(){
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
  camera.position.set(50, 50, 50);
  scene.add(camera);
}

// Controls:
function addControls(){
  controls = new THREE.OrbitControls(camera, renderer.domElement);
}
  
// Lights:
function addLights(){
  var sphereSize = 1;
  // var neg1 = 1;
  // var neg2 = -1;
  // for (i = 0; i < 4; i++) {
  //   var light = new THREE.PointLight(0xfffff3, 0.8);
  //   var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
  //   light.position.set(10 * neg, 10 * neg, 10 * neg);
  //   scene.add(light);
  //   scene.add( pointLightHelper );
  // }
  var light = new THREE.PointLight(0xfffff3, 0.8);
  light.position.set(10, 10, 10);
  scene.add(light);
  var light2 = new THREE.PointLight(0xd7f0ff, 0.2);
  light2.position.set(-10, 10, 10);
  scene.add(light2);
  var light3 = new THREE.PointLight(0xFFFFFF, 0.5);
  light3.position.set(10, -10, 10);
  scene.add(light3);
  var light4 = new THREE.PointLight(0xFFFFFF, 0.5);
  light4.position.set(10, 10, -10);
  scene.add(light4);
  var light5 = new THREE.PointLight(0xfffff3, 0.8);
  light5.position.set(10, 10, 10);
  scene.add(light5);
  var light6 = new THREE.PointLight(0xd7f0ff, 0.2);
  light6.position.set(-10, 10, 10);
  scene.add(light6);
  var light7 = new THREE.PointLight(0xFFFFFF, 0.5);
  light7.position.set(10, -10, 10);
  scene.add(light7);
  var light8 = new THREE.PointLight(0xFFFFFF, 0.5);
  light8.position.set(10, 10, -10);
  scene.add(light8);

  // LightHelpers:
  var pointLightHelper = new THREE.PointLightHelper(light, sphereSize); 
  scene.add(pointLightHelper);
  var pointLightHelper2 = new THREE.PointLightHelper(light2, sphereSize); 
  scene.add(pointLightHelper2);
  var pointLightHelper3 = new THREE.PointLightHelper(light3, sphereSize); 
  scene.add(pointLightHelper3);
  var pointLightHelper4 = new THREE.PointLightHelper(light4, sphereSize); 
  scene.add(pointLightHelper4);
  var pointLightHelper5 = new THREE.PointLightHelper(light5, sphereSize); 
  scene.add(pointLightHelper5);
  var pointLightHelper6 = new THREE.PointLightHelper(light6, sphereSize); 
  scene.add(pointLightHelper6);
  var pointLightHelper7 = new THREE.PointLightHelper(light7, sphereSize); 
  scene.add(pointLightHelper7);
  var pointLightHelper8 = new THREE.PointLightHelper(light8, sphereSize); 
  scene.add(pointLightHelper8);
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

(function(){
  //Listen for 'return' in gene-entry field:
  $("#gene-entry").keyup(function (e) {
    if (e.keyCode == 13) {
      var geneAcronym = $('#gene-entry').val();
      var exprVals = abaApi.getExpressionData(geneAcronym, parseExpressionData);
    }
  });

  function parseExpressionData(exprVals) {
    console.log("BUILDEXPRESSIONCLOUD", exprVals);

    //exprVals.msg.probes[0].expression_level - Expression levels
    //exprVals.msg.samples[x].sample.mri - [x,y,z] coordinates

    var exprVals2 = exprVals.msg.probes[0].expression_level;
    var coordinates = _.pluck(exprVals.msg.samples, 'sample');
    var coordinates2 = _.pluck(coordinates, 'mri');
    console.log(exprVals2);
    console.log(coordinates2);
    buildExpressionCloud(exprVals2, coordinates2);
  }

  function buildExpressionCloud(exprVals, coordinates) {
    var expressionPoints = new THREE.Geometry();

    //For finding correction factors:
    var min0 = 1000;
    var min1 = 1000;
    var min2 = 1000;
    var max0 = 0;
    var max1 = 0;
    var max2 = 0;
    for (var i = 0; i < exprVals.length; i++){
      if (coordinates[i][0] < min0) {
        min0 = coordinates[i][0];
      }
      if (coordinates[i][1] < min1) {
        min1 = coordinates[i][1];
      }
      if (coordinates[i][2] < min2) {
        min2 = coordinates[i][2];
      }
      if (coordinates[i][0] > max0) {
        max0 = coordinates[i][0];
      }
      if (coordinates[i][1] > max1) {
        max1 = coordinates[i][1];
      }
      if (coordinates[i][2] > max2) {
        max2 = coordinates[i][2];
      }
      expressionPoints.vertices.push(new THREE.Vector3(
        coordinates[i][0] - 71,
        coordinates[i][1] - 150,
        coordinates[i][2] - 155
      ));
    }

    console.log(min0, min1, min2);
    console.log(max0, max1, max2);

    var material = new THREE.PointCloudMaterial({
      color: 0x2255FF,
      size: 1,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    object = new THREE.PointCloud(expressionPoints, material);
    scene.add(object);
    console.log(object);

    var render = function () {
      requestAnimationFrame(render);
      object.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    render();
  }

})();