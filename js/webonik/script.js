/// <reference path="libs/jquery-1.10.2.min.js" />
/// <reference path="plugins.js" />

/**
 * Author: Shihab Ahmed
 */

var inMobileView;

(function(j) {

    j(function() {

        inMobileView = j('.header-content .search-form').is(':visible');

        var updateCartItemQuantity = function() {
            var cartItemQuantity = 0;
            j('.quick-cart-container .product-quantity').each(function() {
                cartItemQuantity += parseInt(j(this).text());
            });
            j('.total-products span').text(cartItemQuantity);
        };

        var footerTop = j('.footer-container').offset().top,
            jCart = j(".quick-cart-container"),
            jProductsList = j('.products-table'),
            cartHeight, cartBottom;

        if (!inMobileView) {
            var scrollPos = 0;
            j(window).scroll(function() {
                scrollPos = j(window).scrollTop();

                if (scrollPos > 44) {
                    if (!inMobileView) {
                        j(".quick-cart-container").css("top", (scrollPos - 44).toString() + "px");
                    }
                } else {
                    j(".quick-cart-container").css("top", "0px");
                }

                cartHeight = jCart.outerHeight();
                cartBottom = jCart.offset().top + cartHeight + 6;

                jCart.height(jCart.height() - (cartBottom - footerTop));
                jProductsList.height(jProductsList.height() - (cartBottom - footerTop));
                j(window).resize();
            });
        }


        updateCartItemQuantity();

        var quantity, productQuantity;
        j('.increase-quantity').on('click', function() {
            productQuantity = j(this).siblings('.product-quantity');
            quantity = productQuantity.text();
            quantity = parseInt(quantity) + 1;
            productQuantity.text(quantity);
            updateCartItemQuantity();
        });

        j('.decrease-quantity').on('click', function() {
            productQuantity = j(this).siblings('.product-quantity');
            quantity = productQuantity.text();
            quantity = parseInt(quantity);
            if (quantity > 0) {
                quantity = quantity - 1;
                productQuantity.text(quantity);
                updateCartItemQuantity();
            }
        });

        var productNav = j('.product-nav-container'),
                quickCart = j('.quick-cart-container'),
                productNavLeft, quickCartRight;

        j('.side-nav').on('click', function() {
            j('.bg-popup-overlay').fadeIn();
            j('.product-nav-container').css('z-index', 670).animate({
                opacity: 1
            });
        });

        j('.quick-cart').on('click', function() {
            j('.bg-popup-overlay').fadeIn();
            j('.quick-cart-container').css('z-index', 670).animate({
                opacity: 1
            });
        });

        j('.deliveryLocations').on('click', function() {
            j('.bg-popup-overlay').fadeIn();
            j('.delivery-locations-container').css('z-index', 670).animate({
                opacity: 1
            });
        });

        j('.close-popup').on('click', function() {
            var popup = j(this).parent();
            popup.animate({
                opacity: 0
            }, function() {
                popup.css('z-index', -1);
            });
            j('.bg-popup-overlay').fadeOut();
        });

    });

    var productImgPos = function() {
        j('.product-image-container').each(function() {
            productImageContainer = j(this);
            productImage = productImageContainer.find('img');

            containerWidth = productImageContainer.outerWidth();
            containerHeight = productImageContainer.outerHeight() - 1;

            productImage.css({
                top: (containerHeight - productImage.outerHeight()) / 2,
                left: (containerWidth - productImage.outerWidth()) / 2
            });
        });
    };

    j(window).resize(function() {

        productImgPos();

        var productImageContainer, productImage, containerWidth, containerHeight, imgWidth, imgHeight, imgTop, imgLeft;

        if (!inMobileView) {
            j('.products-grid .item').mouseenter(function() {
                productImage = j(this).find('img');
                imgWidth = productImage.width();
                imgHeight = productImage.height();
                imgTop = -(imgHeight * 0.05);
                imgLeft = -(imgWidth * 0.05);

                productImage.animate({
                    top: imgTop,
                    left: imgLeft,
                    width: '110%',
                    height: '110%'
                }, 200);
            }).mouseleave(function() {
                productImage = j(this).find('img');
                productImage.animate({
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                }, 200);
            });
        }

        var productCartHeight = j('.quick-cart-container').height() - 125;

        if (j('.products-table').height() != productCartHeight) {
            j('.products-table').css('height', productCartHeight);
        }

        var productTitleWidth = j('.products-table').width() - j('.products-table .quantity').width()
                - j('.products-table .image').width() - j('.products-table .price').width()

        j('.products-table .title').css({
            'max-width': productTitleWidth,
            'width': productTitleWidth
        });
    });

    j(window).load(function() {
        j(window).resize();

        j('.scrollable').mCustomScrollbar({
            advanced: {
                updateOnBrowserResize: true,
                updateOnContentResize: true
            }
        });
    });

})(jQuery);

;(function(j) {
    j(function() {
        j('.header').wrapInner('<div class="header-content"></div>');
    });
})(jQuery);