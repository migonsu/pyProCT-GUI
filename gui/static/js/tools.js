/**
 *   Loads a system resource, returning its contents. The function does not finish
 *   until the contents have been loaded.
 *
 *   @param {string} resource path to the resource to be loaded.
 *
 *   @returns {string} The contents of the resource.    
 **/
function load_text_resource_with_ajax(resource){
    var text_resource = "";
    
    $.ajax({
              url: resource,
              type: "GET",
              dataType: "text",
              async: false,
              
              complete: function(jqXHR, textStatus){
                  text_resource = jqXHR.responseText;
              },
              
              error:function( jqXHR, textStatus, errorThrown ){
                  alert( "Request failed: " + textStatus+". Is the server working?" );
              }
            });
            
    return text_resource;
}


/**
 *   Helper function to get the value of an undetermined control.
 *
 *   @param {string} of_this_control The control we want to get the value.
 *
 *   @param {string} type A hint of the control type.
 *
 *   @returns {string/float/int/list/object} The value of the control.    
 **/
function get_value_of(of_this_control, type){
    
    if (type == undefined){
        type = $(of_this_control).attr("type");
    }
    
    switch(type){
        case "list:float":
            return parse_list( of_this_control, parseFloat);
        
        case "list:int":
            return parse_list( of_this_control, parseInt);
            
        case "list":
        	return $(of_this_control).dynamiclist("getItems");
        	
        case "list:criteria":
        	console.log($(of_this_control).dynamiclist("getItems"));
        	
        	return parse_criteria_tags($(of_this_control).dynamiclist("getItems"));
        
        case "text":
            return $(of_this_control).val();
        
        case "checkbox":
            return $(of_this_control).is(":checked");
        
        case "radio":
        	var name = $(of_this_control).attr('name');
        	var radiobutton = $($.find("[name='"+name+"']:checked"));
            return radiobutton.attr('value');
        
        case "int":
            return parseInt($(of_this_control).val());
        
        case "float":
            return parseFloat($(of_this_control).val());
        
        default:
            return $(of_this_control).val();
    }
}

/**
 *   Parses the contents of a text control holding a list of numbers description. This list can 
 *   have two forms:
 *  - Comma separated list of numbers Ex. "1, 2, 3, 4"
 *  - Range with this form : start, end : step  Ex. "4, 14 :2"  = "4, 6, 8, 10, 12"
 *   
 *   @param {string} in_this_control The control holding the list.
 *
 *   @param {function} using_this_conversor Function that, given a string, returns its numeric 
 *   representation (Ex. parseInt)
 *
 *   @returns {list} The expected list of numbers.    
 **/
function parse_list( in_this_control, using_this_conversor){
    
    var conversor;
    var list_string = "";
    
    // Default value for conversor
    if (using_this_conversor == undefined){
        conversor = parseInt;
    }
    else{
        conversor = using_this_conversor;
    }
    
    try{
        // getting value
        list_string = $(in_this_control).val();
        
        // Remove non dot, colon digit or character 
        list_string = list_string.replace(/[^\d,.:]+/g, '');
        
        var sequence = [];
        
        // Analyze the string    
        var parts = list_string.split(":");
        if (parts.length == 2){
            // Is the description of a range i,j :step, those can only be integers
            var range_parts = parts[0].split(",");
            if( range_parts.length != 2){
                return undefined;
            }
            var i = Math.abs(parseInt(range_parts[0]));
            var j = Math.abs(parseInt(range_parts[1]));
            if( isNaN(i) || isNaN(j)){
                return undefined;
            }
            var step = parseInt(parts[1]);
            
            for(var k = i; k<j; k+=step){
                sequence.push(k);
            }
        }
        else {
            // The list is a comma-separated sequence of numbers
            var string_sequence = parts[0].split(",");
            for(var i = 0; i < string_sequence.length; i++){
            	console.log("*"+string_sequence[i]+"*");
                var value = Math.abs(conversor(string_sequence[i]));
                if(!isNaN(value)){
                    sequence.push(value);
                }
            }
        }
    } 
    catch(error_message){
        throw "There was an error while parsing this list:["+list_string+"]. Error was: "+error_mesage;
    }
    return sequence;
}

/**
 *	Given a list of string representations of criteria, creates a dictionary of objects defining them.
 *
 *	@param {list} list_of_criteria Is the list of string representations of criteria.
 *
 *	@returns {object} An object indexed by criteria name with the criteria representations.
 *
 **/
function parse_criteria_tags(list_of_criteria){
    var all_criteria = {};
    for (var i = 0; i < list_of_criteria.length; i++){
        all_criteria["criteria_"+i] = parse_one_criteria(list_of_criteria[i]);
    }
    return all_criteria;
}

/**
 *	Converts one criteria string into a criteria object.
 *
 *	@param {string} criteria String representation of a criteria (and separated list).
 *
 *	@returns {object} The object representation of that criteria.
 **/
function parse_one_criteria(criteria){
    var criterium_strings = criteria.split("and");
    var criteria = {};
    var criterium;
    
    console.log("parts",criterium_strings);
    for (var i = 0; i < criterium_strings.length; i++){
    	criterium = parse_criterium(criterium_strings[i]);
    	criteria[criterium["query"]] = {
                "action":criterium["action"],
                "weight":criterium["weight"]
    	};
    }
    return criteria;
}

/**
 *	Transforms one criterium into its object representation.
 *
 *	@param {string} criterium The criterium we want to convert.
 *
 *	@returns {object} Its object representation.
 **/
function parse_criterium(criterium_string){
	var regex = /\s*(Minimize|Maximize)\s{1}(\w*)\s{1}\(weigth:\s{1}(\d+\.\d+)\)\s*/;
	var parts = regex.exec(criterium_string);
    
	var criterium = {
    		"query": "undefined",
    		"action":"undefined",
    		"weight": 1.0
    };
    
    criterium["action"] = "undefined";
    
    if(parts[1] == "Minimize"){
        criterium["action"] = ">";
    }
    
    if(parts[1] == "Maximize"){
        criterium["action"] = "<";
    }
    criterium["query"] = parts[2];
    
    criterium["weight"] = parseFloat(parts[3]);
    
    return criterium;    
}

