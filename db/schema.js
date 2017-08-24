module.exports=function(mongoose){
	var invoiceSchema = new mongoose.Schema({
	name : String,
	email : String,
	dueDate : String,
	creationDate: String,
	invoiceItems: Array,
	total: Number,
	merchantEmail: String,
	status: String
	});

	var InvoiceDBHandler = mongoose.model("Invoice",invoiceSchema);

	return InvoiceDBHandler;
	
}

