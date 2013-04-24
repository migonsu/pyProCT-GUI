/**
 *
 **/
function ajax_save_script(parameters){
	console.log("saving");
	$.ajax({
		url: "/save_params",
		type: "POST",
		data: JSON.stringify(parameters),
		dataType: "text",
		complete: function(jqXHR, textStatus){
			console.log(jqXHR.responseText)
			var my_response_object =  $.parseJSON(jqXHR.responseText);
			window.location = my_response_object.file_url;
		},
		error:function( jqXHR, textStatus, errorThrown ){
			alert( "Request failed: " + textStatus+". Is the server working?" );
		}
	});
}       
