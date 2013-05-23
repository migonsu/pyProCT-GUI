var PARAMETER_DESCRIPTORS = (function (){
		return{
			descriptors: {
					'action_parameters':{
						type:'radio',
						maps_to:'global:action:parameters',
						defaults_to: {"value": {}}
					},
					
					'workspace_base':{
						type: 'text',
						maps_to:'workspace:base'
					},
					
					'workspace_results':{
						type: 'text',
						maps_to:'workspace:results',
						defaults_to: {"value": "results"}
					},
					
					'workspace_tmp':{
						type: 'text',
						maps_to:'workspace:tmp',
						defaults_to: {"value": "tmp"}
					},
					
					'workspace_refinement':{
						type: 'text',
						maps_to:'workspace:refinement',
						defaults_to: {"value": "refinement"}
					},
					
					'workspace_clusterings':{
						type: 'text',
						maps_to:'workspace:clusterings',
						defaults_to: {"value": "clusterings"}
					},
					
					'workspace_matrix':{
						type: 'text',
						maps_to:'workspace:matrix',
						defaults_to: {"value": "matrix"}
					},
					
					'trajectory_list':{
						type:'list',
						maps_to:'global:pdbs'
					},
					
					'matrix_creation_options':{
						type:'radio',
						maps_to:'matrix:method'
					},
					
					'matrix_save_path':{
						type:'text',
						maps_to:'matrix:filename',
						defaults_to: {"value": "matrix"}
							
					},
					
					'rmsd_fit_selection':{
						type:'text',
						maps_to:'matrix:parameters:fit_selection',
						defaults_to: {"value":  "name CA"}
					},
					
					'rmsd_calc_selection':{
						type:'text',
						maps_to:'matrix:parameters:calc_selection'
					},
					
					'dist_fit_selection':{
						type:'text',
						maps_to:'matrix:parameters:dist_fit_selection'
					},
				
					'dist_calc_selection':{
						type:'text',
						maps_to:'matrix:parameters:body_selection'
					},
					
					'matrix_creation_path':{
						type:'text',
						maps_to:'matrix:parameters:path'
					},
					
					"matrix_calculator":{
						type:'text',
						maps_to:'matrix:parameters:calculator_type',
						defaults_to: {"value":  "QCP_OMP_CALCULATOR"}
					},
					
					'evaluation_maximum_noise':{
						type:'float',
						maps_to:'evaluation:maximum_noise',
						defaults_to: {"value":  15.0}
					},
				
					'evaluation_minimum_clusters':{
						type:'int',
						maps_to:'evaluation:minimum_clusters',
						defaults_to: {"value":  10}
					},
					
					'evaluation_maximum_clusters':{
						type:'int',
						maps_to:'evaluation:maximum_clusters',
						defaults_to: {"value":  30}
					},
					
					'evaluation_minimum_cluster_size':{
						type:'int',
						maps_to:'evaluation:minimum_cluster_size',
						defaults_to: {"value":  50}
					},
					
					'query_list':{
						type:'list',
						maps_to:'evaluation:query_types',
						defaults_to: {"value": ["NumClusters","NoiseLevel"]}
					},
					
					'criteria_list':{
						type:'list:criteria',
						maps_to:'evaluation:evaluation_criteria',
						defaults_to: {"value":  {
										"criteria_0": { "CythonSilhouette":{"action": ">","weight": 0.9},
			                                         	"PCAanalysis":{"action": "<","weight": 1},          
			                                         	"CythonNormNCut":{"action": ">","weight": 0.3}
										},
										"criteria_1": {	"CythonSilhouette":{"action": ">","weight": 0.8},
														"PCAanalysis":{"action": "<","weight": 1},
														"CythonMirrorCohesion":{"action": ">","weight": 0.2},
														"CythonNormNCut":{"action": ">","weight": 0.1}
										}
							}
						}
					},
					
			//		
			//		ALGORITHMS
			//		
					'gromos_algorithm_default_use':{
						maps_to:'clustering:algorithms:gromos:use',
						defaults_to: {"value":  false}
					},
					
					'guess_params_gromos':{
						maps_to:'clustering:algorithms:gromos:auto',
						defaults_to: {"value":  true}
					},
					
					'hierarchical_algorithm_default_use':{
						maps_to:'clustering:algorithms:hierarchical:use',
						defaults_to: {"value":  false}
					},
					
					'guess_params_hierarchical':{
						maps_to:'clustering:algorithms:hierarchical:auto',
						defaults_to: {"value":  true}
					},
					
					'kmedoids_algorithm_default_use':{
						maps_to:'clustering:algorithms:kmedoids:use',
						defaults_to: {"value":  false}
					},
					
					'guess_params_kmedoids':{
						maps_to:'clustering:algorithms:kmedoids:auto',
						defaults_to: {"value":  true}
					},
					
					'spectral_algorithm_default_use':{
						maps_to:'clustering:algorithms:spectral:use',
						defaults_to: {"value":  false}
					},
					
					'spectral_algorithm_sigma':{
						maps_to:'clustering:algorithms:spectral:sigma',
						defaults_to: {"value":  1.0}
					},
					
					'guess_params_spectral':{
						maps_to:'clustering:algorithms:spectral:auto',
						defaults_to: {"value":  true}
					},
					
					'dbscan_algorithm_default_use':{
						maps_to:'clustering:algorithms:dbscan:use',
						defaults_to: {"value":  false}
					},
					
					'guess_params_dbscan':{
						maps_to:'clustering:algorithms:dbscan:auto',
						defaults_to: {"value":  true}
					},
					
					'random_algorithm_default_use':{
						maps_to:'clustering:algorithms:random:use',
						defaults_to: {"value":  false}
					},
					
					'guess_params_random':{
						maps_to:'clustering:algorithms:random:auto',
						defaults_to: {"value":  true}
					},
					
			//		
			//		CONTROL
			//		
					'number_of_processors':{
						maps_to:'clustering:control:number_of_processors',
						defaults_to: {"value":  4}
					},
					
					'algorithm_scheduler_sleep_time':{
						maps_to:'clustering:control:algorithm_scheduler_sleep_time',
						defaults_to: {"value":  5}
					},
					
					'evaluation_scheduler_sleep_time':{
						maps_to:'clustering:control:evaluation_scheduler_sleep_time',
						defaults_to: {"value":  30}
					},
			//		
			//		CLUSTERING GENERATION
			//			
					'clustering_generation_method':{
						type:'radio',
						maps_to:'clustering:generation:method',
						defaults_to: {"value":  "generate"}
					},
					
					'clustering_loading_path':{
						type: 'string',
						depends_on: {'clustering_generation_method':[{"exists":true},{"value":"load"}]},
						defaults_to: {"function":function(){return GLOBAL.loaded_clustering;}},
						maps_to: 'clustering:generation:cluster',
					},
					
					'final_frames':{
						type: 'int',
						defaults_to: {"value": 0}
					}
					
				},
				
		};
}());