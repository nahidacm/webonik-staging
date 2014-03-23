<?php
class Devinc_Ajaxcart_Block_Checkout_Cart_Sidebar extends Mage_Checkout_Block_Cart_Sidebar
{
    /**
     * Class constructor
     */    
    public function __construct()
    {
        parent::__construct();
        $this->addItemRender('default', 'ajaxcart/checkout_cart_item_renderer', 'checkout/cart/sidebar/default.phtml');
    }   
	
}