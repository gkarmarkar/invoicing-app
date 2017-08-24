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
			this.dueDate = data.duedate;
			this.invoiceItems = data.invoiceitems;
			this.total = data.total;
		}		
	}
}

module.exports = Invoice;


