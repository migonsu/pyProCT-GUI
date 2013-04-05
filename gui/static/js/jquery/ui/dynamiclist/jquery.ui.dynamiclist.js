
DynamicList = function(listPartSelector, buttons){
    this.list_part_selector = listPartSelector;
    this.list_part_id = $(this.list_part_selector).attr("id");
    
    // add list nature
    var list_class = $(this.list_part_selector).attr("class");
    console.log("CLASS "+list_class)
    $(this.list_part_selector).removeClass();
    $(this.list_part_selector).addClass("dynList");
    
    // wrap with a div
    $(this.list_part_selector).wrap('<div />');
    this.wrapping_div = $(this.list_part_selector).parent();
    
    // add hidden input
    this.input_field_id = this.list_part_id+"_text_container";
    this.input_field = $("<input type='text' id='"+this.input_field_id+"' name='"+this.list_part_id+"' style='width:2px;' hidden>");
    $(this.list_part_selector).append(this.input_field);
    this.input_field.addClass(list_class);
    
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
    this.refreshInput();
};

DynamicList.prototype.deleteSelectedElements = function (){
     $(this.list_part_selector+" li.dynListSelected")
                                             .remove();
     this.refreshInput();
};

DynamicList.prototype.addElement = function(content){
    $(this.list_part_selector).append("<li class = 'dynListItem dynListNotSelected'>"+content+"</li>");
    this.addListeners();
    this.refreshInput();
};

DynamicList.prototype.isAlreadyInTheList = function(value){
	var values = this.value().split(",");
	for (var i =0; i < values.length; i++){
		if(values[i] == value){
			return true;
		}
	}
	return false;
}
DynamicList.prototype.addUniqueElement = function(element){
    if(! this.isAlreadyInTheList(element)){
    	this.addElement(element)
    }
};

DynamicList.prototype.addListeners = function(){
    $(this.list_part_selector+" li").unbind('click');
    $(this.list_part_selector+" li").click( function (event){
        event.preventDefault();
        $(event.target).toggleClass("dynListNotSelected");
        $(event.target).toggleClass("dynListSelected");
    });
};

DynamicList.prototype.value = function(){
	return $(this.list_part_selector+" li").map(function() { return $(this).text(); }).get().join();
};

DynamicList.prototype.refreshInput = function(){
	this.input_field.val(this.value());
	this.input_field.text(this.value());
};

$(function() {
    // the widget definition, where "custom" is the namespace,
    // "colorize" the widget name
    $.widget( "custom.dynamiclist", {
      // default options
      options: {
        buttons:[],
      },

      list_handler: null,
      
      // Triggered when building the widget
      _create: function() {
    	console.log("creating "+this.element.attr("id"));
        this.list_handler = new DynamicList("#"+this.element.attr("id"),this.options.buttons);
      },
 
      // Triggered when destroying the widget
      _destroy: function() {
        // Undo changes to element here
      },
      
      getListHandler: function(){
    	  return this.list_handler; 
      },
      
      getValue: function(){
    	  return this.list_handler.value();
      }
    });
});