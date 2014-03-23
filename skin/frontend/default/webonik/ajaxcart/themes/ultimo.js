function dispatchBlockUpdates(response){
	//update compare/cart hovers from header
	jQueryAC(function(jQuery) {
		var ddOpenTimeout;
		var dMenuPosTimeout;		
		
		jQuery(".dropdown").hover(function() {
			var DELAY = 300;
			var ddToggle = jQuery(this).children('.dropdown-toggle');
			var ddMenu = jQuery(this).children('.dropdown-menu');
			var ddWrapper = ddMenu.parent(); 		
			ddMenu.css("left", "");
			ddMenu.css("right", "");
			
			if (jQuery(this).hasClass('clickable-dropdown')){
				if (jQuery(this).hasClass('open')){
					jQuery(this).children('.dropdown-menu').stop(true, true).delay(DELAY).fadeIn(300, "easeOutCubic");
				}
			} else {
				clearTimeout(ddOpenTimeout);
				ddOpenTimeout = setTimeout(function() {
					ddWrapper.addClass('open');
				}, DELAY);
				jQuery(this).children('.dropdown-menu').stop(true, true).delay(DELAY).fadeIn(300, "easeOutCubic");
			}
			clearTimeout(dMenuPosTimeout);

			dMenuPosTimeout = setTimeout(function() {
				if (ddMenu.offset().left < 0){
					var space = ddWrapper.offset().left;
					ddMenu.css("left", (-1)*space);
					ddMenu.css("right", "auto");
				}
			}, DELAY);
		}, function() {
			var ddMenu = jQuery(this).children('.dropdown-menu');
			clearTimeout(ddOpenTimeout);
			ddMenu.stop(true, true).delay(150).fadeOut(300, "easeInCubic");

			if (ddMenu.is(":hidden")) {
				ddMenu.hide();
			}
			jQuery(this).removeClass('open');
		});
	})
}

function dispatchLiveUpdates(type, element){
	if (type=='cart_sidebar') {
		if($(ajaxcart.cartSidebar + '0') && $('ajaxcart-actions')){
			jQueryAC("#" + ajaxcart.cartSidebar + "0" + " #ajaxcart-actions").appendTo(jQueryAC(".block-content-inner").first());
		}
	} else if (type=='list_item') {
		jQueryAC(element).find('.ajaxcart-qty').addClass('display-onhover');
	}
}