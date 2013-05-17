var EVALUATION = (function(){
	
	
	function get_labels(table_id, columns_array){
		var heads = $("#"+table_id).find("th");
		var labels = [];
		for(var i = 0; i < columns_array.length; i++){
			labels.push($(heads[columns_array[i]]).text());
		}
		return labels;
	}
	
	function traverse_columns(table_id, columns_array){
		var data = [];
		var x = 0;
		console.log(columns_array)
		$("#"+table_id).find("tr").each(function(){
			var cells = $(this).find("td");
			console.log(cells)
			
			if(cells.length != 0){
				for(var i = 0; i < columns_array.length; i++){
					if(typeof data[columns_array[i]] === "undefined"){
						data[columns_array[i]] = [];
					}
					data[columns_array[i]].push([x, parseFloat($(cells[columns_array[i]]).text())]);
				}
				
				x = x+1;
			}
		});

		tmp_data  = [];
		for (datum_index in data){
			tmp_data.push(data[datum_index]);
		}
		return tmp_data;
	}
	
	var create_tab = function(tab_id, data){
		var evaluation_template = COMM.synchronous.load_text_resource("results/templates/evaluation.template");
		template = Handlebars.compile(evaluation_template);
		$("#"+tab_id).html(template(data));
		
		// Prepare show plot table
		$("#show_plot_table").css({width:$("#summary_table").css("width")});
		$(".button").button();
		
		// Add table sorting capability
		$("#summary_table").tablesorter({sortList: [[0,0]]});
		$("#do_plot_button").click(function(){
			do_plot();
		});
	};
	
	function do_plot(){
		var cells = $("#show_plot_table").find("td");
		var columns_to_plot = [];
		for (var i = 0; i< cells.length; i++){
			if($(cells[i]).find(".show_checkbox").length > 0){
				if($(cells[i]).find(".show_checkbox").is(":checked")){
					columns_to_plot.push(i);
				}
			}
		}
		if (columns_to_plot.length == 0) return;
		
		$("#summary_plot").empty().jqplot(traverse_columns("summary_table",columns_to_plot),
		{
			animate: true,
			legend: {
		        show: true,
		        labels:get_labels("summary_table",columns_to_plot),
		        renderer: $.jqplot.EnhancedLegendRenderer,
	            placement: "outsideGrid",
		        location: 'ne',
		    },
		});
	}
	
	var process_data = function(data, accepted_ids){
		data["evaluation_tags"] = [];
		for (var evaluation_tag in data["selected"][Object.keys(data["selected"])[0]]["evaluation"]){
			if (evaluation_tag.substr(0,11) !== "Normalized_"){
				data["evaluation_tags"].push({tag:evaluation_tag});
			}
		}
		
		//-----------------
		var criteria_ids = [];
		for(var criteria_id in data["scores"]){
			criteria_ids.push(criteria_id);
		}
		criteria_ids.sort();
		for(var i=0; i <  criteria_ids.length; i++){
			data["evaluation_tags"].push({tag:criteria_ids[i]});
		}
		//-------------------
		
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
			//-----------------
			for(var i=0; i <  criteria_ids.length; i++){
				eval_data["values"].push({value:data["scores"][criteria_ids[i]][clustering_id]});
			}
			//-----------------
			data["evaluations"] .push(eval_data);
		}
	};

	return {
		process_data:process_data,
		create_tab:create_tab
	};
	
}());