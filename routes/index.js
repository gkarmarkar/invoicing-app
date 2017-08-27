var Invoice = require('../controller/invoice');

module.exports = function(app,logger) {
	
	var invoiceApis = Invoice(logger);

	app.post('/api/v1/invoice/create', invoiceApis.create);
	app.get('/api/v1/invoice/get', invoiceApis.find);
	app.get('/home', (req, res) => {
		res.render("index", {})
	})

}