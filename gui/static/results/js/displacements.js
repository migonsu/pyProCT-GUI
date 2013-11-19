var DISPLACEMENTS = (function(){
	
	var create_tab = function(data){
		var all_files = data["files"];
		var displacements_path = "";
		
		//Look for the CA distance file
		for(var i = 0; i< all_files.length; i++){
			if (all_files[i]["description"] == "Alpha Carbon mean square displacements"){
				displacements_path = all_files[i]["path"];
			}
		}
		
		if(displacements_path !== ""){
			// Add the tab
			$("<li><a href='#displacements-tab'>Displacements</a></li>").insertAfter("#clusters_tab");
			
			// handle data
			data["handle_ca_distances"] = true;
			data["ca_displacements"] = JSON.parse(COMM.synchronous.load_external_text_resource(displacements_path));
			
			// Add contents
			var displacements_template = COMM.synchronous.load_text_resource("results/templates/displacements.template");
			template = Handlebars.compile(displacements_template);
			$("#displacements-tab").html(template(data));
			
			// Add plots
			var base_options = {
					axesDefaults: {
				        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
				     },
					axes: {
						xaxis: {
						  label: "Residue Number",
						  pad: 0
						},
						yaxis: {
						  label: "Mean CA Displacement",
						  pad: 0
						}
				      },
				      series:[ 
				              {
				                lineWidth:1, 
				                markerOptions: { size: 3 }
				              }
				      ]
				};
			
			for(var cluster_id in data["ca_displacements"]){
				if(cluster_id !== "global"){
					//console.log(data["ca_displacements"][cluster_id])
					base_options["title"] = "Id: "+ cluster_id;
					$("#plot_"+cluster_id).jqplot([data["ca_displacements"][cluster_id]],base_options);
				}
			}
			base_options["title"] = "Global";
			base_options["seriesColors"] = "#F00";
			$("#main_cluster_plot").jqplot([data["ca_displacements"]["global"]],base_options);
		}
		else{
			console.log("displacements NOT found");
			data["handle_ca_distances"] = false;
		}
	};
	
	
	return {
				create_tab:create_tab
			};
}());