var abaApi = require('./abaApi.js');
var utils = require('./utils');
var sceneFunctions = require('./SceneFunctions');
var expressionValuesFunctions = require('./ExpressionValuesFunctions');

(function(){
  var firstKey = true;
  $('#gene-entry').keyup(function (e) {
    if (firstKey === true && e.keyCode != (17|91)) {
      $('#gene-entry').val(String.fromCharCode(e.keyCode));
    }
    firstKey = false;
    if (e.keyCode == 13) {
      $('#spinner').css('display', 'block');
      var geneAcronym = $('#gene-entry').val().toUpperCase();
      abaApi.getExpressionData(geneAcronym).then(function(data){
        var parsedData = expressionValuesFunctions.parseExpressionData(data);
        expressionValuesFunctions.buildExpressionCloud(parsedData[0], parsedData[1]);
      });
    }
  });
})();

(function init(){
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({maxLights: 8});
  renderer.setSize(window.innerWidth, window.innerHeight);
  $('#main').append(renderer.domElement);
  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
  camera.position.set(150, 0, 0);
  camera.lookAt(scene.position);
  scene.add(camera);
  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  sceneFunctions.addLights();
  //sceneFunctions.addBrain();
})();
