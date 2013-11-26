
var DISTANCES = (function(){

	var controls;

	var create_tab = function(data){
		var centers_path = "";
		var all_files = data.files;
		var cluster_centers_data;

		//Look for the centers distance file
		for(var i = 0; i< all_files.length; i++){
			if (all_files[i].description == "Centers of the selection used to calculate distances"){
				centers_path = all_files[i].path;
			}
		}

		if(centers_path !== ""){
			// Add the tab
			$("<li><a href='#distances-tab'>Selection Centers</a></li>").insertAfter("#clusters_tab");

			// Comoile template
			var evaluation_template = COMM.synchronous.load_text_resource("results/templates/distances.template");
			template = Handlebars.compile(evaluation_template);


			// handle data
			cluster_centers_data = JSON.parse(COMM.synchronous.load_external_text_resource(centers_path));

			// Add contetns
			$("#distances-tab").html(template(extract_template_data(cluster_centers_data)));

			// Render!
			render_scene($("#distances_canvas")[0], cluster_centers_data);
			animate();
		}
		else{
			$("#distances-tab").css({display:"none"});
		}
	};

	function extract_template_data(cluster_centers_data){
		var template_data = {clusters:[]}

		for(var cluster_id in cluster_centers_data.points){
			var color = cluster_centers_data.points[cluster_id].color;
			template_data.clusters.push({
				id: cluster_id,
				color: rgbToHex(color[0], color[1], color[2])
			});
		}
		return template_data;
	}

	function plot_cluster(color, prototype, points, geometry){
		var color = new THREE.Color().setRGB(color[0],color[1],color[2])
		for (var i=0; i < points.length; i++) {
			geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(	points[i][0],
																		points[i][1],
																		points[i][2])));
			geometry.colors.push(color);
		}
	}

	function set_up_camera(bounding_box, rendering_canvas) {
		var xs = [];
		var ys = [];
		var zs = [];
		for (var i =0; i< bounding_box.length; i++){
			xs.push(bounding_box[i][0]);
			ys.push(bounding_box[i][1]);
			zs.push(bounding_box[i][2]);
		}

		var max_y = Math.max.apply(Math,ys);
		var min_y = Math.min.apply(Math,ys);
		var max_z = Math.max.apply(Math,zs);
		var min_z = Math.min.apply(Math,zs);
		var max_x = Math.max.apply(Math,xs);
		var min_x = Math.min.apply(Math,xs);

		var camera = new THREE.PerspectiveCamera(45,rendering_canvas.clientWidth/rendering_canvas.clientHeight, 0.1, 1000);
// 		camera.position.set(max_x-min_x,max_y,max_z-min_z);
		camera.position.set(0,max_y,0);

		camera.lookAt(new THREE.Vector3(max_x-min_x,0,max_z-min_z));

		return camera;
	}

	function animate() {
		requestAnimationFrame( animate );
		controls.update();
	}

	function render_scene(rendering_canvas, cluster_centers_data){

		// Based on http://fhtr.org/BasicsOfThreeJS/#37
		var renderer = new THREE.WebGLRenderer({
												antialias: true,
												canvas:rendering_canvas
												});

		sizes = [$(window).width()*0.8, $(window).height()*0.8];
		size = Math.min($(window).width()*0.8, $(window).height()*0.8);
		renderer.setSize(size, size);

		renderer.setClearColor(0xBBBBBB, 1.0);
		renderer.clear();

		function render() {
			renderer.render(scene, camera);
		}

		// Create scene and camera
		var camera = set_up_camera(cluster_centers_data["bounding_box"], rendering_canvas);
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.addEventListener( 'change', render );

		var scene = new THREE.Scene();
		// Create the scatter plot object
		var scatterPlot = new THREE.Object3D();
		scene.add(scatterPlot);

		var mat = new THREE.ParticleBasicMaterial({
			vertexColors: true,
			size: 1.5
		});

		var pointGeo = new THREE.Geometry();
		clusters = cluster_centers_data.points;
		for (var cluster_id in clusters){
			plot_cluster(clusters[cluster_id].color, clusters[cluster_id].prototype, clusters[cluster_id].centers, pointGeo);
		}
		var points = new THREE.ParticleSystem(pointGeo, mat);
		scatterPlot.add(points);

		render();
	}

	//******************************
	// Modified from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	function componentToHex(c) {
	    var hex = parseInt(c*255).toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
	    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}
	//******************************

	return {
				create_tab:create_tab
	};

}());