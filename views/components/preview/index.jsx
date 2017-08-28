import React from 'react';
import './preview.scss';
export default class Preview extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="preview-pane">
				<div className="invoice-info container-fluid">
					<div className="item row">
						<strong className="col-md-2">Name</strong> 
						<span className="col-md-10">{this.props.invoice.name}</span>
					</div>
					<div className="item row">
						<strong className="col-md-2">Email</strong> 
						<span className="col-md-10">{this.props.invoice.email}</span>
					</div>
					<div className="item row">
						<strong className="col-md-2">Due date</strong> 
						<span className="col-md-10">{this.props.invoice.dueDate}</span>
					</div>
					<hr/>
					<div className="">
						<div className="item row">
							<div className="col-md-8"><strong>Description</strong></div>
							<div className="col-md-2"><strong>Amount</strong></div>
						</div>
						<ul className="unorderedlist">
						{this.props.invoice.invoiceItems.map((item) => {
							return (
								<li className="row">
									<span className="col-md-8">{item.description}</span>
									<span className="col-md-2">{item.amount}</span>
								</li>
								)
						})}
						</ul>
					</div>
					<hr/>
					<hr/>
					<div className="item total">
						<strong className="total-text">TOTAL</strong>
		                <span className="currency">$</span>
		                <span>{this.props.invoice.total}</span>
					</div>
				</div>
			</div>

			)
	}
}