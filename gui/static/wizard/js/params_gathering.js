function fulfills_dependencies(field_id, parameter_description){
	var fulfilled = true;
	if( typeof parameter_description.depends_on !== "undefined" ){
		for (var depends_on_this_field in parameter_description.depends_on){
			var field = find_target_field(depends_on_this_field);
			console.log("PARAMETER UNDER CHECK:",field_id, "OVER",parameter_description.depends_on,field);
			for (var i =0; i < parameter_description.depends_on[depends_on_this_field].length; i++){
				
				var dependency = parameter_description.depends_on[depends_on_this_field][i];
				console.log("DEPENDENCY",dependency);
				var dependency_type = Object.keys(dependency)[0];
				var dependency_value = dependency[dependency_type];
				
				switch(dependency_type){
				
					case "exists":
						fulfilled = fulfilled && (field !== "undefined") &&(field.length > 0) === dependency_value;
						console.log("exists",fulfilled)
						break;
						
					case "value":
						console.log(PARAMETER_DESCRIPTORS.descriptors[depends_on_this_field])
						fulfilled = fulfilled &&  
						(get_value_of(
								find_target_field(depends_on_this_field), 
								PARAMETER_DESCRIPTORS.descriptors[depends_on_this_field].type) === dependency_value);
						break;
						
					default:
						fulfilled = fulfilled &&  false;
				}
			}
		}
		console.log("checking ", field_id, fulfilled);
	}
	return fulfilled;
}

function get_default_value(default_field){
	
	if (default_field === undefined){
		return undefined;
	}
	
	var default_type = Object.keys(default_field)[0];
	var default_value = default_field[default_type];
	
	switch(default_type){
		case "value":
			return default_value;
			break;
		
		case "function":
			return default_value();
			break;
		
		default:
			return undefined;
	};
}

/**
 * Generates a representation of the parameters that will be used by pyProClust
 * 
 * @returns {object} The parameters object.
 */
function create_parameters(selected_algorithms){
	var parameter_descriptions = PARAMETER_DESCRIPTORS.descriptors;
	var field = "undefined";
	var value, description;
	var parameters = {};
	var algorithm_type, parameter_parser, algorithm_field, guess_params_checkbox;
	
	// Add the action value
	set_dictionary_entry(
				parameters,
				'global:action:type'.split(":"),
				GLOBAL.selected_action);
	
	// Gather all defined parameters
	for (var id_or_name in parameter_descriptions){
		description = parameter_descriptions[id_or_name];
		if(fulfills_dependencies(id_or_name, description)){
			//Search a parameter holder
			field = find_target_field(id_or_name);
			if(field !== "undefined"){
				value = get_value_of(field, description.type);
			}
			else{
				var default_value = get_default_value(description.defaults_to);
				if (typeof default_value !== "undefined" 
					&& !is_defined(parameters,description.maps_to.split(":"))){
					value = default_value;
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
	}
	
	// Now gather algorithm's parameters from algorithm steps (if any)
	for(var i = 0; i < GLOBAL.selected_algorithms.length; i++){
		algorithm_type = ALGORITHM.titles_reverse[GLOBAL.selected_algorithms[i]];
		algorithm_field = find_target_field("algorithm-"+algorithm_type);
		
		// If the wizard step is defined...
		if (algorithm_field !== "undefined"){
			// If the parametrization step exists, we are using this algorithm
			set_dictionary_entry(
					parameters,
					["clustering","algorithms",algorithm_type,"use"],
					true);
			
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
		// Not defined are already setted by the upper loop
		/*else{
			set_dictionary_entry(
					parameters,
					["clustering","algorithms",algorithm_type,"auto"],
					true);
		}*/
	}
	
	return parameters;
}

/**
 * Sets all known fields to their default values.
 */
function set_defaults_to_fields(){
	var parameter_descriptions = PARAMETER_DESCRIPTORS.descriptors;
	var field = "undefined";
	
	// Gather all defined parameters
	for (var id_or_name in parameter_descriptions){
		description = parameter_descriptions[id_or_name];
		
		//Search a parameter holder
		field = find_target_field(id_or_name);
		if(field !== "undefined"){
			var default_value = get_default_value(description.defaults_to);
			if(typeof default_value !== "undefined"){
				set_value_of(field, 
							default_value, 
							description.type);
			}
		}
		
	}
}
