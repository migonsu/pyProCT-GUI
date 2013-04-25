/**
 * Queries if a remote path exists or not.  
 * 
 * @param {string} location Is the remote path to be queried.
 * 
 * @returns {object} Returns an object composed of the attributes:
 * 					- exists: True if the path already exists or false otherwise.
 *                  - isfile: True if the path already exists or false otherwise.
 *                  - isdir:os.path.isdir(data['locatio
 */
function file_exists(location){
    var response = undefined;
    $.ajax({
      url: "/file_exists",
      type: "POST",
      data: JSON.stringify({'location':location}),
      dataType: "text",
      async: false,
      
      complete: function(jqXHR, textStatus) {
          console.log(jqXHR.responseText)
          response =  $.parseJSON(jqXHR.responseText);
      },
      
      error:function( jqXHR, textStatus, errorThrown ){
          alert( "Request failed: " + textStatus+". Is the server working?" );
          response = {'exists':false,'isfile':false};
      }
    });
    console.log(response)
    return response;
}

/**
 * Creates a remote folder.  
 * 
 * @param {string} location Remote path to this folder.
 * @returns {object} Returns an object composed of the attributes:
 * 					- done: Which is true if the folder was created.
 */
function create_folder(location){
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
}
