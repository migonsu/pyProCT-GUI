
DynamicList = function(listPartSelector, buttons){
    this.list_part_selector = listPartSelector;
    
    // add list nature
    $(this.list_part_selector).addClass("dynList");
    
    // wrap with a div
    $(this.list_part_selector).wrap('<div />');
    this.wrapping_div = $(this.list_part_selector).parent();
    
    // add buttons
    this.buttons = {};
    for (var i = 0; i < buttons.length; i++){
        this.buttons[buttons[i]]=$("<input type='button' class = 'dynListButton' value="+buttons[i]+">");
        this.wrapping_div.append(this.buttons[buttons[i]]);
    }
    
    // unselect and add step nature
    $(this.list_part_selector+" li").addClass("dynListItem dynListNotSelected");
    
    // addListeners to all the <li> elements
    this.addListeners();
}

DynamicList.prototype.deleteSelectedElements = function (){
     $(this.list_part_selector+" li.dynListSelected")
                                             .remove();
}

DynamicList.prototype.addElement = function(content){
    $(this.list_part_selector).append("<li class = 'dynListItem dynListNotSelected'>"+content+"</li>");
    this.addListeners();
}

DynamicList.prototype.addListeners = function(){
    $(this.list_part_selector+" li").unbind('click');
    $(this.list_part_selector+" li").click( function (event){
        event.preventDefault();
        $(event.target).toggleClass("dynListNotSelected");
        $(event.target).toggleClass("dynListSelected");
    });
}
