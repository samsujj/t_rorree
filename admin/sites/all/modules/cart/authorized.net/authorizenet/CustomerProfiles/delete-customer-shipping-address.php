<?php
  require 'vendor/autoload.php';
  use net\authorize\api\contract\v1 as AnetAPI;
  use net\authorize\api\controller as AnetController;
  
  define("AUTHORIZENET_LOG_FILE", "phplog");
  
  function deleteCustomerShippingAddress($customerprofileid = \SampleCode\Constants::CUSTOMER_PROFILE_ID_2, 
     $customeraddressid = "36976434")
  {
	  // Common setup for API credentials
	  $merchantAuthentication = new AnetAPI\MerchantAuthenticationType();
	  $merchantAuthentication->setName(\SampleCode\Constants::MERCHANT_LOGIN_ID);
      $merchantAuthentication->setTransactionKey(\SampleCode\Constants::MERCHANT_TRANSACTION_KEY);
    
	  // Use an existing customer profile and address id for this merchant name and transaction key
	  // Delete an existing customer shipping address for an existing customer profile
	  $request = new AnetAPI\DeleteCustomerShippingAddressRequest();
	  $request->setMerchantAuthentication($merchantAuthentication);
	  $request->setCustomerProfileId($customerprofileid);
	  $request->setCustomerAddressId($customeraddressid);

	  $controller = new AnetController\DeleteCustomerShippingAddressController($request);
	  $response = $controller->executeWithApiResponse( \net\authorize\api\constants\ANetEnvironment::SANDBOX);
	  if (($response != null) && ($response->getMessages()->getResultCode() == "Ok") )
	  {
		  echo "Delete Customer Shipping Address SUCCESS" . "\n";
	   }
	  else
	  {
		  echo "Delete Customer Shipping Address  ERROR :  Invalid response\n";
		  $errorMessages = $response->getMessages()->getMessage();
		  echo "Response : " . $errorMessages[0]->getCode() . "  " .$errorMessages[0]->getText() . "\n";
	  }
	  return $response;
  }
  if(!defined('DONT_RUN_SAMPLES'))
      deleteCustomerShippingAddress();
?>