var CLUSTERS = (function(){
	var clusters = [];
	var MAX_DIAMETER = 150;
	
	
	var create_main_cluster_widget = function(){
		var data = [];
		
		for (var i  = 0; i< clusters.length; i++){
			data.push([clusters[i]["id"],clusters[i]["elements"].length]);
		}
		
		$("#main_cluster_pie").jqplot([data], 
		{
			seriesColors: [ "#000000","#111111","#222222","#333333","#444444","#555555","#666666",
			                "#777777","#888888","#999999","#AAAAAA","#BBBBBB","#CCCCCC","#DDDDDD",
			                "#EEEEEE","#DDDDDD","#CCCCCC","#BBBBBB","#AAAAAA","#999999","#888888",
			                "#777777","#666666","#555555","#444444","#333333","#222222","#111111"],
			seriesDefaults: {
			        renderer: $.jqplot.PieRenderer,
			        rendererOptions:
			        {
			          sliceMargin: 3,
			          showDataLabels: false,
			          diameter:200,
			          showDataLabels: true,
			          
			        }
		    },
		    grid: {
		    	borderWidth: 0,
		    	shadow:false,
		    	background: '#ffffff',
		    }
		});
		$("#main_cluster_pie").find(".jqplot-data-label").css({"color":"#ffffff"});
		
		$("#main_cluster_pie").bind('jqplotDataClick', 
	        function (event, seriesIndex, pointIndex, data) {
				var clustering_id = data[0];
				$("#"+clustering_id).effect( "pulsate",{times:5});
				//$(event.target).effect( "transfer", { className:"transfer-effect",to: $("#"+clustering_id) }, 3000 );
	        }
	    );
		
	};
	
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
				seriesColors: [ "#bbbbcf"],
				captureRightClick:true,
				seriesDefaults: {
				        renderer: $.jqplot.PieRenderer,
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
		create_cluster_widgets:create_cluster_widgets,
		create_main_cluster_widget:create_main_cluster_widget
	};
}());