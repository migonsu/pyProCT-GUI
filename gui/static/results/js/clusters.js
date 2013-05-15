var CLUSTERS = (function(){
	var clusters = [];
	var MAX_DIAMETER = 150;
	
	var create_cluster_widgets = function(){
		var max_number_elements = 0;
		
		for (var i  = 0; i< clusters.length; i++){
			if(clusters[i]["elements"].length > max_number_elements){
				max_number_elements = clusters[i]["elements"].length;
			}
		}

		$("[id^='cluster_']").each(function(){
			// Change css
			$(this).css({
				width:200,
				height:200,
				float:"left",
				"margin-bottom":50
			});
			
			var cluster_descriptor = null;
			for (var i  = 0; i< clusters.length; i++){
				if (clusters[i]["id"] === $(this).attr("id")){
					cluster_descriptor = clusters[i];
					break;
				}
			}
			
			var data = [["elements",100]];
			
			$(this).jqplot([data], 
			{
				//title: cluster_descriptor["id"]+" ("+cluster_descriptor["elements"].length+" elements)",
				seriesColors: [ "#bbbbcf"],
				defaultWidth: 200,
				seriesDefaults: {
				        renderer: $.jqplot.PieRenderer,
				        lineWidth: 2.5,
				        fillAndStroke:true,
				        rendererOptions: {
				          showDataLabels: false,
				          diameter:MAX_DIAMETER * cluster_descriptor["elements"].length/max_number_elements
				        }
			    },
			    grid: {
			    	borderWidth: 0,
			    	shadow:false,
			    	background: '#ffffff',
			    }
			    
			});
			
			
		});
	};
	
	return {
		clusters:clusters,
		create_cluster_widgets:create_cluster_widgets
	};
}());