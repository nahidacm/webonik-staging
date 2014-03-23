<?php
class Devinc_Ajaxcart_Block_Bundle_Checkout_Cart_Item_Renderer extends Mage_Bundle_Block_Checkout_Cart_Item_Renderer
{
    
    //Get quote item qty
    //Add qty input with increase/decrease buttons if enabled 
    public function getQty()
    {
    	return Mage::helper('ajaxcart')->getQty($this, parent::getQty()); 
    }   
    
}