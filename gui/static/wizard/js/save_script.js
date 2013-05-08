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
			var my_response_object =  $.parseJSON(jqXHR.responseText);
			window.location.href = "/serve_file?path="+my_response_object.file_url+"&filename=parameters.json"
		},
		error:function( jqXHR, textStatus, errorThrown ){
			alert( "Request failed: " + textStatus+". Is the server working?" );
		}
	});
}       
