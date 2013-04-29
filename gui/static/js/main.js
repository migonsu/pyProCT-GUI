function main_function(){
    //------------------
    // Center Main Window
    //------------------
    $("#main").center();
    
    //------------------
    // Template Loading
    //------------------
    var algorithm_wizard_steps = load_text_resource_with_ajax("/templates/algorithm.wizard.template");
    
    /////////////////////////////////////
    // (Simple) Dynamic Content Generation
    /////////////////////////////////////
    // Pregenerate clustering parameter fields
    generate_wizard_algorithm_steps(
    		$("#algorithms-1"), 
    		clustering_algorithm_titles, 
    		get_algorithm_parameters_definition(), 
    		algorithm_wizard_steps);

    /////////////////////////////
    // APPEARANCE
    /////////////////////////////
    // Selection widgets
    $("select").selectmenu();
 
    // Buttons
    $(".button_widget").button();
 
    // Set up text entry widgets            
    $(':text').not('.spinner_widget')
      .button()
      .css({
            'font' : 'inherit',
            'color' : 'inherit',
            'text-align' : 'left',
            'outline' : 'none',
            'cursor' : 'text'
    });
    
    // All widgets of class spinner_widget are converted to real sp. w.
    $(".spinner_widget").spinner();
    
    
}
