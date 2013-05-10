var STEPS = (function(){
	
	var transitionFunctions = {};
	
	var courses = {
			"advanced":[
			            {id:"main_selection",next:"workspace-1"},
						{id:"workspace-1",next:"trajectory-1"},
						{id:"trajectory-1",next:"matrix_creation-1"},
						{id:"matrix_creation-1",next:{
								id:"matrix_creation_options",
								branches:{
									"rmsd":[{id:"rmsd-1",next:"algorithms-1"}],
									"distance":[{id:"distance-1",next:"algorithms-1"}],
									"load":[{id:"load-matrix",next:"algorithms-1"}]
								}
							}
						},
						{id:"algorithms-1",next:""},
						{id:"criteria-1",next:"query-1"},
						{id:"query-1",next:"criteria-2"},
						{id:"criteria-2",next:"run-1"},
						{id:"run-1",next:""}
					],
			
			"results":[
			           {id:"workspace-1",next:"run-2"},
			           {id:"run-2",next:""}
			        ]
	};

	var navigation_html = "navigation.html";
	
	var descriptor = {
		"main_selection":{
			"title": "What's your goal?",
			"html": "main_selection.html"
		},
		"workspace-1":{
			"title": "Project's workspace:",
			"html": "workspace-1.html"
		},
		"trajectory-1":{
			"title": "Add the trajectories you want to work with:",
			"html": "trajectory-1.html"
		},
		"matrix_creation-1":{
			"title": "Choose how do you want to obtain the matrix:",
			"html": "matrix_creation-1.html"
		},
		"rmsd-1":{
			"title": "Define the part of the molecule used for superposition:",
			"html": "rmsd-1.html"
		},
		"distance-1":{
			"title": "Define the part of the molecule used for superposition:",
			"html": "distance-1.html"
		},
		"load-matrix":{
			"title": "Choose the file to load:",
			"html": "load-matrix.html"
		},
		"algorithms-1":{
			"title": "Choose the algorithms that you want to use:",
			"html": "algorithms-1.html"
		},
		"criteria-1":{
			"title": "Define clustering's desired properties:",
			"html": "criteria-1.html"
		},
		"query-1":{
			"title": "Which information do you want to get from the clustering?",
			"html": "query-1.html"
		},
		"criteria-2":{
			"title": "Which criteria do you want to use?",
			"html": "criteria-2.html"
		},
		"run-1":{
			"title": "Go!",
			"html": "run-1.html"
		},
		"run-2":{
			"title": "Go!",
			"html": "run-2.html"
		}
	};

	return {
		courses:courses,
		descriptor:descriptor,
		navigation_html:navigation_html
	}
	
}());
