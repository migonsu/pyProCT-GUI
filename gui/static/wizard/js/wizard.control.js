WIZARD.control = (function(){
	var selected_algorithms = [];
	
	var setup_wizard = function(action){
        console.log("creating wizard for action", action);
       if (action === "advanced"){ 
        
	        $("#wizard-wrapper").wizard({
		        stepsWrapper: "#steps_wrapper",
		        
		        forward: ".forward",
		        
		        backward: ".backward",
		
			    onForwardMove: function(event, state) {	
			        
			    	var step = $(state.step[0]);
			        var step_id = state.step[0].id;
			        
			        console.log(step_id)
			        switch(step_id){
			            case 'workspace-1':
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
	                    	break;
	                    
			            case 'trajectory-1':
			            	if (!$("#trajectory_list").dynamiclist("isEmpty")){
				            	return true;
			            	}
			            	else{
			            		warning_dialog ("You have to add at least one trajectory.");
			            	}
			            	break;
			            
			            case "rmsd-1":
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
			            	break;
			            
			            case "distance-1":
		            		if($("#dist_fit_selection").val() == "" || 
		            						$("#dist_calc_selection").val() == ""){
					        	warning_dialog ("Fields cannot be empty.");
								return false;			            		
			            	}
							return true;				            	
			            	break;
			            	
			            case 'load_matrix-1':
			            	if ($("#matrix_creation_path").val()!=""){
				            	return true;
			            	}
			            	else{
			            		warning_dialog ("You have to specify the file you want to load.");
			            	}
			            	break;
			            	
			            case 'algorithms-1':
			            	if (!$("#algorithms_list").dynamiclist("isEmpty")){
			            		var list = step.find(":custom-dynamiclist");
				            	selected_algorithms = list.dynamiclist("getValue").split(",");
				            	return true;
			            	}
			            	else{
			            		warning_dialog ("You have to add at least one clustering algorithm.");
			            	}
			           		break;
	
			            case 'algorithm-gromos':
			            case 'algorithm-hierarchical':
			            case 'algorithm-random':
			            case 'algorithm-spectral':
			            case 'algorithm-dbscan':
			            case 'algorithm-kmedoids':
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
			            				return;
			            			}
			            		});
			            		
			            		return ! a_list_is_incorrect;
			            	}
			            	break;
			            	
			            case 'criteria-2':
			            	if ($("#criteria_list").dynamiclist("isEmpty")){
			            		warning_dialog ("You need to define at least one selection criterium.");
			            		return false;
			            	}
			            	else{
			            		return true;
			            	}
			            	
			           		break;
	                    // What to do in the other cases
	                    default:
	                    	return true;
				
			        }
			        
			        return false;
			    },
			    
			    afterForward:function(event, state) {
			    	var step = $(state.step[0]);
			        var step_id = state.step[0].id;
			        
			        // detect an algorithm transition
			    	if(step_id.indexOf("algorithm-")!=-1){
			    		var algorithm_id = step_id.substring(10);
			    		console.log(algorithm_id)
			    		if($("#algorithms_list").dynamiclist("getListHandler").isAlreadyInTheList(ALGORITHM.titles[algorithm_id])){
			    			console.log(algorithm_id+" it's being selected")
			    		}
			    		else{
			    			$("#wizard-wrapper").wizard("forward",[event,1]);
			    		}
			    	}
			    },
			    
			    afterBackward:function(event, state) {
			    	var step = $(state.step[0]);
			        var step_id = state.step[0].id;
			        
			        // detect an algorithm transition
			    	if(step_id.indexOf("algorithm-")!=-1){
			    		var algorithm_id = step_id.substring(10);
			    		console.log(algorithm_id)
			    		if($("#algorithms_list").dynamiclist("getListHandler").isAlreadyInTheList(ALGORITHM.titles[algorithm_id])){
			    			console.log(algorithm_id+" it's being selected")
			    		}
			    		else{
			    			$("#wizard-wrapper").wizard("backward",[event,1]);
			    		}
			    			
			    	}
			    },
			    // Where to go in transitions
			    transitions: {
				    'matrix_creation_options': function($step, action) {
					    // The branch to go changes to reflect your choice.
					    var branch = $step.find("[name=matrix_creation_options]:checked").val();
					    return branch;
				    }
			    }
	        });
       }
       
       if (action ==="results"){
    	   $("#wizard-wrapper").wizard({
		        stepsWrapper: "#steps_wrapper",
		        
		        forward: ".forward",
		        
		        backward: ".backward"
    	   });
       }
	}
	
	
	return {
		setup_wizard:setup_wizard
	};
}());