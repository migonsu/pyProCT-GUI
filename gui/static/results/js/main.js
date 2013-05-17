Handlebars.registerHelper('formatted', function(number) {
	if(isInt(number)){
		return ""+number;
	}
	else{
		return number.toFixed(4);
	}
});

function process_result_data(data){
	var all_clusterings = jQuery.extend({}, data["selected"],data["not_selected"]);
	data['total_number_of_clusterings'] = Object.keys(all_clusterings).length;
	data['number_of_accepted_clusterings'] = Object.keys(data["selected"]).length;
	data['number_of_rejected_clusterings'] = Object.keys(data["not_selected"]).length;
	
	var tmp_data = {};
	
	for (clustering_id in all_clusterings){
		var clustering_definition = all_clusterings[clustering_id];
		var type = clustering_definition["type"];
		if(tmp_data[type] == undefined){
			tmp_data[type] = 1;
		}
		else{
			tmp_data[type] += 1;
		}
	}

	data['number_of_clusterings_by_type'] = [];
	for (clustering_type in tmp_data){
		data['number_of_clusterings_by_type'].push({"number_of_clusterings": tmp_data[clustering_type],
															"type":clustering_type});
	}
	
	data["accepted"] = [];
	var accepted_ids = [];
	for (var clustering_id in data["selected"]){
		accepted_ids.push({id:clustering_id});
		var clustering_definition = data["selected"][clustering_id];
		data["accepted"].push({ 
			id:clustering_id,
			type:clustering_definition["type"],
			parameters:JSON.stringify(clustering_definition["parameters"])
		});
	}
	
	data["rejected"] = [];
	for (var clustering_id in data["not_selected"]){
		var clustering_definition = data["not_selected"][clustering_id];
		data["rejected"].push({ 
			id:clustering_id,
			type:clustering_definition["type"],
			parameters:JSON.stringify(clustering_definition["parameters"]),
			reasons: clustering_definition["reasons"]
		});
	}
	
	EVALUATION.process_data(data, accepted_ids);
	
	process_cluster_data(data);
	
	return data;
}



function parse_elements(elements_string){
	// Delete spaces
	var list_string = elements_string.replace(/[\s]+/g, '');
	var parts = list_string.split(",");
	var elements = [];
	for (var i = 0; i<parts.length; i++){
		if(parts[i].indexOf(":") != -1){
			var numbers = parts[i].split(":");
			for(var j = parseInt(numbers[0]); j<= parseInt(numbers[1]); j++){
				elements.push(j);
			}
		}
		else{
			elements.push(parseInt(parts[i]));
		}
	}
	
	return elements;
}

function process_cluster_data(data){
	var best_clustering_clusters = data["selected"][data["best_clustering"]]["clustering"]["clusters"];
	for(var i = 0; i < best_clustering_clusters.length; i++){
		var elements = parse_elements(best_clustering_clusters[i]["elements"]);
		
		var cluster_data = {
			id: "cluster_"+i,
			centroid: best_clustering_clusters[i]["centroid"],
			elements: elements,
			number_of_elements: elements.length
		};
		CLUSTERS.clusters.push(cluster_data);
	}
	data["clusters"] = CLUSTERS.clusters;
}


function generate_tabs_contents(data){
	
	var summary_template = COMM.synchronous.load_text_resource("results/templates/summary.template");
	
	var files_template = COMM.synchronous.load_text_resource("results/templates/files.template");
	var clusters_template = COMM.synchronous.load_text_resource("results/templates/clusters.template");
	
	$("#tabs").tabs();
	
	var template = Handlebars.compile(summary_template);
	$("#summary-tab").html(template(data));

	EVALUATION.create_tab("evaluation-tab",data);
	
	template = Handlebars.compile(files_template);
	$("#files-tab").html(template(data));
	
	template = Handlebars.compile(clusters_template);
	$("#clusters-tab").html(template(data));
	CLUSTERS.create_cluster_widgets();
	CLUSTERS.create_main_cluster_widget();
}