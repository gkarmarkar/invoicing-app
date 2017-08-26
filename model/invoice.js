/*var modelFn=function(data){
	if(!!data){
			this.name = data.name;
			this.email = data.email;
			this.dueDate = data.duedate;
			this.invoiceItems = data.invoiceitems;
			this.total = data.total;
		}	
}

module.exports = modelFn*/

class Invoice{

	constructor(data){

		if(!!data){
			this.name = data.name;
			this.email = data.email;
			this.dueDate = data.dueDate;
			this.invoiceItems = data.invoiceItems;
			this.total = data.total;
			this.merchantEmail = data.merchantEmail;
			this.status = "pending";
			this.creationDate = (new Date()).toISOString();
		}		
	}
}

module.exports = Invoice;


