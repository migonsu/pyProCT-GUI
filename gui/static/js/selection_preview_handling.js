function create_previewer(
						input_id,
						preview_button_id,
						trajectories_dynamic_list_id, 
						base_workspace_field_id, 
						previewer_canvas_id){
	
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
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
	};
	
	$("#"+previewer_canvas_id).wrap("<div id="+previewer_canvas_id+"_context style='position:absolute'/>")
	$("#"+previewer_canvas_id+"_context").append("<div id="+previewer_canvas_id+"_spinner class = 'selection_preview'/>")
	$("#"+previewer_canvas_id).css('background-color', '#eeeeee');
	
	$("#"+previewer_canvas_id+"_spinner").spin(opts)
	$("#"+previewer_canvas_id+"_spinner").spin(false);
	$("#"+previewer_canvas_id+"_spinner").css("z-index",-10);

	var viewer = new ChemDoodle.TransformCanvas3D(previewer_canvas_id, 210, 210);
	$("#"+previewer_canvas_id).addClass("selection_preview");
    viewer.specs.set3DRepresentation('Ball and Stick');
    viewer.specs.backgroundColor = '#eeeeee';
    viewer.specs.atoms_useJMOLColors = true;
    
    $("#"+previewer_canvas_id+"_spinner").offset($("#"+previewer_canvas_id).offset())

    var input_field = $("#"+input_id);
    input_field.val("all");
    
    input_field.keypress(function(event) {
    	  if ( event.which == 13 ) {
    		     event.preventDefault();
    		     do_preview(
    		    		 	input_field,
							trajectories_dynamic_list_id, 
							base_workspace_field_id, 
							previewer_canvas_id,
							viewer);
    	  }
    });
    $("#"+preview_button_id).click(function(){
    	do_preview(
    		 	input_field,
				trajectories_dynamic_list_id, 
				base_workspace_field_id, 
				previewer_canvas_id,
				viewer);
    });
}
function do_preview(	
						input_field,
						trajectories_dynamic_list_id, 
						base_workspace_field_id, 
						previewer_canvas_id,
						viewer){
	
	$("#"+previewer_canvas_id+"_spinner").spin();
	$("#"+previewer_canvas_id+"_spinner").css("z-index",10); 
	
	var selection = input_field.val();
	var dl = $("#"+trajectories_dynamic_list_id).dynamiclist("getListHandler");
	var pdb_file = dl.value().split(",")[0];
	
	$.ajax({
	     url: "/do_selection",
	     type: "POST",
	     async: true,
	     data: JSON.stringify({
	    	 selection: selection,
	    	 pdb: pdb_file,
	    	 base: $("#"+base_workspace_field_id).val()
	     }),
	     dataType: "text",
	     complete: function(jqXHR, textStatus){
		      var molFile = decodeURIComponent(jqXHR.responseText);
		      if (molFile == "ERROR"){
		    	  alert("bad selector")
		    	  input_field.val("");
		      }
		      else{
		          var molecule = ChemDoodle.readXYZ(molFile, 1);
		          console.log(molecule)
			      viewer.loadMolecule(molecule);
		      }
		      $("#"+previewer_canvas_id+"_spinner").spin(false);
		      $("#"+previewer_canvas_id+"_spinner").css("z-index",-10);
	     },
	     error:function( jqXHR, textStatus, errorThrown ){
	         alert( "Unexpected Error: " + textStatus+". Is the server working?" );
	         $("#"+previewer_canvas_id+"_spinner").spin(false);
	         $("#"+previewer_canvas_id+"_spinner").css("z-index",-10);
	         input_field.val("");
	     }
	   });
}