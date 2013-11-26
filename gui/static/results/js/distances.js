
var DISTANCES = (function(){

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
			render($("#distances_canvas")[0], cluster_centers_data);
		}
		else{
			$("#distances-tab").css({display:"none"});
		}
	};

	function extract_template_data(cluster_centers_data){
		var template_data = {clusters:[]}

		for(var cluster_id in cluster_centers_data.points){
			var color = cluster_centers_data.points[cluster_id].color;
			console.log(rgbToHex(color[0], color[1], color[2]))
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

	function render(rendering_canvas, cluster_centers_data){
		// From http://fhtr.org/BasicsOfThreeJS/#37
		var renderer = new THREE.WebGLRenderer({
												antialias: true,
												canvas:rendering_canvas
												});

//  		renderer.setSize(document.body.clientWidth,
// 	                       document.body.clientHeight);
		sizes = [$(window).width()*0.8, $(window).height()*0.8];
		size = Math.min($(window).width()*0.8, $(window).height()*0.8);
		renderer.setSize(size, size);

		renderer.setClearColor(0xBBBBBB, 1.0);
		renderer.clear();

		// Create scene and camera
		var camera = new THREE.PerspectiveCamera(10,rendering_canvas.clientWidth/rendering_canvas.clientHeight, 1, 1000);
		camera.position.z = 50;
		camera.position.x = 0;
		camera.position.y = 75;
		var scene = new THREE.Scene();

		// Create the scatter plot object
		var scatterPlot = new THREE.Object3D();
		scene.add(scatterPlot);
	    scatterPlot.rotation.y = 0.5;

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

		renderer.render(scene, camera);

		var down = false;
		var sx = 0, sy = 0;

		window.onmousedown = function (ev){
			down = true;
			sx = ev.clientX;
			sy = ev.clientY;
		};

		window.onmouseup = function(){
			down = false;
		};

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
		};
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