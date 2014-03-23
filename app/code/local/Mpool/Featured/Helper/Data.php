<?php

/**
 * @category    Mpool
 * @package     Mpool Featured Products
 * @author      Mahmudur Rahman, Mpool Team <nahidacm@gmail.com>
 */
class Mpool_Featured_Helper_Data extends Mage_Core_Helper_Abstract {

    public function getIsActive() {
        return (bool) Mage::getStoreConfig('featured/general/active');
    }

}