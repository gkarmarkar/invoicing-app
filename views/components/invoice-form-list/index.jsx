import React from "react";
import './invoice-form-list.scss';
import {Button, IconButton} from 'react-toolbox/lib/button';

export default class InvoiceFormList extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		return (
		<div className="invoice-form-list">
			<div className="form-group row">
					<label htmlFor="invoicedescription" className="control-label col-md-9 col-xs-6">Description</label>
				 <label htmlFor="invoiceamount" className="control-label col-md-2 col-xs-3">Amount</label>
			</div>
			<div className="form-group">	            
	            <ul className="invoice-list-items">
	             {this.props.list.map((item,index) => { 
	            		return(
							<div key={"item_"+index}>
				               <li className="row">
								    <div className="col-md-9 col-xs-6">
					                	<input className="form-control" type="text" id="invoice-description" name="invoice-description" value={item.description} 
					                		onChange={(e)=>{this.props.changeNotifier(e,index)}}/>
					                </div>
					                
					                <div className="col-md-2 col-xs-3">
					                <input  className="form-control" type="text" id="invoice-amount" 
					                	name="invoice-amount"
					                value={item.amount} onChange={(e)=>{this.props.changeNotifier(e,index)}}/>
					                </div>
					                <div className="col-md-1 col-xs-2">
					                <Button onClick={(e)=>{ this.deleteItemClickHandler(e, index)} } icon='remove' floating mini />
					                </div>
				              	</li>
			              	</div>
	             		);
	             	})
	          	}
	            </ul>
	            <div className="">
	            	<Button onClick={this.addItemClickHandler.bind(this)} icon='add' floating accent mini />
	        	</div>
	        	
	         </div>
	        </div>
			);
	}


	addItemClickHandler(e) {
		e.preventDefault();
		this.props.addInvoiceItem(e)
	}

	deleteItemClickHandler(e, index){
		e.preventDefault();
		this.props.removeInvoiceItem(index);
	}

}

