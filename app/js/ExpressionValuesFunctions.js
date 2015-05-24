var _ = require('underscore');

/******************************
/ Expression Values Functions
******************************/

module.exports.parseExpressionData = function(exprData) {
  console.log('PARSEEXPRESSIONDATA', exprData);
  //exprVals.msg.probes[0].expression_level - Expression levels
  //exprVals.msg.samples[x].sample.mri - [x,y,z] coordinates
  var exprVals2 = exprData.msg.probes[0].expression_level;
  var coordinates = _.pluck(exprData.msg.samples, 'sample');
  var coordinates2 = _.pluck(coordinates, 'mri');
  //return new promise([exprVals2, coordinates2], );
  return [exprVals2, coordinates2];
};

module.exports.buildExpressionCloud = function(exprVals, coordinates) {
  console.log('BUILDEXPRESSIONCLOUD');
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
    size: 10,
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
  brain.name = 'brain';

  // Remove previous brain:
  var selectedObject = scene.getObjectByName('brain');
  scene.remove(selectedObject);

  scene.add(brain);
  console.log(brain);
  $('#spinner').css('display', 'none');
  var render = function () {
    requestAnimationFrame(render);
    brain.rotation.y += 0.01;
    renderer.render(scene, camera);
  };
  render();
};