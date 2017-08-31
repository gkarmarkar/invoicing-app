import Helper from './helper.js';

export default function() {

	var BASE_API_URL = '/api/v1/invoice';
	var MERCHANT_EMAIL = "johndoe@test.com";
	var helper = Helper();


	var createInvoice = function(currentState, callback) {
		
		var requestBody = currentState;

	    requestBody.dueDate=(new Date(requestBody.dueDate)).toISOString();
	    var newSate = helper.getInitialState();

	    $.post(BASE_API_URL + "/create",requestBody)
	    .done((data) => {//update the UI
	        newSate.invoiceStatus = 'success';
	        newSate.previewActive = false;
	        newSate.message = data.message;
	        
	        callback(null,newSate);
	    })
	    .fail((err)=>{
		    var errMsg=err.responseJSON.message.message;
		    requestBody.errorTxt=errMsg;
		    newSate.message = requestBody.errorTxt;
		    newSate.invoiceStatus = "error";
		    newState.previewActive = false;
	      
	      	callback(null, newState);
	    });
	}

	var getCustomerSuggestions = function(query, callback){
  
    	if(query.length>0){
		    $.get(BASE_API_URL + "/get?merchantEmail="+MERCHANT_EMAIL+"&helperText="+query)
		    .done((emailSuggestionList)=>{
		     callback(null, emailSuggestionList)
		    })
		    .fail((err)=>{
		      //Update the UI	      
		      callback(null, []);
		    });
		}else{
			callback(null,[]);
		}
  	}

  	return {
  		"createInvoice": createInvoice,
		"getCustomerSuggestions": getCustomerSuggestions,
  	}
}