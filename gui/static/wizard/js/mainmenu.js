var MAIN_MENU = (function(){
		var CLUSTERING_ACTION = "clustering";
		var ADVANCED_ACTION =  "advanced";
		var RESULTS_ACTION = "results";
		var COMPRESS_ACTION = "compress";
		
		var currently_in_wizard = false;
		
		var buttons = [
					   {
						   id: CLUSTERING_ACTION,
						   text:"Clustering",
						   action:CLUSTERING_ACTION,
					   },
					   
		               {
		            	   id: ADVANCED_ACTION,
		            	   text:"Clustering (advanced)",
		            	   action:ADVANCED_ACTION
		               },
		               
		               {
		            	   id: COMPRESS_ACTION,
		            	   text:"Compress trajectory",
		            	   action:COMPRESS_ACTION
		               },
		               
		               {
		            	   id: RESULTS_ACTION,
		            	   text:"See results",
		            	   action:RESULTS_ACTION
			           }
		];
				
		var setup_main_menu = function(container_selector){
			for (var i = 0 ; i < buttons.length; i++){
				var button_descriptor = buttons[i];
				$(container_selector).append("<div id='"+button_descriptor.id+"' class='main_menu_button' style = 'text-align:center;'>"+button_descriptor.text+"</div></br>");
			}
			$(".main_menu_button").button();
			$(".main_menu_button").click(function(){
				console.log($(this).attr("id"))
				switch_to_wizard($(this).attr("id"));
			});
			
			$("#start_over_button").click(function(){
				start_over();
			});
		}
		
		function switch_to_wizard(action){
			WIZARD.generate_wizard_course("#steps_wrapper", action);
            WIZARD.control.setup_wizard(action);
        	WIZARD.components_behaviour.apply_behaviour(action);
        	set_defaults_to_fields();
        	$(".main_menu_window").hide();
            $(".wizard_window").show();
            currently_in_wizard = true;
		}
		
		function start_over(){
			if(currently_in_wizard){
				// Destroy wizard
				$("#wizard-wrapper").wizard("destroy");
				$("#steps_wrapper").empty();
				
				// Show the main menu again
				$(".main_menu_window").show();
				$(".wizard_window").hide();
			}
		}
		
		return {
			RESULTS_ACTION:RESULTS_ACTION,
			ADVANCED_ACTION:ADVANCED_ACTION,
			setup_main_menu:setup_main_menu
		}

}());