<?php

class Magegaga_Easycheckout_Controller_Event
{
	//Event: adminhtml_controller_action_predispatch_start
	public function customTheme()
	{
		Mage::getDesign()->setArea('adminhtml')
			->setTheme((string)Mage::getStoreConfig('easycheckout/css_style/admin'));
	}
}
