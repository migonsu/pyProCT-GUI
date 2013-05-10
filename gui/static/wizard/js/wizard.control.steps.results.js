WIZARD.control = (function(module){
	
	if (typeof module.functions === "undefined"){
		module.functions = {};
	}
	
	module.functions[WIZARD.ADVANCED_ACTION] = {
		'workspace-1':function(event, state, step, step_id){
			var file_path = step.find("#workspace_base")
			.val();
			if(file_path!=""){
				var file_check  = file_exists(file_path);

				if(file_check["exists"]){
					return true;
				}
				else{
					var create_new_folder_question = yes_or_no_dialog ("Warning",
					"Folder does not exist, do you want to create it?");

					create_new_folder_question.done(function(){
						create_folder(file_path);
						$("#wizard-wrapper").wizard("forward",[event,1]);
					});
				}
			}
			else{
				warning_dialog ("The field cannot be empty.");
			}
			return false;
		},
	    'trajectory-1':function(event, state, step, step_id){
	    	if (!$("#trajectory_list").dynamiclist("isEmpty")){
            	return true;
        	}
        	else{
        		warning_dialog ("You have to add at least one trajectory.");
        		return false;
        	}
		},
	    "rmsd-1":function(event, state, step, step_id){
	    	if($("#rmsd_fit_selection").val() == "" || 
    				(!step.find("#usesamefitandcalc").is(':checked') && 
    						$("#rmsd_calc_selection").val() == "")){
	        	warning_dialog ("Fields cannot be empty.");
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
		    	warning_dialog ("Fields cannot be empty.");
				return false;			            		
			}
	    	return true;
		},
	    'load_matrix-1':function(event, state, step, step_id){
	    	if ($("#matrix_creation_path").val()!=""){
            	return true;
        	}
        	else{
        		warning_dialog ("You have to specify the file you want to load.");
        	}
	    	return false;
		},
	    'algorithms-1':function(event, state, step, step_id){
	    	if (!$("#algorithms_list").dynamiclist("isEmpty")){
        		var list = step.find(":custom-dynamiclist");
            	selected_algorithms = list.dynamiclist("getValue").split(",");
            	return true;
        	}
        	else{
        		warning_dialog ("You have to add at least one clustering algorithm.");
        	}
	    	return false;
		},
	    'algorithm-gromos':function(event, state, step, step_id){
	    	var cbox = step.find("[name='guess_params']");
        	if(cbox.is(":checked")){
        		return true;
        	}
        	else{
        		var a_list_is_incorrect = false;
        		
        		step.find(":text").each(function(){
        			if(!a_list_is_incorrect){
            			if($(this).val() == ""){
            				warning_dialog ("List must have at least one element.");
            				a_list_is_incorrect = true;
            				return;
            			}
            			else{
            				console.log($(this).val());
            				if(!has_list_format($(this).val())){
            					a_list_is_incorrect = true;
            					warning_dialog ("List has not the correct format.");
            					return;
            				}
            			}
        			}
        			else{
        				return false;
        			}
        		});
        		
        		return ! a_list_is_incorrect;
        	}
		},
	    'criteria-2':function(event, state, step, step_id){
	    	if ($("#criteria_list").dynamiclist("isEmpty")){
        		warning_dialog ("You need to define at least one selection criterium.");
        		return false;
        	}
        	else{
        		return true;
        	}
		}
	};
	
	module.functions[WIZARD.ADVANCED_ACTION]['algorithm-hierarchical'] = module.functions[WIZARD.ADVANCED_ACTION]['algorithm-gromos'];
	module.functions[WIZARD.ADVANCED_ACTION]['algorithm-random'] = module.functions[WIZARD.ADVANCED_ACTION]['algorithm-gromos'];
	module.functions[WIZARD.ADVANCED_ACTION]['algorithm-spectral'] = module.functions[WIZARD.ADVANCED_ACTION]['algorithm-gromos'];
	module.functions[WIZARD.ADVANCED_ACTION]['algorithm-dbscan'] = module.functions[WIZARD.ADVANCED_ACTION]['algorithm-gromos'];
	module.functions[WIZARD.ADVANCED_ACTION]['algorithm-kmedoids'] = module.functions[WIZARD.ADVANCED_ACTION]['algorithm-gromos'];
	
	return module;
	
}(WIZARD.control));