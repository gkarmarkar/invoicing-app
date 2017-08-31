var Validator=require("../../lib/validate");
var InvoiceModel = require("../../model/invoice");
var mongoose = require("../../db")();

module.exports = function(logger){


	var validate = Validator(logger);
	var createInvoice = function(req,res){
		var result= validate.validateCreate(req.body);
		
		if(!!result && result.status === 'success'){
			var model = new InvoiceModel(req.body);
			//Hardcoding merchant email for now, ideally should get from merchant login
			//model.merchantEmail = "johndoe@test.com";

			var invoiceDBHandler=mongoose.getDB();
			invoiceDBHandler.create(model,function(err,invoice){

				if(!err){
					return res.status(200).send({
						'status': 'success',
						'message': 'Invoice sent successfully'
					});
				}
				else{
					return res.status(400).send({
						'status': 'error',
						'message': 'Failed to send invoice',
						'error': err
					});
				}
			});

			
		}else{
			logger.log('error', result.details);					
			res.status(400).send({
				'status': 'error',
				'message': result.details,
				'error': result
			});
		}	


	}

	var getHelperText = function(req,res){

		//validate if the GET api call was legit
		var resultGet= validate.validateGet(req.query);


		if(!!resultGet && resultGet.status==="success"){

			var invoiceDBHandler=mongoose.getDB();
			var paramMerchantEmail=req.query.merchantEmail;
			var paramCustomerEmailQry=new RegExp("^"+req.query.helperText+".*@");

			invoiceDBHandler
			.distinct("email",{merchantEmail : paramMerchantEmail,email:paramCustomerEmailQry},function(err,docs){
					if(err){
						res.status(400).send({
							'status': 'error',
							'error': err
						});
					}else{
						res.json(docs);
						}	
				}
			);

		}else{
			//validation error
			logger.log('error',resultGet.details);
			res.status(400).send({
				'status': 'error',
				'message': resultGet.details,
				'error': resultGet
			});
		}

		//return res.status(200).send([{"email":"test"},{"email":"2"}]);
	}
	
	return {
		"create": createInvoice,
		"find"	: getHelperText
	}
};
