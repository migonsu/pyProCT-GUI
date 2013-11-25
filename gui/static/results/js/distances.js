

function render(){
	// From http://fhtr.org/BasicsOfThreeJS/#37
	var renderer = new THREE.WebGLRenderer({antialias: true});
	
//	renderer.setSize(document.body.clientWidth, 
//	                       document.body.clientHeight);
	renderer.setSize(500,500);
	
	// Add to the page (renderer.domElement is the canvas)
	document.body.appendChild(renderer.domElement);
	
	// Clear to light grey
	renderer.setClearColor(0xEEEEEE, 1.0);
	renderer.clear();
	
	// Create scene and camera
	var camera = new THREE.PerspectiveCamera(45, /*width/height*/1, 1, 10000);
	camera.position.z = 300;
	camera.position.x = 0;
	camera.position.y = 75;
	var scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0xFFFFFF, 0.0035);
	
	// Add a light 
	var light = new THREE.SpotLight();
	light.position.set( 170, 330, -160 );
	scene.add(light);
	// enable shadows on the renderer
	renderer.shadowMapEnabled = true;
  // enable shadows for a light
	light.castShadow = true;

	// Create the scatter plot object
	var scatterPlot = new THREE.Object3D();
	scene.add(scatterPlot);
    scatterPlot.rotation.y = 0.5;
    
	var mat = new THREE.ParticleBasicMaterial({
		vertexColors: true, 
		size: 1.5
		});
	
	var pointCount = 10000;
	var pointGeo = new THREE.Geometry();
	for (var i=0; i<pointCount; i++) {
		var x = Math.random() * 100 - 50;
		var y = x*0.8+Math.random() * 20 - 10;
		var z = x*0.7+Math.random() * 30 - 15;
		pointGeo.vertices.push(new THREE.Vertex(new THREE.Vector3(x,y,z)));	
		pointGeo.colors.push(new THREE.Color().setRGB(0.5,0,0));
	}
	var points = new THREE.ParticleSystem(pointGeo, mat);
	scatterPlot.add(points);
	
	renderer.render(scene, camera);
	
	
    var down = false;
    var sx = 0, sy = 0;
    window.onmousedown = function (ev){
      down = true; sx = ev.clientX; sy = ev.clientY;
      console.log("down")
    };
    window.onmouseup = function(){ down = false; };
    window.onmousemove = function(ev) {
      if (down) {
        var dx = ev.clientX - sx;
        var dy = ev.clientY - sy;
        scatterPlot.rotation.y += dx*0.01;
        camera.position.y += dy;
        sx += dx;
        sy += dy;
        renderer.clear();
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      }
    }
}