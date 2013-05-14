/**
 * Generates a representation of the parameters that will be used by pyProClust
 * 
 * @returns {object} The parameters object.
 */
function create_parameters(selected_algorithms){
	var parameter_descriptions = get_parameter_descriptions();
	var field = "undefined";
	var value, description;
	var parameters = {};
	var algorithm_type, parameter_parser, algorithm_field, guess_params_checkbox;
	
	// Add the action value
	set_dictionary_entry(
				parameters,
				'global:action:type'.split(":"),
				MAIN_MENU.selected_action);
	
	// Gather all defined parameters
	for (var id_or_name in parameter_descriptions){
		description = parameter_descriptions[id_or_name];
		
		//Search a parameter holder
		field = find_target_field(id_or_name);
		if(field !== "undefined"){
			value = get_value_of(field, description.type);
		}
		else{
			if (typeof description.defaults_to !== "undefined" 
				&& !is_defined(parameters,description.maps_to.split(":"))){
				value = description.defaults_to;
			}
			else{
				value = "not defined";
			}
		}
		set_dictionary_entry(
				parameters, 
				description.maps_to.split(":"), 
				value);
		
	}
	
	// Now gather algorithm's parameters
	for(var i = 0; i < GLOBAL.selected_algorithms.length; i++){
		algorithm_type = ALGORITHM.titles_reverse[GLOBAL.selected_algorithms[i]];
		set_dictionary_entry(
				parameters, 
				["clustering","algorithms",algorithm_type,"use"],
				true);
		
		algorithm_field = find_target_field("algorithm-"+algorithm_type);
		
		// If the wizard step is defined...
		console.log("ALGOF", algorithm_field);
		if (algorithm_field !== "undefined"){
			// Do we want pyProClust to calculate the parameters itself?
			parameter_parser = get_algorithm_parameter_parsers(algorithm_type);
			guess_params_checkbox = algorithm_field.find("#guess_params_"+algorithm_type);
			if(!guess_params_checkbox.is(":checked")){
				set_dictionary_entry(
						parameters,
						["clustering","algorithms",algorithm_type,"parameters"],
						parameter_parser(algorithm_field));
				
				set_dictionary_entry(
						parameters,
						["clustering","algorithms",algorithm_type,"auto"],
						false);
			}
		}
		else{
			set_dictionary_entry(
					parameters,
					["clustering","algorithms",algorithm_type,"auto"],
					true);
		}
	}
	
	return parameters;
}

/**
 * Sets all known fields to their default values.
 */
function set_defaults_to_fields(){
	var parameter_descriptions = get_parameter_descriptions();
	var field = "undefined";
	
	// Gather all defined parameters
	for (var id_or_name in parameter_descriptions){
		description = parameter_descriptions[id_or_name];
		
		//Search a parameter holder
		field = find_target_field(id_or_name);
		if(field !== "undefined"){
			if(typeof description.defaults_to !== "undefined"){
				set_value_of(field, 
							description.defaults_to, 
							description.type);
			}
		}
		
	}
}
