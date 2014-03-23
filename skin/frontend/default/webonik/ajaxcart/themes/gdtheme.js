cartLink = jQueryAC('#cart_id').find('div:first');
wishlistLink = jQueryAC('#wishlist_id').find('div:first');
							
function dispatchButtonUpdates(button, onClick) {
    if ( onClick.indexOf("wishlist/index/cart") != -1 ) {
        var newLink = onClick.replace("wishlist/index/cart/","ajaxcart/wishlist/cart/").replace("setLocation('","").replace("')","");
        button.setAttribute("onclick","javascript:ajaxcart.addWishlistItemToCart('"+newLink+"', false);");
    } 
}

if ($$('.groupdeals-product-list')[0]) { 
	ajaxcart.dragdropCategory = false; 
}