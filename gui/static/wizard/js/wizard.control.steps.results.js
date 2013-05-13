WIZARD.control = (function(module){
	
	if (typeof module.functions === "undefined"){
		module.functions = {};
	}
	
	module.functions[MAIN_MENU.RESULTS_ACTION] = {
		'browse-results-1':function(event, state, step, step_id){
			var file_path = step.find("#results_folder").val();
			if(file_path!=""){
				var file_check  = COMM.synchronous.file_exists(file_path);

				if(file_check["exists"]){
					// Check the existence of "results.json"
					var file_check  = COMM.synchronous.file_exists(file_path+"/results.json");
					if(file_check["exists"]){
						var results = COMM.synchronous.load_text_resource(file_path+"/results.json");
					}
				}
				else{
					return false;
				}
			}
			else{
				DIALOG.warning ("The field cannot be empty.");
				return false;
			}
		}
	};
	
	return module;
	
}(WIZARD.control));