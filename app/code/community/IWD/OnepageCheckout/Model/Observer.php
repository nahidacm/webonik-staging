<?php
class IWD_OnepageCheckout_Model_Observer
{
    public function addHistoryComment($data)
    {
        $comment	= Mage::getSingleton('customer/session')->getOrderCustomerComment();
        $comment	= trim($comment); 
        if (!empty($comment))
			$data['order']->addStatusHistoryComment($comment)->setIsVisibleOnFront(true)->setIsCustomerNotified(false);
    }

    public function removeHistoryComment()
    {
        Mage::getSingleton('customer/session')->setOrderCustomerComment(null);
    }

    public function emptyCart()
    {
		if (Mage::helper('onepagecheckout')->isOnepageCheckoutEnabled())
		{
			$sess = Mage::getSingleton('checkout/session');
			// check if order has been processed by OPC module
			$processedOPC	= $sess->getProcessedOPC();
			if($processedOPC == 'opc')
			{
				$sess->setProcessedOPC('');
				$cartHelper = Mage::helper('checkout/cart');
				$items = $cartHelper->getCart()->getItems();
				foreach ($items as $item) {
					$itemId = $item->getItemId();
					$cartHelper->getCart()->removeItem($itemId)->save();
				}
				
				$sess->clear();
			}
		}
    }
    
	public function checkRequiredModules(){
		$cache = Mage::app()->getCache();
		if (Mage::getSingleton('admin/session')->isLoggedIn()) {
			if (!Mage::getConfig()->getModuleConfig('IWD_All')->is('active', 'true')){	
				if ($cache->load("iwd_onepagecheckout")===false){
					$message = 'Important: Please setup IWD_ALL in order to finish <strong>IWD OnePageCheckout</strong> installation.<br />
					Please download <a href="http://iwdextensions.com/media/modules/iwd_all.tgz" target="_blank">IWD_ALL</a> and setup it via Magento Connect.<br />
					Please refer to installation guide';
					Mage::getSingleton('adminhtml/session')->addNotice($message);
					$cache->save('true', 'iwd_onepagecheckout', array("iwd_onepagecheckout"), $lifeTime=5);
				}
			}
			if(Mage::helper('onepagecheckout')->isMageEnterprise()){	
				if ($cache->load("iwd_opc_ee")===false){
					$message = 'Important: Install OPC for EE';
					Mage::getSingleton('adminhtml/session')->addNotice($message);
					$cache->save('true', 'iwd_opc_ee', array("iwd_opc_ee"), $lifeTime=5);
				}
			}
		}
	}	
}
