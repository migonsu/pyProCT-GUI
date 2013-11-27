
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

			// Compile template
			var evaluation_template = COMM.synchronous.load_text_resource("results/templates/distances.template");
			template = Handlebars.compile(evaluation_template);


			// handle data
			cluster_centers_data = JSON.parse(COMM.synchronous.load_external_text_resource(centers_path));

			// Add contents
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

	function plot_clustering(data, scene){

		// Add all points to a geometry (with its colors)
		var pointGeo = new THREE.Geometry();
		clusters = data.points;
		for (var cluster_id in clusters){
			plot_cluster(clusters[cluster_id].color, clusters[cluster_id].prototype, clusters[cluster_id].centers, pointGeo);
		}

		// Create the scatter plot object
		var scatterPlot = new THREE.Object3D();

		var plotMaterial = new THREE.ParticleBasicMaterial({
			vertexColors: true,
			size: 1.5
		});

		var points = new THREE.ParticleSystem(pointGeo, plotMaterial);
		scatterPlot.add(points);
		scene.add(scatterPlot);
	}

	function plot_backbone_trace(data, scene){
		// from https://github.com/mrdoob/three.js/wiki/Drawing-lines
		if(data["backbone_trace"].length>0){
			var geometry = new THREE.Geometry();
			for (var i =0; i< data["backbone_trace"].length;i++){
				var point = data["backbone_trace"][i];
			    geometry.vertices.push(new THREE.Vector3(point[0],point[1],point[2]));
			}

			var material = new THREE.LineBasicMaterial({
		        color: 0x0000ff
		    });

		    var line = new THREE.Line(geometry, material);
			scene.add(line);
	    }
	}

	function set_up_camera(bounding_box, bounding_box_center, bounding_box_corner, rendering_canvas) {

		var camera = new THREE.PerspectiveCamera(45,rendering_canvas.clientWidth/rendering_canvas.clientHeight, 0.1, 1000);

		// Look at the center and position camera in one wall of the bounding box (ej, z-y plane)
		var center = new THREE.Vector3(bounding_box_center[0],
										bounding_box_center[1],
										bounding_box_center[2]);


		var camera_pos = new THREE.Vector3(
			bounding_box_corner[0],
			bounding_box_corner[1],
			bounding_box_corner[2]
		);

		console.log("center",center);
		console.log("camera",camera_pos);

		camera.position.set(camera_pos.x,camera_pos.y,camera_pos.z);
		camera.lookAt(center);

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
		var camera = set_up_camera(	cluster_centers_data["bounding_box"],
									cluster_centers_data["bounding_box_center"],
									cluster_centers_data["bounding_box_corner"],
									rendering_canvas);
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.addEventListener( 'change', render );

		var scene = new THREE.Scene();

		plot_clustering(cluster_centers_data, scene);
		plot_backbone_trace(cluster_centers_data, scene)

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