<?php


$installer = $this;
$connection = $installer->getConnection();
$installer->startSetup();
try{
	$installer->run("
			ALTER TABLE `{$installer->getTable('sales/quote')}`
			ADD `easycheckout_heard` TEXT NULL ,
			ADD `easycheckout_comment` TEXT NULL 
			
		");
}catch(Exception $e){
	if(strpos($e, 'Column already exists') === false){
		throw $e;
	}
}
try{
	$installer->run("
			ALTER TABLE `{$installer->getTable('sales/order')}`
			ADD `easycheckout_heard` TEXT NULL ,
			ADD `easycheckout_comment` TEXT NULL
			
		");
}catch(Exception $e){
	if(strpos($e, 'Column already exists') === false){
		throw $e;
	}
}
$installer->endSetup();