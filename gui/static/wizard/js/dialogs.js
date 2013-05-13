var DIALOG = (function(){
	
	
	 var yes_or_no = function(dialog_title, message, ok_function_callback){
    
	    $("<div/>", { 
	    	id:'yes_or_no_dialog',
	    	title: dialog_title,
	    	html:message})
	    .dialog(
	            {
	                modal:true, 
	                autoResize:true,
	                width:'auto',
	                close: function( event, ui ){
	                    $(this).dialog("destroy");
	            },
	            buttons: [
	                        { 
	                            text: "Yes",
	                            click: function() { 
	                            	ok_function_callback();
	                                $(this).dialog("destroy");
	                            }
	                        },
	                        {
	                            text: "No",
	                            click: function() { 
	                                $(this).dialog("destroy");
	                            }    
	                        }
	            ]
	    });
	}
	 
	 var warning = function (message){
		    $("<div/>", { 
		    	id: 'warning_dialog',
		    	title: 'Warning',
		    	html: message})
		    .dialog({
		                modal:true, 
		                autoResize:true,
		                width:'auto',
		                close: function( event, ui ){
		                    $(this).dialog("destroy");
		                },
		                buttons: [{ 
		                            text: "Ok",
		                            click: function() { 
		                            	$(this).dialog("destroy")
		                            }
		                }]
		    });
		}
	
	 var last_root = ".";
	 
	 var browse = function (target, ok_callback){
		    var what_we_search = target;
			var expected_extension = "";
		    if(target.substring(0,4) == "file"){
		    	var parts = target.split("::");
		    	if(parts.length>1){
		    		target = parts[0];
		    		expected_extension = parts[1];
		    		what_we_search = target +" (" +expected_extension+")";
		    	}
		    }
		    // If we have done a last search, then this will be our starting point.
		    var root = last_root;
		    
			$("<div title='Select a "+what_we_search+"' id = 'browse_dialog'>\
	        <div class = 'fileBrowserHeader'>\
            <span> Current selection:</span></br>\
            <div id='selected_file_or_folder' class='fileBrowserSelection'> </div>\
	        </div> <div id = 'browsing_area' class='fileBrowserWrapper'>\
	        </div>\
	        <div style='margin-top:10px;'> Current root:</div></br>\
			<div id='root' class='fileBrowserSelection'>"+ DIALOG.last_root +"</div>\
	        </div>")
		    .dialog({
		                modal:true, 
		                autoResize:true,
		                width:'auto',
		                close: function( event, ui ){
		                    $(this).dialog("destroy");
		                },
			            buttons: [
			                        { 
			                            text: "Ok",
			                            click: function() { 
			                            	ok_callback($("#selected_file_or_folder").text());
			                                $(this).dialog("destroy");
			                            }
			                        },
			                        {
			                            text: "Cancel",
			                            click: function() { 
			                                $(this).dialog("destroy");
			                            }
			                        }
			            ]
		    });
		    
		    $('.ui-dialog button:nth-child(1)').button('disable');
		    
		    $("#browsing_area").fileTree({ 
                    root: last_root,
                    script: "/browse_folder" 
                }, 
                function(url,file_type) {
					$("#selected_file_or_folder").text(url);
					// Check extension
					var extension = url.split('.').pop();
					if(target == file_type){
						if(expected_extension=="" || expected_extension == extension){
							$('.ui-dialog button:nth-child(1)').button('enable');
							// Change last root
							DIALOG.last_root = url.substr(0,url.lastIndexOf("/"));
						}
					}
					else{
					    $('.ui-dialog button:nth-child(1)').button('disable');
					}
					
                }   
		    );
	 };
	 
	return {
		yes_or_no:yes_or_no,
		warning: warning,
		browse: browse,
		last_root:last_root
	}

}());


