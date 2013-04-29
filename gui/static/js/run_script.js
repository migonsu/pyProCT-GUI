/**
 *
 **/
function ajax_run_script(parameters){
    $.ajax({
          url: "/run",
          type: "POST",
          data: JSON.stringify(parameters),
          dataType: "text",
          
          complete: function(jqXHR, textStatus){
        	  setTimeout(function(){start_monitoring_run();},5000);
          },
          
          error:function( jqXHR, textStatus, errorThrown ){
              alert( "***Request failed: " + textStatus+". Is the server working?" );
          }
        });
}       


function start_monitoring_run(){
	$.ajax({
        url: "/run_update_status",
        type: "POST",
        dataType: "text",
        complete: function(jqXHR, textStatus){
            var my_response_object =  $.parseJSON(jqXHR.responseText);
            console.log(my_response_object);
            if (my_response_object["lol"] != -1)
            setTimeout(function(){start_monitoring_run();},3000);
        },
        
        error:function( jqXHR, textStatus, errorThrown ){
            alert( "Request failed: " + textStatus+". Is the server working?" );
        }
      });
}
