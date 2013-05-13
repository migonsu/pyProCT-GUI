function browsing_dialog(target, ok_callback){
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
    
	$("<div title='Browse' id = 'browse_dialog'>\
        <div class = 'fileBrowserHeader'>\
            <label for='selected_file_or_folder'> Select a "+what_we_search+":</label></br>\
            <div id='selected_file_or_folder' class='fileBrowserSelection'>   </div>\
        </div>\
        <div id = 'browsing_area' class='fileBrowserWrapper'>\
        </div>\
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
                                    root: '.',
                                    script: "/browse_folder" 
                        }, 
                        function(url,file_type) {
                            $("#selected_file_or_folder").text(url);
                            // Check extension
                            var extension = url.split('.').pop();
                            console.log(extension+" "+expected_extension+" "+target +" "+ file_type);
                            if(target == file_type){
                            	if(expected_extension=="" || expected_extension == extension){
                            		$('.ui-dialog button:nth-child(1)').button('enable');
                            	}
                            }
                            else{
                                $('.ui-dialog button:nth-child(1)').button('disable');
                            }
                        }   
    );
}


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
	
	return {
		yes_or_no:yes_or_no,
		warning: warning
	}

}());


