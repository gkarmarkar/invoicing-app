var Validator=require("../../lib/validate");
var InvoiceModel = require("../../model/invoice");
var mongoose = require("../../db")();

module.exports = function(logger){


	var validate = Validator(logger);
	var createInvoice = function(req,res){
		var result= validate.validate(req.body);
		
		if(!!result && result.status === 'success'){
			var model = new InvoiceModel(req.body);
			//Hardcoding merchant email for now, ideally should get from merchant login
			model.merchantEmail = "johndoe@test.com";

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
			})
		}	


	}
	
	return {
		"create": createInvoice
	}
};
