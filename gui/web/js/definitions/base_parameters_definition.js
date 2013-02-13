function define_base_parameters(){
console.log(load_text_resource_with_ajax("/shared_definitions/base_parameters.json"))
    return $.parseJSON(load_text_resource_with_ajax("/shared_definitions/base_parameters.json"));
}

function define_base_parameter_types(){
    return $.parseJSON(load_text_resource_with_ajax("/shared_definitions/base_parameter_types.json")); 
}
