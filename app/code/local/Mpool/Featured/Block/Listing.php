<?php

/**
 * @category     Mpool
 * @package     Mpool Featured Products
 * @author      Mahmudur Rahman, Mpool Team <nahidacm@gmail.com>
 */
class Mpool_Featured_Block_Listing extends Mage_Catalog_Block_Product_Abstract {

    public function __construct() {
        $this->setTemplate('mpool/featured/block_featured.phtml');
    }

    /*
     * Load featured products collection
     * */

    protected function _beforeToHtml() {

        if ($this->getRequest()->getParam('page_size')){
            $page_size = $this->getRequest()->getParam('page_size');
        } else {
            $page_size = $this->getData('pagesize');
        }
        if ($this->getRequest()->getParam('current_page'))
            $current_page = $_GET['current_page'];
        else
            $current_page = 1;

        if ($this->getRequest()->getParam('attributecode'))
            $attributecode = $this->getRequest()->getParam('attributecode');
        else
            $attributecode = $this->getData('attributecode');
        
        if ($this->getRequest()->getParam('attributevalue'))
            $attributevalue = $this->getRequest()->getParam('attributevalue');
        else
            $attributevalue = $this->getData('attributevalue');
        
        if ($this->getRequest()->getParam('categoryid'))
            $categoryid = $this->getRequest()->getParam('categoryid');
        else
            $categoryid = $this->getData('categoryid');
        
//        $attributecode = $this->getData('attributecode');
//        $attributevalue = $this->getData('attributevalue');
        

//        $this->_collectionSize = Mage::getModel('catalog/product')->getCollection()
//                ->addAttributeToSelect('*')
//                ->addAttributeToFilter($attributecode, $attributevalue)
//                ->count();

        $category = Mage::getModel('catalog/category')->load($categoryid);
        
        $collection = Mage::getModel('catalog/product')
                ->getCollection()
                ->addAttributeToSelect('*');
        
        if($categoryid)
            $collection = $collection->addCategoryFilter($category);

        if($attributecode && $attributevalue)
            $collection = $collection->addAttributeToFilter($attributecode, $attributevalue);
        
        $collection = $collection->setPageSize($page_size)->setCurPage($current_page);


        $this->_productCollection = $collection;

        $this->setProductCollection($collection);
        return parent::_beforeToHtml();
    }

//    protected function _toHtml() {
//
//        if (!$this->helper('featuredproducts')->getIsActive()) {
//            return '';
//        }
//
//        return parent::_toHtml();
//    }

    /*
     * Return label for CMS block output
     * */

//    protected function getBlockLabel() {
//        return $this->helper('featuredproducts')->getCmsBlockLabel();
//    }
}