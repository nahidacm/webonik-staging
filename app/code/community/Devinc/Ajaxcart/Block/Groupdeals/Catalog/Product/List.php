<?php
class Devinc_Ajaxcart_Block_Groupdeals_Catalog_Product_List extends Devinc_Groupdeals_Block_Product_List
{
    public function getAddToCartUrl($product, $additional = array())
    {	
    	if (Mage::helper('ajaxcart')->isEnabled()) {
			if ($this->hasOptions($product) || $product->isGrouped()){
				$additional['options_popup'] = true;
			}
	        return $this->helper('checkout/cart')->getAddUrl($product, $additional);
        } else {
	        return parent::getAddToCartUrl($product, $additional);
        }
    }

    public function hasOptions($_product)
    {
        if ($_product->getTypeInstance(true)->hasOptions($_product)) {
            return true;
        }
        return false;
    }		
	
}