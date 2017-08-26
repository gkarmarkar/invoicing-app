var tv4 = require("tv4");
var tv4formats=require("tv4-formats");
var moment = require("moment");

module.exports = function (logger){

	var schema={
			"properties":{
				"name":{
					"type":"string",
					"format":"minNameLength"
				},
				"email":{
					"type":"string",
					"format":"email"
				},
				"dueDate":{
					"type":"string",
					"format":"future-valid-date"
				},
				"invoiceItems":{
					"type":"array",
					"format":"minInvoiceItems",
					"items": {
						"properties": {
							"description": {
								"type": "string"
							},
							"amount": {
								"type": "string",
								"format": "minAmount"
							}
						},
						"required":["description","amount"]
					}
				},
				"total":{
					"type":"string",
					"format": "minAmount"
				}

			},
			"required": ["name","email","dueDate","invoiceItems"]
		};

	var validate = function(requestBody){
	
	/* invoice can be negative if merchant wants to give credits
		need to add check if total invoice amount is more than 0
	*/
		tv4.addFormat('future-valid-date', function(data, schema){
			if(!moment(data).isValid() || !moment(data).isAfter(moment(new Date()))) {
				return "due date is invalid.";
			}
		});

		tv4.addFormat('minAmount',function(data,schema){
			var floatPattern = new RegExp('^[0-9]+.[0-9]+$');

			if(!floatPattern.test(data)){
				return "Amount needs to be 0 or more";
			}
		});

		tv4.addFormat('minNameLength',function(name,schema){
			if(name.length <2 || name.length>100){
				return "Name should be between 1 and 100 letters";
			}
		})

		tv4.addFormat('minInvoiceItems',function(invoiceItemList,schema){
			if(invoiceItemList.length<1){
				return "Need to atleast 1 invoice item";
			}
		})
		tv4.addFormat(tv4formats);

		if(!tv4.validate(requestBody,schema
		)) {
			logger.log('error', tv4.error.message);
			return {
				status: 'error',
				details: tv4.error
			}
		}else {
			return {
				status: 'success'
			}
		}

	}

	return {
		"validate" : validate
	}
}

