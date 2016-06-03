<?php

/**
 * The AuthorizeNet PHP SDK. Include this file in your project.
 *
 * @package AuthorizeNet
 */
 echo 67;
require 'lib/shared/AuthorizeNetRequest.php';
require  'lib/shared/AuthorizeNetTypes.php';
require  'lib/shared/AuthorizeNetXMLResponse.php';
require  'lib/shared/AuthorizeNetResponse.php';
echo 67;
require  'lib/AuthorizeNetAIM.php';
require 'lib/AuthorizeNetARB.php';
require 'lib/AuthorizeNetCIM.php';
require  'lib/AuthorizeNetSIM.php';
require  'lib/AuthorizeNetDPM.php';
require  'lib/AuthorizeNetTD.php';
require 'lib/AuthorizeNetCP.php';
echo 67;
//if (class_exists("SoapClient")) {
    require 'lib/AuthorizeNetSOAP.php';
//}
/**
 * Exception class for AuthorizeNet PHP SDK.
 *
 * @package AuthorizeNet
 */
 
 echo 33;

       
        $transaction = new AuthorizeNetAIM('5Qt5Ye7838', '8B4rXM8pD3486Has'); // For sandbox account
       
        $transaction->amount = 52.25;
        $transaction->card_num = '4111111111111111';
        $transaction->exp_date = '12/17';
        $transaction1 = (object)array();
        $transaction1->first_name = $order_ship_bill_details['billing_fname'];
        $transaction1->last_name = $order_ship_bill_details['billing_lname'];
        $transaction1->company = "";
        $transaction1->address = $order_ship_bill_details['billing_add'];
        $transaction1->city = $order_ship_bill_details['billing_city'];
        $transaction1->state = $order_ship_bill_details['billing_state'];
        $transaction1->zip = $order_ship_bill_details['billing_zip'];
        $transaction1->country = "US";
        $transaction1->phone = $order_ship_bill_details['billing_phone'];
        $transaction1->fax = "";
        $transaction1->email = $order_ship_bill_details['billing_email'];
        $transaction1->ship_to_first_name=$order_ship_bill_details['shipping_fname'];
        $transaction1->ship_to_last_name=$order_ship_bill_details['shipping_lname'];
        $transaction1->ship_to_address=$order_ship_bill_details['shipping_add'];
        $transaction1->ship_to_city=$order_ship_bill_details['shipping_city'];
        $transaction1->ship_to_state=$order_ship_bill_details['shipping_state'];
        $transaction1->ship_to_zip=$order_ship_bill_details['shipping_zip'];
        $transaction1->ship_to_country="US";
        $transaction1->tax=0;
        $transaction1->email_customer=FALSE;
        $transaction1->customer_ip = '10.25.025.23';
        $transaction->setFields($transaction1);
        //if(YII_DEBUG)
            $transaction->setSandbox(TRUE);
        
        $response = $transaction->authorizeAndCapture(); 
        print_r( $response);