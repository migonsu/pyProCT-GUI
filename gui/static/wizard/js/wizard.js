var WIZARD = (function(){
	
	var algorithm_wizard_step_template = load_text_resource_with_ajax("wizard/templates/algorithm.wizard.template");
	var step_template = load_text_resource_with_ajax("wizard/templates/step.wizard.template");

	function insert_wizard_step(holder_selector, step){
		var inner_html = load_text_resource_with_ajax("wizard/wizard.steps/"+step["html"]);
		step["inner_html"] = new Handlebars.SafeString(inner_html);
		var template = Handlebars.compile(step_template);
		$(holder_selector).append(template(step));
	};
	
	function insert_navigation (holder_selector){
		var inner_html = load_text_resource_with_ajax("wizard/wizard.steps/"+STEPS.navigation_html);
		$(holder_selector).append(inner_html);
	}
	
	var create_branch_course = function(holder_selector, branch_descriptor){
		var step_descritor = null;
		var id = "";
		var next_branch_descriptor = null;
		var new_holder = null;
		for(var i = 0; i < branch_descriptor.length; i++){
			step_id = branch_descriptor[i]["id"];
			step_descriptor = STEPS.descriptor[step_id];
			step_descriptor["step_id"] = step_id;
			if ( typeof branch_descriptor[i]["next"] === "string"){
				step_descriptor["next_id"] = branch_descriptor[i]["next"];
				insert_wizard_step(holder_selector, step_descriptor);
			}
			else{
				next_branch_descriptor = branch_descriptor[i]["next"];
				step_descriptor["next_id"] = next_branch_descriptor["id"];
				insert_wizard_step(holder_selector, step_descriptor);
				for(branch_id in next_branch_descriptor["branches"]){
					$(holder_selector).append("<div class='branch' id='"+branch_id+"'> </div>");
					create_branch_course("#"+branch_id, 
							next_branch_descriptor["branches"][branch_id]);
				}
			}
		}
	};
	
	var generate_wizard_course = function(holder_selector, option){
		create_branch_course(holder_selector, STEPS.courses[option]);
		insert_navigation(holder_selector);
	};
	
	return {
		generate_wizard_course:generate_wizard_course
	}
	
}());