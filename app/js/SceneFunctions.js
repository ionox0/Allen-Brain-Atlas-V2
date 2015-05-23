var _ = require('underscore');

/*******************
/ Scene Functions
*******************/

// Lights:
module.exports.addLights = function(){
  var scale = 150;
  var colors = [0xFFFFFF, 0xFF0000, 0x00FF00, 0x0000FF];
  var sphereSize = 0.5;
  var light = new THREE.PointLight(colors[0], 0.8);
  light.position.set(scale, 0, 0);
  scene.add(light);
  var light2 = new THREE.PointLight(colors[0], 0.8);
  light2.position.set(-scale, 0, 0);
  scene.add(light2);
  var light3 = new THREE.PointLight(colors[0], 0.8);
  light3.position.set(0, scale, 0);
  scene.add(light3);
  var light4 = new THREE.PointLight(colors[0], 0.8);
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
};
  
module.exports.addBrain = function(){
  try {
    brain = PinaCollada('brain2', 26);
  } catch (err) {
    console.error('Error adding brain model: ' + err);
  }
};

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
