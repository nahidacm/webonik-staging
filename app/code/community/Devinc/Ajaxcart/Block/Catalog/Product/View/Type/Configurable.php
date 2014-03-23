<?php
class Devinc_Ajaxcart_Block_Catalog_Product_View_Type_Configurable extends Mage_Catalog_Block_Product_View_Type_Configurable
{
    /**
     * Returns additional values for js config, con be overriden by descedants
     *
     * @return array
     */
    protected function _getAdditionalConfig()
    {
		if (Mage::getSingleton('customer/session')->getAjaxCartAction()=='options_popup_conf') {
	        return array('containerId' => 'ajaxcart-options');
	    }
	    
	    return parent::_getAdditionalConfig();
    }
    
}