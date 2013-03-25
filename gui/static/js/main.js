function main_function(){
    //------------------
    // Center Main Window
    //------------------
    $("#main").center();
    
    //------------------
    // Template Loading
    //------------------
    var	basic_algo_field_template = load_text_resource_with_ajax("/templates/basic_algo_field_template.template");
    var	dialog_contents_template = load_text_resource_with_ajax("/templates/dialog_contents.template");
    
    /////////////////////////////////////
    // (Simple) Dynamic Content Generation
    /////////////////////////////////////
    // Pregenerate clustering parameter fields
    var clustering_algorithm_fields = generate_all_fields(clustering_algorithm_titles,
                                                          get_algorithm_parameters_definition(),
                                                          basic_algo_field_template);
    
    // Add options to the cluster algorithm listbox
    for (clustering_algorithm in clustering_algorithm_titles){
        var title = clustering_algorithm_titles[clustering_algorithm];
        $("#algorithms_listbox").append("<option id='"+clustering_algorithm+"_option'>"+title+"</option>");
    }

    // Add options to the query listbox
    for (var i = 0; i < query_types.length; i++){
        $("#query_listbox").append("<option>"+query_types[i]+"</option>");
    }

    /////////////////////////////
    // APPEARANCE
    /////////////////////////////
    // All widgets of class spinner_widget are converted to real sp. w.
    $(".spinner_widget").spinner();
    
    // Selection widgets
    $("#query_listbox").selectmenu();
    $("#algorithms_listbox").selectmenu();
 
    // Buttons
    $(".button_widget").button();
 
    // Set up text entry widgets            
    $('.text_field_widget')
      .button()
      .css({
            'font' : 'inherit',
            'color' : 'inherit',
            'text-align' : 'left',
            'outline' : 'none',
            'cursor' : 'text'
    });
    
    /////////////////////////////
    // BEHAVIOUR
    /////////////////////////////
    
    // 'Add and algorithm' button
    $("#add_clustering_algorithm").click(function(){
        add_clustering_algorithm_field(clustering_algorithm_title_reverse[
                                                   $("#algorithms_listbox option:selected").val()
                                       ], 
                                        clustering_algorithm_fields)
    });
    
    // Adding evaluation criteria button
    $("#add_evaluation_criteria_button").click(criteria_creation_show_dialog(criteria_types, 
                                                            "evaluation\\:\\:evaluation_criteria", 
                                                            dialog_contents_template));
    
    // Adding queries button
    $("#add_query_button").click(function(){
        $("#evaluation\\:\\:query_types").tagit("createTag",$("#query_listbox").val());
    });
}
