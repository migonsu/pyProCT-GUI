function set_parameters_entry( 	this_dictionary, 
									key_list, 
									key_index, 
									value){
	
    if (key_index == key_list.length-1){
		this_dictionary[key_list[key_index]] = value;
    }
    else{
    	
		if(this_dictionary[key_list[key_index]] == undefined){
		    this_dictionary[key_list[key_index]] = {};
		}
		
		set_parameters_entry(	this_dictionary[key_list[key_index]],
								key_list, 
								key_index+1, 
								value);
    }
}

function find_target_field(id_or_name){
	var field_by_id = $("[id='"+id_or_name+"']");
	var field_by_name = $("[name='"+id_or_name+"']");
	
	if(field_by_id.length != 0) return field_by_id;
	if(field_by_name.length != 0) return field_by_name;
	
	return "undefined";
}

function create_parameters(){
	var parameter_descriptions = get_parameter_descriptions();
	var field = "undefined";
	var value, description;
	var parameters = {};
	
	for (var id_or_name in parameter_descriptions){
		description = parameter_descriptions[id_or_name];
		
		//Search a parameter holder
		field = find_target_field(id_or_name);
		if(field !== "undefined"){
			value = get_value_of(field, description.type);
		}
		else{
			if (typeof description.defaults_to !== "undefined"){
				value = description.defaults_to;
			}
			else{
				value = "not defined";
			}
		}
		console.log("PARAM", id_or_name,value,description.maps_to.split(":"))
		set_parameters_entry(
			        		parameters, 
			        		description.maps_to.split(":"), 
			        		0, 
			        		value);
	}
	
	return parameters;
}