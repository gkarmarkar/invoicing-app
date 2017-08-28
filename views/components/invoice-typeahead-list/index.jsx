import React from "react";
import './invoice-typeahead-list.scss';


export default class TypeAheadList extends React.Component{

	constructor(props){
		super(props);
	}

	render(){

		return(
			<div className="typeahead-list">
				<ul className="typeahead-suggestions">
				{this.props.typeAheadValues.map((item,index) => { 
	            		return(
							<div key={"typeaheaditem_"+index}>
				               <li className="row">
								    <div className="col-md-9 col-xs-6" onClick={(e)=>this.props.selectedTypeAhead(e)} >
					                	{item}
					                </div>
					            </li>
			              	</div>
	             		);
	             	})
	          	}

				</ul>

			</div>);
	}

}