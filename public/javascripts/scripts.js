(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.side-nav li').each(function(idx, li) {
    	li = $(li);
    	var links = li.children('a');
    	if (links.length) {
    		links.each(function(idx, link) {
    			link = $(link);
    			if (window.location.pathname == link.attr('href'))
    				li.addClass('active');
    		})
    	}
    })
  }); // end of document ready
})(jQuery); // end of jQuery name space