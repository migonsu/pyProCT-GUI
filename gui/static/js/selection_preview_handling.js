
function create_previewer(
		input_id, 
		trajectories_dynamic_list_id, 
		base_workspace_field_id, 
		previewer_canvas_id){
	
	var viewerAllRed = new ChemDoodle.TransformCanvas3D(previewer_canvas_id, 125, 125);
    viewerAllRed.specs.set3DRepresentation('Ball and Stick');
    viewerAllRed.specs.backgroundColor = 'gray';
    
    
    var input_field = $("#"+input_id);
    input_field.keypress(function(event) {
    	  if ( event.which == 13 ) {
    		     event.preventDefault();
    		     var selection = input_field.val();
    		     var dl = $("#"+trajectories_dynamic_list_id).dynamiclist("getListHandler");
    		     var pdb_file = dl.value().split(",")[0]
    		     $.ajax({
    	              url: "/do_selection",
    	              
    	              type: "POST",
    	              
    	              async:false,
    	              
    	              data: JSON.stringify({
    	            	  selection: selection,
    	            	  pdb: pdb_file,
    	            	  base: $("#"+base_workspace_field_id).val()
    	              }),
    	              
    	              dataType: "text",
    	              
    	              complete: function(jqXHR, textStatus){
    	     		      var molFile = decodeURIComponent(jqXHR.responseText)
    	     		      console.log(molFile)
    	                  var molecule = ChemDoodle.readPDB(molFile, 1);
    	     		      viewerAllRed.loadMolecule(molecule);
    	              },
    	              
    	              error:function( jqXHR, textStatus, errorThrown ){
    	                  alert( "Request failed: " + textStatus+". Is the server working?" );
    	              }
    	            });
    	  }
    });
}