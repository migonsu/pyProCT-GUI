var QUERIES = (function(){
	var query_types = ["NumClusters", "NumClusteredElems", "MeanClusterSize",
	                   "PercentInTop4", "PercentInTop", "ClustersTo90", "Cohesion","Separation",
	                   "NoiseLevel", "MirrorCohesion", "MinimumMeanSeparation",
	                   "Silhouette", "CythonMirrorCohesion", "CythonMinimumMeanSeparation",
	                   "CythonSilhouette", "RatioCut", "NCut",
	                   "CythonNormNCut", "NormNCut", "MinMaxCut",
	                   "PCAanalysis", "Details"];
	
	var criteria_types = ["MeanClusterSize", "CythonMirrorCohesion", "Separation",
	                      "CythonMinimumMeanSeparation",
	                      "CythonSilhouette", "RatioCut", "NCut",
	                      "CythonNormNCut", "MinMaxCut", "PCAanalysis"];

	return {
		query_types:query_types,
		criteria_types:criteria_types
	}
}());
