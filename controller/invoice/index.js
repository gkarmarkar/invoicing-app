var Validator=require("../../lib/validate");
var InvoiceModel = require("../../model/invoice");

module.exports = function(logger){

	var validate = Validator(logger);
	var createInvoice = function(req,res){

		var result= validate.validate(req.body);
		
		if(!!result && result.status === 'success'){
			var model = new InvoiceModel(req.body);

			return res.status(200).send(model);
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
