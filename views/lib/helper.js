export default function() {
	
	 var getInitialState = function(){
	      return {
	        name:"",
	        email:"",
	        //this should be coming from a login session or something, hardcoding for now..
	        merchantEmail:"johndoe@test.com",
	        dueDate:"",
	        total:0.00,
	        invoiceItems:[
	          {
	            description:"",
	            amount:0.00
	          }
	        ],
	        message:"",
	        typeAheadItems:[],
	        previewActive: false,
	        invoiceStatus: ""
	      }        
  	}
	
  	var calculateTotal = function(itemList){
      var total = itemList.reduce(function(data,value){
          return data+Number(value.amount);
      },0);

      return total;
    }

    var UpdateInvoiceItemAtIndex = function(invoiceItems, updatedItem, listIndex) {
    	
    	var modifiedList = invoiceItems.map((item,index) => {
    		var updatedInvoiceItem = {
    			"description": (updatedItem.description || updatedItem.description === "") ? updatedItem.description : item.description,
    			"amount": (updatedItem.amount || updatedItem.amount === "") ? updatedItem.amount : item.amount
    		}
            return (index===listIndex) ? updatedInvoiceItem : item;
        });
        return modifiedList;
    }

  	var addInvoiceItem = function(itemList){
    	itemList.push({"description":"","amount":0.00});
    	return itemList;
  	}

  	var removeInvoiceItem = function(itemList, indexToRemove){
	    if(itemList.length>1){
			var updatedList = itemList;
			updatedList.splice(indexToRemove,1);
			return {
					"invoiceItems":updatedList,
			       	"total":calculateTotal(updatedList)
			}
		}
 	}

 	var convertAllAmountsToString = function(data) {
	    data.total = ''+data.total;
	    data.invoiceItems = data.invoiceItems.map((item)=> {
	        item.amount= ''+ item.amount;
	        return item;
	    });
	    return data;
  	}

	return {
		"getInitialState": getInitialState,		
		"calculateTotal": calculateTotal,
		"UpdateInvoiceItemAtIndex": UpdateInvoiceItemAtIndex,
		"addInvoiceItem": addInvoiceItem,
		"removeInvoiceItem": removeInvoiceItem,
		"convertAllAmountsToString": convertAllAmountsToString
	}
}