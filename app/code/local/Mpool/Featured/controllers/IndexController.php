<?php

/**
 * @category    Mpool
 * @package     Mpool Featured Products
 * @author      Mahmudur Rahman, Mpool Team <nahidacm@gmail.com>
 */
class Mpool_Featured_IndexController extends Mage_Core_Controller_Front_Action {

    public function ajaxAction() {
        echo $this->getLayout()->createBlock('featured/listing')
                ->setTemplate('mpool/featured/block_featured_ajax.phtml')->toHtml();
    }

}