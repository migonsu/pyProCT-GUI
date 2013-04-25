
function generate_wizard_algorithm_steps(step_before, clustering_algorithm_titles, algorithm_parameters, template){
	for (clustering_algorithm in clustering_algorithm_titles){
		var title = clustering_algorithm_titles[clustering_algorithm];
		console.log("*"+title);
		
		var step = $(get_contents_for(
				title, 
				clustering_algorithm, 
				algorithm_parameters, 
				template));
		
		step.insertAfter(step_before);
		
		step_before = step;
	}
}

/*
    Uses the template to create one of the clustering algorithm fields.
*/
function get_contents_for(title, clustering_algorithm, algorithm_parameters, template_contents){
    
    var data = {
        "id": clustering_algorithm,
        "title": title,
        "properties":algorithm_parameters[clustering_algorithm]
    };
           
    var template = Handlebars.compile(template_contents);
    return template(data);
}



