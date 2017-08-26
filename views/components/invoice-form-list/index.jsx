import React from "react";

export default class InvoiceFormList extends React.Component{

	constructor(props){
		super(props);
		console.log("PROPS ", props);
	}

	render(){
		return (
		<div>
            <ul>
             {this.props.list.map((item,index) => { 
             	
					return(
						<li key={"item_"+index}>
			                <label for="invoicedescription">Description</label>
			                <input type="text" id="invoice-description" name="invoice-description" value={item.description} onChange={(e)=>{this.props.changeNotifier(e,index)}}/>
			                <label for="invoiceamount">Amount</label>
			                <input type="number" id="invoice-amount" name="invoice-amount"
			                value={item.amount} onChange={(e)=>{this.props.changeNotifier(e,index)}}/>

			                <button onClick={(e)=>{ this.deleteItemClickHandler(e, index)} }>-</button>
		              	</li>
             		);
             	})
          	}
            </ul>
            <button onClick={this.addItemClickHandler.bind(this)}>+</button>
         </div>
			);
	}


	addItemClickHandler(e) {
		e.preventDefault();
		this.props.addInvoiceItem(e)
	}

	deleteItemClickHandler(e, index){
		e.preventDefault();
		console.log(index);			
		this.props.removeInvoiceItem(index);
	}

}

