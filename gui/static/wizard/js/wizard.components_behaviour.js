WIZARD.components_behaviour = (function(){
	
	function general_widget_behaviour (){
		$("select").selectmenu();
        $(".button_widget").button();
        $(':text').not('.spinner_widget')
          .button()
          .css({
                'font' : 'inherit',
                'color' : 'inherit',
                'text-align' : 'left',
                'outline' : 'none',
                'cursor' : 'text'
        });
        $(".spinner_widget").spinner();
	}
	
	var apply_behaviour = function(action){
		general_widget_behaviour();
		switch (action){
		
			case "results":
				break;
				
			case "advanced":
				// Lists
				this.setup_trajectory_list();
				this.setup_algorithms_list();
				this.setup_queries_list();
				this.setup_criteria_list();
				
				// Buttons
				this.setup_run_button();
				this.setup_get_script_button();
				this.setup_browse_workspace_button();
				this.setup_browse_matrix_button();
				
				// Checkbox (guess params)
				this.setup_guess_params_checkbox();
				
				// Previewers
				this.setup_rmsd_previewer();
				this.setup_distance_previewer();
				break;
				
			default:
				break;
		}
		
	}
	
	return {
		apply_behaviour:apply_behaviour,
	};
	
}());