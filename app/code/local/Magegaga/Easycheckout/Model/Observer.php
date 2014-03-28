<?php

class Magegaga_Easycheckout_Model_Observer{
    public function EasycheckoutRedirect($observer) {
        if (Mage::helper('easycheckout')->getEasycheckoutConfig('general/active')) {
	           Mage::app()->getFrontController()->getResponse()->setRedirect(Mage::getUrl("checkout/onestep"))->sendResponse();

	       //   Mage::app()->getResponse()->setRedirect(Mage::getUrl("checkout/onestep"));
        }
    }	
}