/*
    Function that parses webpage's controls' looking for needed parameters.
*/
function gather_params(clustering_algorithm_fields){
    // Pick base dictionaries for all
    var params = define_base_parameters();
    var param_types = define_base_parameter_types();
    
    // Recover all the parameters
    $(".parameter:enabled").each(function(){
        var key_list = $(this).attr('id').split("::")
        var type = get_parameters_entry(param_types,key_list, 0, "text")
        var value = get_value_of(this, type);
        set_parameters_entry(params, key_list, 0, value);
    });
    
    // Algorithms are treated separately
    var algorithms_section = params["algorithms"]
    for (var algorithm in algorithms_section){
        var clustering_params = params["algorithms"][algorithm];
        var field = clustering_algorithm_fields[algorithm];
        if(!field.attr("hidden")){
            clustering_params["use"] = true;
            clustering_params["auto"] = get_value_of(field.find("#guess_params_"+algorithm));
            if(!clustering_params["auto"]){
                try{
                    clustering_params["parameters"] = get_algorithm_parameter_parsers()[algorithm](field);
                }
                catch(error_message){
                    throw {message:error_message,field:field};
                }
            }
        }
        else{
            clustering_params["use"] = false;
        }
    }
    
    // Look for warnings
    var warnings = check_regular_params(params);
    
    return {"parameters":params, "warnings":warnings};
}

function get_parameters_entry(this_dictionary, key_list, key_index, default_value){
    if (key_index == key_list.length-1){
        if(this_dictionary[key_list[key_index]] == undefined){
            return default_value;
        }
        return this_dictionary[key_list[key_index]];
    }
    else{
        if(this_dictionary[key_list[key_index]] == undefined){
            return default_value;
        }
        return get_parameters_entry(this_dictionary[key_list[key_index]], key_list, key_index+1, default_value);
    }
}

function set_parameters_entry(this_dictionary, key_list, key_index, value){
    if (key_index == key_list.length-1){
        this_dictionary[key_list[key_index]] = value;
    }
    else{
        if(this_dictionary[key_list[key_index]] == undefined){
            this_dictionary[key_list[key_index]] = {};
        }
        set_parameters_entry(this_dictionary[key_list[key_index]],key_list, key_index+1, value);
    }
}


/**
 *
 *
 **/
function check_regular_params(params, params_description){
    var warnings = [];

    // Check that: the root folder is not empty and exists.
    try{
        var file_check = check_path(params["workspace"]["base"], "exists", "isdir", "You must specify a project root folder.", $("#global_options_field"));
        
        if(file_check["exists"]){
             warnings.push("The folder '"+params["workspace"]["base"]+"' already exists. An execution over this\
             folder will erase its contents.");
        }
    }
    catch(error_message){
        if(error_message.existence != undefined &&  !error_message.existence){
            if(!create_folder(params["workspace"]["base"])["done"]){
                throw {message:"Impossible to create folder on that location("+params["workspace"]["base"]+").", 
                        field:$("#global_options_field")};
            }
        }
    }
    
    // Check that: if we have to load a matrix, the path is not empty and file exists.
    if(params['matrix']['creation']["type"] == "load"){
        check_path(params['matrix']['path'], "exists", "isfile", "You must specify a location from where to load the matrix.", $("#matrix_calculation_field"));
    }
    
    // Check that: if we have to have to calculate the matrix by rmsd or distances, rmsd_selection is not empty.   
    if(params['matrix']['creation']['type'] == "rmsd" || 
        params['matrix']['creation']['type'] == "distance"){
        if (params['matrix']['creation']['rmsd_selection'] == ""){
            throw {
                    message:"Rmsd selection must not be empty.",
                    field:$("#matrix\\:\\:creation\\:\\:rmsd_selection")
            };
        }
    }
    
    // Check that: if we have to have to calculate distances, fit_selection is not empty.   
    if(params['matrix']['creation']['type'] == "distance"){
        if (params['matrix']['creation']["fit_selection"] == ""){
            throw {
                    message:"Fit selection must not be empty.",
                    field:$("#matrix\\:\\:creation\\:\\:fit_selection")
            };
        }
    }
    
    // Check that: if we have to save a matrix, the path is not empty and file doesn't exist.
    if(params['matrix']['save_matrix']){
        check_path(params['matrix']['store_matrix_path'], "not exists", "isfile", "You must specify a location to save the matrix.", $("#matrix_calculation_field"));
    }
    
    // Check that: trajectories are not empty and exist
    if(params['global']['pdbs'].length == 0){
        throw {message:"You need to specify at least one trajectory.", 
                                field:$("#global\\:\\:pdbs")};
    }
    else{
        for(var i =0; i<params['global']['pdbs'].length; i++ ){
            check_path(params['global']['pdbs'][i], "exists", "isfile", "You must specify a trajectory file to load.", $("#datos_trayectorias"));
        }
    }

    
    // Check that: numerical values are not NaN and > 0
    var numerical = {"control": ["number_of_processors","algorithm_scheduler_sleep_time",
                                "scoring_scheduler_sleep_time"],
                      "evaluation":["maximum_noise","minimum_cluster_size",
                                "maximum_clusters","minimum_clusters"]
    };
    
    for (var params_section in numerical){
        for (var i = 0; i < numerical[params_section].length; i++){
            var numerical_param_value = params[params_section][numerical[params_section][i]]; 
            //console.log(params_section+" "+numerical_param_value)
            if(isNaN(numerical_param_value) || numerical_param_value <= 0){
                throw {message:"Field "+numerical[params_section][i]+
                                " is not a valid numerical value.", 
                                field:$(params_section)};
            }
        }
    }

    // Check that we have at least one evaluation criteria
    if($.isEmptyObject(params['evaluation']['evaluation_criteria'])){
        throw {message:"You need to define at least one criteria to select the best clustering.", 
                                field:$("#best_clustering_field")};
    }
    
    // Check that we use at least one clustering algorithm
    var at_least_one_used = false;
    for( var algorithm_type in params['algorithms']){
        at_least_one_used = at_least_one_used || params['algorithms'][algorithm_type]["use"];
        console.log(algorithm_type+" "+params['algorithms'][algorithm_type]["use"])
    }
    if(at_least_one_used == false){
        throw {message:"You need to use at least one clustering algorithm.", 
                                field:$("#algorithms_main_field")};
    }
    
    
    return warnings;
}

/**
 *
 *
 **/
function check_path( path, check_if, target_property, empty_message, related_field){
    if(path == ""){
        throw{
                message:empty_message, 
                field:related_field
              };
    }
    else{
        var file_check  = file_exists(path);
        
        var exists_message = "";
        if(check_if == "exists"){
            if (!file_check["exists"]){
                exists_message = "The file"+path+" does not exist.";
            }
        }
        
        if(check_if == "not exists"){
            if (file_check["exists"]){
                exists_message = "The file"+path+" already exists.";
            }
        }
        
        if(!file_check["exists"]){
            throw {message:"This file ("+path+") does not exist.", 
                    field:related_field, existence:file_check["exists"]};
        }
        
        if(!file_check[target_property]){
            var message = "This location ("+path+") is pointing to a folder."
            if(target_property == "isfile"){
                message += " It must be a file.";
            }
            if(target_property == "isdir"){
                message += " It must be a directory.";
            }
            throw {message:message, field:related_field};
        }
        
        return file_check;
    }
    
}

