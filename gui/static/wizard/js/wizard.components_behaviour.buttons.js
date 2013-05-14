WIZARD.components_behaviour = (function(module){
	
	module.setup_run_button = function(){
		$("#run_button").button("option", "icons",{primary:"ui-icon-gear"});
        $("#run_button").click(function(){
        	var parameters = create_parameters(selected_algorithms);
        	COMM.asynchronous.run_pyproclust(parameters);
        });
	}
	
	module.setup_get_script_button = function(){
        $("#script_button").button("option", "icons",{primary:"ui-icon-disk"});
        $("#script_button").click(function(){
        	var parameters = create_parameters(selected_algorithms);
        	COMM.asynchronous.download_script(parameters);
        });
	}
	
	module.setup_show_results_button = function(){
        $("#show_results_button").click(function(){
        	var results_path = get_value_of($("#results_folder"))+"/results.json";
        	var results = $.parseJSON(COMM.synchronous.load_external_text_resource(results_path));
        	
        	// Look for parameters file
        	var params_file_path = "";
        	console.log(results["files"])
        	for (var i =0; i < results["files"].length; i++){
        		if(results["files"][i]["description"] === "Parameters file"){
        			params_file_path = results["files"][i]["path"];
        		}
        	}
        	console.log("PARAMS FILE PATH", params_file_path)
        	var parameters = $.parseJSON(COMM.synchronous.load_external_text_resource(params_file_path));
        	console.log("PARAMS", parameters)
        	
        	COMM.synchronous.trigger_results_page(parameters["workspace"]);
        });
	}
	
	
	function browsing_common(type, input_id){
		var callback = function(value){
        	console.log("DIALOG.last_root",DIALOG.browsing.last_root)
        	var abs_path = COMM.synchronous.absolute_path(DIALOG.browsing.last_root); 
        	DIALOG.browsing.last_root = abs_path;
        	$("#"+input_id).val(abs_path);
        };
    	DIALOG.browsing.browse(type, callback);
	}
	
	module.setup_browse_results_folder_button = function(){
	    $("#browse_results_folder_button").click(function(){
	    	browsing_common("folder","results_folder");
	    });
	}
	
	module.setup_browse_workspace_button = function(){
	    $("#browse_project_folder_button").click(function(){
	    	browsing_common("folder","workspace_base");
	    });
	}
	
	module.setup_browse_matrix_button = function(){  
	    $("#browse_matrix_button").click(function(){
	    	browsing_common("file::npy","matrix_creation_path");
	     });
	}
	
	module.setup_guess_params_checkbox = function(){
        $("[name='guess_params']").each(function(){
        	$(this).parent().find("label[id!='guess_label']").addClass("disabled");
    		$(this).parent().find(":text").button("disable");
    		$(this).parent().find("select").selectmenu('disable');
        });
        
        $("[name='guess_params']").click(function(){
        	if($(this).is(":checked")){
        		$(this).parent().find("label[id!='guess_label']").addClass("disabled");
        		$(this).parent().find(":text").button("disable");
        		$(this).parent().find("select").selectmenu('disable');
        	}
        	else{
        		$(this).parent().find("label").removeClass("disabled");
        		$(this).parent().find(":text").button('enable');
        		$(this).parent().find("select").selectmenu('enable');
        	}
        });
	}
	
	return module;
	
}(WIZARD.components_behaviour));