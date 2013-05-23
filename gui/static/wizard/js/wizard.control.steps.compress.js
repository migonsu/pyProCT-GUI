WIZARD.control = (function(module){
	
	if (typeof module.functions === "undefined"){
		module.functions = {};
	}
	
	module.functions[MAIN_MENU.COMPRESS_ACTION] = {
			'browse-results-1':function(event, state, step, step_id){
				var file_path = step.find("#results_folder").val();
				if(file_path!=""){
					var file_check  = COMM.synchronous.file_exists(file_path);

					if(file_check["exists"]){
						// Check the existence of "results.json"
						var file_check  = COMM.synchronous.file_exists(file_path+"/results.json");
						console.log(file_check);
						if(file_check["exists"]){
							// Load result clustering
							var results =  $.parseJSON(COMM.synchronous.load_external_text_resource(file_path+"/results.json"));
							console.log("RESULTS", results);
							GLOBAL.loaded_clustering = results["selected"][results["best_clustering"]];
							return true;
						}
						else{
							DIALOG.warning ("Impossible to find 'results.json' file.");
							return false;
						}
					}
					else{
						DIALOG.warning ("This folder does not exist.");
						return false;
					}
				}
				else{
					DIALOG.warning ("The field cannot be empty.");
					return false;
				}
			},
			
			'workspace-1':function(event, state, step, step_id){
				var file_path = step.find("#workspace_base")
				.val();
				if(file_path!=""){
					var file_check  = COMM.synchronous.file_exists(file_path);

					if(file_check["exists"]){
						return true;
					}
					else{
						DIALOG.yes_or_no(
										"Warning",
										"Folder does not exist, do you want to create it?",
										function(){
											COMM.synchronous.create_folder(file_path);
											$("#wizard-wrapper").wizard("forward",[event,1]);
										});
					}
				}
				else{
					DIALOG.warning("The field cannot be empty.");
				}
				
				return false;
			},
			
		    'trajectory-1':function(event, state, step, step_id){
		    	// At this point we can set the algorithms (all but random)
		    	GLOBAL.selected_algorithms = $.grep(ALGORITHM.types, function(value){
		    		return value !== "random";
		    	});

		    	if (!$("#trajectory_list").dynamiclist("isEmpty")){
	            	return true;
	        	}
	        	else{
	        		DIALOG.warning("You have to add at least one trajectory.");
	        		return false;
	        	}
			},
			
		    "rmsd-1":function(event, state, step, step_id){
		    	if($("#rmsd_fit_selection").val() == "" || 
	    				(!step.find("#usesamefitandcalc").is(':checked') && 
	    						$("#rmsd_calc_selection").val() == "")){
		        	DIALOG.warning ("Fields cannot be empty.");
					return false;			            		
	        	}
	    		if (step.find("#usesamefitandcalc").is(':checked')){
	    			$("#rmsd_calc_selection").val($("#rmsd_fit_selection").val());
	    		}
				return true;	
			},
			
		    "distance-1":function(event, state, step, step_id){
		    	if($("#dist_fit_selection").val() == "" || 
						$("#dist_calc_selection").val() == ""){
			    	DIALOG.warning ("Fields cannot be empty.");
					return false;			            		
				}
		    	return true;
			},
			
			"compression-options-1":function(event, state, step, step_id){
		    	if($("#final_frames").val() === "" ){
			    	DIALOG.warning ("Final number of frames must be setted.");
					return false;			            		
				}
		    	return true;
			}
	};
	
	return module;
	
}(WIZARD.control));