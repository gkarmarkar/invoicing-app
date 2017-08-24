var Validator=require("../../lib/validate");
var InvoiceModel = require("../../model/invoice");
var mongoose = require("../../db")();

console.log("MONGOSE "+JSON.stringify(mongoose));


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
					return res.status(200).send(model);
				}
				else{
					return res.status(400).send(err);
				}
			});

			
		}else{
			logger.log('error', result.details);		
			
			res.status(400).send({
				'error': 'Problem occured!',
				'details': result.details
			})
		}	


	}
	
	return {
		"create": createInvoice
	}
};
