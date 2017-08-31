'use strict';
import './invoice.scss';
import React from 'react';
import InvoiceFormList from '../../components/invoice-form-list/index.jsx';
import Input from 'react-toolbox/lib/input';
import Preview from '../../components/preview/index.jsx';
import {Button, IconButton} from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import Validate from '../../../lib/validate';
import TypeAheadList from '../../components/invoice-typeahead-list/index.jsx';
import Helper from '../../lib/helper.js';
import AjaxHelper from '../../lib/ajax.js';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.helper = Helper();
    this.ajaxHelper = AjaxHelper();
    this.timeoutHandler = null;
    this.state = this.helper.getInitialState();
    this.createInvoice = this.createInvoice.bind(this);
    this.addNewInvoiceItem = this.addNewInvoiceItem.bind(this);
    this.removeInvoiceItem = this.removeInvoiceItem.bind(this);
    this.setSelectedTypeAhead = this.setSelectedTypeAhead.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    
  }

  render() {
   var infoBoxClass = (this.state.invoiceStatus === 'error') ? 'alert-danger' : 'alert-success';   

    return(
      <div className="container invoice-form">
        {this.state.message ? 
          <div className={'infobox ' + infoBoxClass}>
            <span>{this.state.message}</span>
          </div>
          :''
        }
        <form className="" onSubmit={this.showPreview.bind(this)}>
          <div className="form-group row ">
            <label htmlFor="customer-name" className="col-md-2 col-form-label">Name</label>
            <div className="col-md-7">
               <input className="form-control" type="text" id="customer-name" 
                    name="customer-name" placeholder="Name of customer" autoComplete="off" 
                value={this.state.name} onChange={this.onChangeHandler} ref={(input) => { this.focusInput = input}}/>
            </div>          
          </div>

          <div className="form-group row">
            <label htmlFor="customer-email" className="col-md-2 col-form-label">Email</label>
            <div className="col-md-7 pos-relative">
              <input className="form-control" type="email" id="customer-email" name="customer-email" placeholder="Email" autoComplete="off" 
                value={this.state.email} onChange={this.onChangeHandler}/>

              {(this.state.typeAheadItems.length>0 && this.state.email.length>0)?
                <TypeAheadList typeAheadValues={this.state.typeAheadItems} selectedTypeAhead={this.setSelectedTypeAhead}/>
                :""}   
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="due-date" className="col-md-2 col-form-label">Due Date</label>
            <div className="col-md-7">
              <input className="form-control" type="date" id="due-date" name="due-date"
                 value={this.state.dueDate} onChange={this.onChangeHandler}/>          
            </div>
          </div>

         <InvoiceFormList list={this.state.invoiceItems} 
                          addInvoiceItem={this.addNewInvoiceItem} 
                          removeInvoiceItem={this.removeInvoiceItem}
                          changeNotifier={this.onChangeHandler}/>
          <div className="total-send">
            <div className="total">
                <strong className="total-text">TOTAL</strong>
                <span className="currency">$</span>
                <span>{this.state.total}</span>
            </div>
            <div className="pull-right">
              <Button label='Send' type='submit' raised primary />
            </div>
          </div>

        </form>
        <Dialog
          actions={[
                    { label: "Edit", onClick: (e)=>{ this.setState({previewActive: false})} },
                    { label: "Confirm", onClick: this.createInvoice}
                  ]}
          active={this.state.previewActive}
          onEscKeyDown={this.hidePreview.bind(this)}
          onOverlayClick={this.hidePreview.bind(this)}
          title='Review and confirm your invoice'>
              <Preview invoice={this.state}/>
            </Dialog>
      </div>
    );
  }

  componentDidMount() {
    this.focusInput.focus();
  }
  createInvoice() {
     this.ajaxHelper.createInvoice(this.state, (error, newState) => {
      this.setState(newState);
    });
  } 

  setSelectedTypeAhead(e) {
    this.setState({"email":e.target.textContent,"typeAheadItems":[]});
  }

  addNewInvoiceItem() {
    this.setState({"invoiceItems": this.helper.addInvoiceItem(this.state.invoiceItems)});
  }

  removeInvoiceItem() {
    var data = this.helper.removeInvoiceItem(this.state.invoiceItems);
    this.setState({
        "invoiceItems": data.invoiceItems,
        "total": data.total
    });
  }

//Typeahead
  getEmailSuggestion(query) {
    if(!!this.timeoutHandler){
      clearTimeout(this.timeoutHandler);
    }      
      this.timeoutHandler = setTimeout(()=>{
        clearTimeout(this.timeoutHandler);
         this.ajaxHelper.getCustomerSuggestions(query, (error, emailSuggestionList) => {          
          this.setState({typeAheadItems: emailSuggestionList})
        });
      }, 150);    
  }

// Preview controllers

  showPreview(e) {
    e.preventDefault();
    var validator = Validate();
    var data = this.helper.convertAllAmountsToString(this.state)
    var result = validator.validateCreate(data);
    if(!!result && result.status === 'success') {
      this.setState({previewActive: true});      
    }else {
      this.setState({
        message: result.details.message,
        invoiceStatus: 'error'
      })
    }
  }

  hidePreview(e) {
    e.preventDefault();
    this.setState({previewActive: false})
  }

// End of preview controllers

  onChangeHandler(e,listIndex){
  
    var changedField=e.target.name;

      switch(changedField){
        case "customer-name":
          this.setState({"name":e.target.value});
          break;
        case "customer-email":
          this.getEmailSuggestion(e.target.value);
          this.setState({"email":e.target.value});
          break;
        case "due-date":
          this.setState({"dueDate":e.target.value});
          break;
        case "invoice-description":
          this.setState({"invoiceItems": this.helper.UpdateInvoiceItemAtIndex(this.state.invoiceItems, {description: e.target.value}, listIndex)});          
          break;
        case "invoice-amount":
          var updatedList = this.helper.UpdateInvoiceItemAtIndex(this.state.invoiceItems, {amount: e.target.value}, listIndex);
          this.setState({            
            "invoiceItems": updatedList,
            "total":this.helper.calculateTotal(updatedList)
          });
          break;
     }
  }
}