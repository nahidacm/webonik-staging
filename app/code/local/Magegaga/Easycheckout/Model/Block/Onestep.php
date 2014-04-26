<?php
class Vinagento_Oscheckout_Block_Onestep extends Mage_Core_Block_Template
{
	public function _prepareLayout()
    {
		return parent::_prepareLayout();
    }
    
	public function getEasycheckout()     
     { 
        if (!$this->hasData('easycheckout')) {
            $this->setData('easycheckout', Mage::registry('easycheckout'));
        }
        return $this->getData('easycheckout');
        
    }
}