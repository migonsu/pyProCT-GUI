WIZARD.control = (function(module){
	
	if (typeof module.functions === "undefined"){
		module.functions = {};
	}
	
	module.functions[MAIN_MENU.RESULTS_ACTION] = {
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
		}
	};
	
	return module;
	
}(WIZARD.control));