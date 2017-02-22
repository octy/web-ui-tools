/**
 * Libellé d'action avec icone (et libellé - optionnel)
 */
(function ($) {	
    'use strict';
      
    $.fn.actionLabel = function(options) {    	
    	return this.each(function() {
    		var component = $(this);
    		var action = component.data("action"); 
    		
    		component.css("vertical-align", "middle");
    		
    		if (typeof action != "undefined") {
    			if (action === "add") {
    				component.addClass("glyphicon glyphicon-plus-sign");
    			}
    			if (action === "remove") {
    				component.addClass("glyphicon glyphicon-minus-sign");
    				component.css("color", "#cc0000");
    			}
    		}    		
    	});    
    };

})(jQuery);
