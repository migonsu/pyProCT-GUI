
// From http://fhtr.org/BasicsOfThreeJS/#37
var renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(document.body.clientWidth, 
                       document.body.clientHeight);

      document.body.appendChild(renderer.domElement);
      renderer.setClearColorHex(0xEEEEEE, 1.0);
      renderer.clear();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);
camera.position.z = 300;

var light = new THREE.SpotLight();
      light.position.set( 170, 330, -160 );
      scene.add(light);
// enable shadows on the renderer
      renderer.shadowMapEnabled = true;

      // enable shadows for a light
      light.castShadow = true;

      // enable shadows for an object
      litCube.castShadow = true;
      litCube.receiveShadow = true;

var scatterPlot = new THREE.Object3D();
var mat = new THREE.ParticleBasicMaterial(
  {vertexColors: true, size: 1.5});

var pointCount = 10000;
var pointGeo = new THREE.Geometry();
for (var i=0; i<pointCount; i++) {
  pointGeo.vertices.push(new THREE.Vertex(new THREE.Vector3(x,y,z)));
  pointGeo.colors.push(new THREE.Color().setRGB());
}
var points = new THREE.ParticleSystem(pointGeo, mat);
scatterPlot.add(points);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.0035);

renderer.render(scene, camera);