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
	
	// Gather all defined parameters
	for (var id_or_name in parameter_descriptions){
		description = parameter_descriptions[id_or_name];
		
		//Search a parameter holder
		field = find_target_field(id_or_name);
		if(field !== "undefined"){
			value = get_value_of(field, description.type);
		}
		else{
			console.log("Is ",description.maps_to ,"already defined?", is_defined(parameters,description.maps_to.split(":")))
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
	console.log(selected_algorithms);
	for(var i = 0; i < selected_algorithms.length; i++){
		algorithm_type = clustering_algorithm_title_reverse[selected_algorithms[i]];
		set_dictionary_entry(
				parameters, 
				["clustering","algorithms",algorithm_type,"use"],
				true);
		parameter_parser = get_algorithm_parameter_parsers(algorithm_type);
		algorithm_field = find_target_field("algorithm-"+algorithm_type);
		// Do we want pyProClust to calculate the parameters itself?
		guess_params_checkbox = algorithm_field.find("#guess_params_"+algorithm_type);
		if(!guess_params_checkbox.is(":checked")){
			set_dictionary_entry(
					parameters, 
					["clustering","algorithms",algorithm_type,"parameters"],
					parameter_parser(algorithm_field));
		}
	}
	
	return parameters;
}


function set_defaults_to_fields(){
	var parameter_descriptions = get_parameter_descriptions();
	var field = "undefined";
	
	// Gather all defined parameters
	for (var id_or_name in parameter_descriptions){
		description = parameter_descriptions[id_or_name];
		
		//Search a parameter holder
		field = find_target_field(id_or_name);
		if(field !== "undefined"){
			console.log("ID ",id_or_name);
			if(typeof description.defaults_to !== "undefined"){
				set_value_of(field, 
							description.defaults_to, 
							description.type);
			}
		}
		
	}
}
