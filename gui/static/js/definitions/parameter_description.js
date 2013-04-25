function get_parameter_descriptions(){
	return {
		'action_group':{
			type:'radio',
			maps_to:'global:action:type'
		},
		
		'workspace_base':{
			type: 'text',
			maps_to:'workspace:base'
		},
		
		'workspace_results':{
			type: 'text',
			maps_to:'workspace:results',
			defaults_to:"results"
		},
		
		'trajectory_list':{
			type:'list',
			maps_to:'global:pdbs'
		},
		
		'matrix_creation_options':{
			type:'radio',
			maps_to:'matrix:method'
		},
		
		'rmsd_fit_selection':{
			type:'text',
			maps_to:'matrix:parameters:fit_selection'
		},
		
		'rmsd_calc_selection':{
			type:'text',
			maps_to:'matrix:parameters:calc_selection'
		},
		
		'dist_fit_selection':{
			type:'text',
			maps_to:'matrix:parameters:fit_selection'
		},
	
		'dist_calc_selection':{
			type:'text',
			maps_to:'matrix:parameters:body_selection'
		},
		
		'matrix_creation_path':{
			type:'text',
			maps_to:'matrix:parameters:path'
		},
		
		'evaluation_maximum_noise':{
			type:'float',
			maps_to:'evaluation:maximum_noise'
		},
	
		'evaluation_minimum_clusters':{
			type:'int',
			maps_to:'evaluation:minimum_clusters'
		},
		
		'evaluation_maximum_clusters':{
			type:'int',
			maps_to:'evaluation:maximum_clusters'
		},
		
		'evaluation_minimum_cluster_size':{
			type:'int',
			maps_to:'evaluation:minimum_cluster_size'
		},
		
		'query_list':{
			type:'list',
			maps_to:'evaluation:query_types'
		},
		
		'criteria_list':{
			type:'list:criteria',
			maps_to:'evaluation:evaluation_criteria'
		}
	}
}