WIZARD.control = (function(module){
	
	if (typeof module.functions === "undefined"){
		module.functions = {};
	}
	
	module.functions[MAIN_MENU.RESULTS_ACTION] = {
		'workspace-1':function(event, state, step, step_id){
			var file_path = step.find("#workspace_base")
			.val();
			if(file_path!=""){
				var file_check  = COMM.synchronous.file_exists(file_path);

				if(file_check["exists"]){
					return true;
				}
				else{
					DIALOG.yes_or_no (
							"Warning",
							"Folder does not exist, do you want to create it?",
							function(){
								COMM.synchronous.trigger_results_page(file_path);
								$("#wizard-wrapper").wizard("forward",[event,1]);
							});
				}
			}
			else{
				DIALOG.warning ("The field cannot be empty.");
			}
			return false;
		}
	};
	
	return module;
	
}(WIZARD.control));