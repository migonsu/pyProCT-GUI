var COMM = (function(){
		var sync = {
				
				file_exists : function(location){
					var response = undefined;
					$.ajax({
					      url: "/file_exists",
					      type: "POST",
					      data: JSON.stringify({'location':location}),
					      dataType: "text",
					      async: false,
					      
					      complete: function(jqXHR, textStatus) {
					          response =  $.parseJSON(jqXHR.responseText);
					      },
					      
					      error:function( jqXHR, textStatus, errorThrown ){
					          alert( "Request failed: " + textStatus+". Is the server working?" );
					          response = {'exists':false,'isfile':false};
					      }
					    });
					return response;
				},
				
				create_folder : function(location){
					var response = undefined;
				    $.ajax({
				      url: "/create_directory",
				      type: "POST",
				      data: JSON.stringify({'location':location}),
				      dataType: "text",
				      async: false,
				      complete: function(jqXHR, textStatus) {
				          console.log(jqXHR.responseText)
				          response = $.parseJSON(jqXHR.responseText);
				      },
				      
				      error:function( jqXHR, textStatus, errorThrown ){
				          alert( "Request failed: " + textStatus+". Is the server working?" );
				          response = {'done':false};
				      }
				    });
				    console.log(response)
				    return response;
				},
				
				trigger_results_page: function (parameters, dialog_id){
					$.ajax({
			     		url: "/show_results",
			     		type: "POST",
			     		dataType: "text",
			     		async: false,
			     		data: JSON.stringify(parameters),
			     		complete: function(jqXHR, textStatus) {
					          response =  jqXHR.responseText;
					          console.log("TODO: add fallback function in case of recoverable error.")
			     		},
			     		error:function(jqXHR, textStatus, errorThrown){
			     			alert( "Request failed: " + textStatus+". Is the server working?" );
			     		}
			        });
				},
				
				/**
				 *   Loads a system resource, returning its contents. The function does not finish
				 *   until the contents have been loaded.
				 *
				 *   @param {string} resource path to the resource to be loaded.
				 *
				 *   @returns {string} The contents of the resource.    
				 **/
				load_text_resource: function load_text_resource_with_ajax(resource){
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

		};
		
		var async = {
				run_pyproclust:	function (parameters){
					
					function start_monitoring_run( progress_dialog, parameters){
						$.ajax({
							url: "/run_update_status",
							type: "POST",
							dataType: "text",
							complete: function(jqXHR, textStatus){
							    var my_response_object =  $.parseJSON(jqXHR.responseText);
							    console.log(my_response_object);
							    if (my_response_object["status"] == "Ended"){
							    	// Then destroy the dialog
							    	progress_dialog.dialog("destroy");
							    	// Create the results dialog
							    	show_results_dialog(parameters["workspace"],true);
							    }
							    else{
							    	// Capture Status
							    	progress_dialog.find("#status_label").text(my_response_object["status"]);
							    	progress_dialog.find("#progress_bar").progressbar("value",my_response_object["value"]);
							    	setTimeout(function(){
							    		start_monitoring_run(progress_dialog, parameters);
							    		},
							    		3000);
							    }
							},
							
							error:function( jqXHR, textStatus, errorThrown ){
							    alert( "Request failed: " + textStatus+". Is the server working?" );
							}
						});
					};
					
				    $.ajax({
				          url: "/run",
				          type: "POST",
				          data: JSON.stringify(parameters),
				          dataType: "text",
				          
				          complete: function(jqXHR, textStatus){
				        	  var progress_dialog = $("<div title='Progress' id = 'progress_dialog'>" +
				        	  		"<span id='status_label'>Initializing... </span></br>"+
				        		    "<div id = 'progress_bar' style='width:250px;'>"+
				        			"</div></div>")
				        	       .dialog({
				                       modal:true,
				                       autoResize:true,
				                       width:'auto',
					       	           buttons: [
				       	                        { 
				       	                            text: "Cancel",
				       	                            click: function() {
				       	                            	$("body").append("<div id='spinner_progress'>");
				       	                            	
				       	                            	var opts = {
															  lines: 9, // The number of lines to draw
															  length: 13, // The length of each line
															  width: 4, // The line thickness
															  radius: 12, // The radius of the inner circle
															  corners: 1, // Corner roundness (0..1)
															  rotate: 12, // The rotation offset
															  direction: 1, // 1: clockwise, -1: counterclockwise
															  color: '#000', // #rgb or #rrggbb
															  speed: 1, // Rounds per second
															  trail: 67, // Afterglow percentage
															  zIndex: 20000000000,
															  shadow: false, // Whether to render a shadow
															  hwaccel: false, // Whether to use hardware acceleration
															  className: 'spinner', // The CSS class to assign to the spinner
				       	                            	};
				       	                            	
				       	                            	$("#spinner_progress").spin(opts);
				       	                            	$("#spinner_progress").center();
				       	                            	$.ajax({
				       	                                 url: "/stop_calculations",
				       	                                 type: "POST",
				       	                                 async:true,
				       	                                 complete: function(jqXHR, textStatus){
				       	                                	 var response = jqXHR.responseText;
				       	                                	 console.log("RESPONSE", response);
				       	                                	 if(response == "OK"){
				       	                                		 warning_dialog("Process succesfully terminated.");
				       	                                		 $("#progress_dialog").dialog("destroy");
				       	                                	 }
				       	                                	 else{
				       	                                		warning_dialog("It was impossible to terminate the calculation process. Please try again.");
				       	                                	 }
				       	                                	 $("#spinner_progress").spin(false);
				       	                                	 $("body").remove("#spinner_progress")
				       	                                 }
				       	                            	});
				       	                            }
				       	                        }
					       	            ]
				        	       });
				        	  $( "#progress_bar" ).progressbar({ value: false});
				        	  $( ".ui-dialog-titlebar-close").remove();
				        	  setTimeout(function(){start_monitoring_run(progress_dialog, parameters);},5000);
				          },
				          
				          error:function( jqXHR, textStatus, errorThrown ){
				              alert( "***Request failed: " + textStatus+". Is the server working?" );
				          }
				        });
				},
				
				download_script: function (parameters){
					console.log("saving");
					$.ajax({
						url: "/save_params",
						type: "POST",
						data: JSON.stringify(parameters),
						dataType: "text",
						complete: function(jqXHR, textStatus){
							var my_response_object =  $.parseJSON(jqXHR.responseText);
							window.location.href = "/serve_file?path="+my_response_object.file_url+"&filename=parameters.json"
						},
						error:function( jqXHR, textStatus, errorThrown ){
							alert( "Request failed: " + textStatus+". Is the server working?" );
						}
					});
				}     
		};
		
		
		
		return {
			synchronous: sync,
			asynchronous: async
		}


}());