	
function process_result_data(data){
	var all_clusterings = jQuery.extend({}, data["selected"],data["not_selected"]);
	data['total_number_of_clusterings'] = Object.keys(all_clusterings).length;
	data['number_of_accepted_clusterings'] = Object.keys(data["selected"]).length;
	data['number_of_rejected_clusterings'] = Object.keys(data["not_selected"]).length;
	
	Handlebars.registerHelper('formatted', function(number) {
		if(isInt(number)){
			return ""+number;
		}
		else{
			return number.toFixed(4);
		}
	});
	
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
	
	data["evaluation_tags"] = [];
	for (var evaluation_tag in data["selected"][Object.keys(data["selected"])[0]]["evaluation"]){
		if (evaluation_tag.substr(0,11) !== "Normalized_"){
			data["evaluation_tags"].push({tag:evaluation_tag});
		}
	}
	
	data["evaluations"] = [];
	for (var clustering_id in data["selected"]){
		var clustering_evaluation = data["selected"][clustering_id]["evaluation"];
		var eval_data = {
			id:clustering_id,
			values:[],
			best_clustering : (clustering_id == data["best_clustering"])
		};
		for(var evaluation_tag in clustering_evaluation){
			if (evaluation_tag.substr(0,11) !== "Normalized_"){
				var value = clustering_evaluation[evaluation_tag];
				eval_data["values"].push({value:value});
			}
		}
		data["evaluations"] .push(eval_data);
	}
	
	data["criteria_table_headers"] = accepted_ids;
	data["criteria_table"] = [];
	for(var criteria_id in data["scores"]){
		var criteria_val = {
			id : criteria_id,
			values: []
		};
		
		for(var i =0; i < accepted_ids.length; i++){
			criteria_val.values.push({value:data["scores"][criteria_id][accepted_ids[i]["id"]]});
		}
		
		data["criteria_table"].push(criteria_val);			
	}
	
	return data;
}


function generate_tabs_content(data){
	var summary_template = load_text_resource_with_ajax("results/templates/summary.template");
	var evaluation_template = load_text_resource_with_ajax("results/templates/evaluation.template");
	var files_template = load_text_resource_with_ajax("results/templates/files.template");
	
	$("#tabs").tabs();
	
	var template = Handlebars.compile(summary_template);
	$("#summary-tab").html(template(data))

	template = Handlebars.compile(evaluation_template);
	$("#evaluation-tab").html(template(data))
	
	template = Handlebars.compile(files_template);
	$("#files-tab").html(template(data))
}