WIZARD.control = (function(){
	var selected_algorithms = [];
	
	var setup_wizard = function(action){
        console.log("creating wizard for action", action);
       if (action === MAIN_MENU.ADVANCED_ACTION){ 
    	   // Add the algorithm steps 
    	   WIZARD.algorithms.insert_algorithm_steps("#algorithms-1");
    	   
    	   // Initialize wizard, set transition functions etc
	        $("#wizard-wrapper").wizard({
		        stepsWrapper: "#steps_wrapper",
		        
		        forward: ".forward",
		        
		        backward: ".backward",
		
			    onForwardMove: function(event, state) {	
			        
			    	var step = $(state.step[0]);
			        var step_id = state.step[0].id;
			        
			        console.log(step_id)
			        var transition_function = WIZARD.control.functions[action][step_id];
			        if(typeof transition_function !== "undefined"){
			        	transition_function(event, state, step, step_id);
			        }
			        else{
			        	// if it does not exist, then it returns true as default.
			        	return true;
			        }
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
       
       if (action ===MAIN_MENU.RESULTS_ACTION){
    	   $("#wizard-wrapper").wizard({
		        stepsWrapper: "#steps_wrapper",
		        
		        forward: ".forward",
		        
		        backward: ".backward",
		        
		        onForwardMove: function(event, state) {	
			        
			    	var step = $(state.step[0]);
			        var step_id = state.step[0].id;
			        
			        console.log(step_id)
			        console.log("LOL",WIZARD.control.functions[action])
			        var transition_function = WIZARD.control.functions[action][step_id];
			        if(typeof transition_function !== "undefined"){
			        	transition_function(event, state, step, step_id);
			        }
			        else{
			        	// if it does not exist, then it returns true as default.
			        	return true;
			        }
			    }
    	   });
       }
	}
	
	
	return {
		setup_wizard:setup_wizard
	};
}());