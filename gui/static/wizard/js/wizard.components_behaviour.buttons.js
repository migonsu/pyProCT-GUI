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
        	var parameters = create_parameters([]);
        	show_results_dialog(parameters["workspace"], false);
        });
	}
	
	module.setup_browse_workspace_button = function(){  
	    $("#browse_project_folder_button").click(function(){
	        var callback = function(value){
	        	$("#workspace_base").val(value);
	        };
	    	browsing_dialog("folder", callback);
	    });
	}
	
	module.setup_browse_matrix_button = function(){  
	    $("#browse_matrix_button").click(function(){
	            var callback = function(value){
	            	$("#matrix_creation_path").val(value);
	            };
	        	browsing_dialog("file::npy", callback);
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