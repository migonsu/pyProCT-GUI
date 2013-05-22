var DIALOGS = (function(){
	
	var show_molecule_dialog = function(molecule_text){
		$("<div/>", { 
	    	id:'preview_dialog',
	    	title: "Previewer",
	    	html: "<div id ='previewer_wrapper'> <canvas id ='previewer_canvas'> Canvas/HTML5 is not supported. </canvas> </div>"})
	    	.dialog({
	                modal:true, 
	                autoResize:true,
	                width:'auto',
	                create:function(event, ui){
	                	var viewer = new ChemDoodle.TransformCanvas3D('previewer_canvas',
	                			parseInt($("#previewer_wrapper").css("width")), 
	                			parseInt($("#previewer_wrapper").css("height")));
	            		//viewer.specs.set3DRepresentation('Ball and Stick');
	            	    viewer.specs.backgroundColor = '#eeeeee';
	            	    viewer.specs.atoms_useJMOLColors = true;
	            	    viewer.clear();
	            	    var molecule = ChemDoodle.readPDB(molecule_text, 1);
	            	    viewer.loadMolecule(molecule);
	                },
	                close: function( event, ui ){
	                    $(this).dialog("destroy");
	                }
	    });
	};
	
	return {
		show_molecule_dialog:show_molecule_dialog
	};
}());