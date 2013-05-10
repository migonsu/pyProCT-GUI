WIZARD.algorithms = (function () {
	var algorithm_wizard_steps = load_text_resource_with_ajax("wizard/templates/algorithm.wizard.template");
	
	var insert_algorithm_steps = function(selector_for_step_before){
		var step = null;
		var template = null;
		
		for (var clustering_algorithm in ALGORITHM.titles){
			var title = ALGORITHM.titles[clustering_algorithm];
			
			var data = {
					"id": clustering_algorithm,
					"title": title,
					"properties": ALGORITHM_PARAMETERS[clustering_algorithm]//algorithm_parameters[clustering_algorithm]
			};
			
			var template = Handlebars.compile(algorithm_wizard_steps);
			
			step = $(template(data));
			step.insertAfter($(selector_for_step_before));
			step_before = step;
		}
	}

	return {insert_algorithm_steps:insert_algorithm_steps};
	
}());




