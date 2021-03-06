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
				"merchantEmail":{
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
								"type": "string",
								"format":"descriptionCheck"
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
			"required": ["name","email","dueDate","invoiceItems","merchantEmail"]
		};

	var validateCreate = function(requestBody){
	
	/* invoice can be negative if merchant wants to give credits
		need to add check if total invoice amount is more than 0
	*/
		tv4.addFormat('future-valid-date', function(data, schema){
			if(!moment(data).isValid() || !moment(data).isAfter(moment(new Date()))) {
				return "Due date is invalid, make sure due date is today or in future.";
			}
		});

		tv4.addFormat('minAmount',function(data,schema){
			var floatPattern = new RegExp('^[0-9]?\.?[0-9]+$');

			if(!floatPattern.test(data) || !(parseFloat(data) > 0)){
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

		tv4.addFormat('descriptionCheck',function(description,schema){
			if(description.length<1){
				return "Description is required";
			}
		})
		tv4.addFormat(tv4formats);

		if(!tv4.validate(requestBody,schema
		)) {
			if(logger) {
				logger.log('error', tv4.error.message);
			}
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

	var paramSchema = {
		"properties":{
				"merchantEmail":{
					"type":"string",
					"format": "email"
				},
				"helperText":{
					"type":"string"				
				},

			},
			"required": ["merchantEmail","helperText"]
	}

	var validateGet = function(requestParams){
		
		
		if(!tv4.validate(requestParams,paramSchema)) {
			
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
		"validateCreate" : validateCreate,
		"validateGet"	 : validateGet
	}
}

