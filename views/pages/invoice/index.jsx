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

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.timeoutHandler = null;
    this.state= this.getInitialState();
  }

  getInitialState(){
      return {
        name:"",
        email:"",
        //this should be coming from a login session or something, hardcoding for now..
        merchantEmail:"defaultmerchant@test.com",
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

  doSomething(e){
    var requestBody=this.state;
    requestBody.dueDate=(new Date(requestBody.dueDate)).toISOString();

    $.post("http://localhost:3000/api/v1/invoice/create",requestBody)
    .done((data) => {//update the UI
        var state = this.getInitialState();
        state.invoiceStatus = 'success';
        state.previewActive = false;
        state.message = data.message;
        this.setState(state);
    })
    .fail((err)=>{
      //Update the UI
      var errMsg=err.responseJSON.message.message;
      requestBody.errorTxt=errMsg;
      this.setState({"message":requestBody.errorTxt,
                    "invoiceStatus": "error",
                    "previewActive": false});
         
    });
  } 

  setSelectedTypeAhead(e){
    this.setState({"email":e.target.textContent,"typeAheadItems":[]});

  }

  render() {
    var changeNotifierHandler = (e, index) => {
      this.onChangeHandler(e,index)
    };
   var infoBoxClass = '';

   if(this.state.invoiceStatus === 'error') {
      infoBoxClass= 'alert-danger';
   }else if(this.state.invoiceStatus === 'success') {
      infoBoxClass= 'alert-success';
   }

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
                value={this.state.name} onChange={(e)=>{this.onChangeHandler(e)}} />
            </div>          
          </div>

          <div className="form-group row">
            <label htmlFor="customer-email" className="col-md-2 col-form-label">Email</label>
            <div className="col-md-7 pos-relative">
              <input className="form-control" type="email" id="customer-email" name="customer-email" placeholder="Email" autoComplete="off" 
                value={this.state.email} onChange={(e)=>{this.onChangeHandler(e)}}/> 
              {(this.state.typeAheadItems.length>0 && this.state.email.length>0)?
                <TypeAheadList typeAheadValues={this.state.typeAheadItems} selectedTypeAhead={(e)=>{this.setSelectedTypeAhead(e)}}/>
                :""}   
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="due-date" className="col-md-2 col-form-label">Due Date</label>
            <div className="col-md-7">
              <input className="form-control" type="date" id="due-date" name="due-date"
                 value={this.state.dueDate} onChange={(e)=>{this.onChangeHandler(e)}}/>          
            </div>
          </div>

         <InvoiceFormList list={this.state.invoiceItems} 
                          addInvoiceItem={this.addInvoiceItem.bind(this)} 
                          removeInvoiceItem={this.removeInvoiceItem.bind(this)}
                          changeNotifier={changeNotifierHandler}/>
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
                    { label: "Confirm", onClick: this.doSomething.bind(this) }
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

  getCustomerSuggestions(textChange){
     var requestBody=this.state;
    
    $.get("http://localhost:3000/api/v1/invoice/get?merchantEmail=johndoe@test.com&helperText="+textChange)
    .done((data)=>{//update the UI
      var emailList=data.map(function(item){
        return item.email;
      });
     this.setState({"typeAheadItems":emailList});
    })
    .fail((err)=>{
      //Update the UI
      var errMsg=err.responseJSON.message.message;
      requestBody.errorTxt=errMsg;
      this.setState({"errorTxt":requestBody.errorTxt});
         
    });
  }


  processChange(query) {
    if(!!this.timeoutHandler){
      clearTimeout(this.timeoutHandler);
    }      
      this.timeoutHandler = setTimeout(()=>{
        clearTimeout(this.timeoutHandler);
        this.getCustomerSuggestions(query);
      }, 150);    
  }

  hidePreview(e) {
    e.preventDefault();
    this.setState({previewActive: false})
  }

  prepDataForValidator(data) {
    data.total = ''+data.total;
    data.invoiceItems = data.invoiceItems.map((item)=> {
        item.amount= ''+ item.amount;
        return item;
    });
    return data;
  }

  showPreview(e) {
    e.preventDefault();
    var validator = Validate();
    var data = this.prepDataForValidator(this.state)
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

  onChangeHandler(e,listIndex){
  
    var changedField=e.target.name;

      switch(changedField){
        case "customer-name":
          this.setState({"name":e.target.value});
          break;
        case "customer-email":
          this.processChange(e.target.value);
          this.setState({"email":e.target.value});
          break;
        case "due-date":
          this.setState({"dueDate":e.target.value});
          break;
        case "invoice-description":
          var modifiedList=this.state.invoiceItems.map((item,index)=>{
              if(index===listIndex){

                return {"description":e.target.value,
                        "amount":item.amount};
              }else{
                return item;
              }
            }); 
          this.setState({"invoiceItems":modifiedList});
          break;
        case "invoice-amount":
          var tmpTotal=0;
          var modifiedList=this.state.invoiceItems.map((item,index)=>{
             if(index===listIndex){
              
              return {
                "description":item.description,
                "amount":e.target.value
              }

             }else{
              return item;
             }

          });

          this.setState({
            "invoiceItems":modifiedList,
            "total":this.calculateTotal(modifiedList)
          });
          break;
     }
  }

  calculateTotal(modifiedList){
      var total=modifiedList.reduce(function(data,value){
          return data+Number(value.amount);
      },0);
      return total;
    }

  addInvoiceItem(){
      var tmpArr=this.state.invoiceItems;
      tmpArr.push({"description":"","amount":0.00});
      //for updating the state of the child component(adds another list item when + was clicked)
      this.setState({invoiceItems:tmpArr});

  }

  removeInvoiceItem(indexToRemove){
    if(this.state.invoiceItems.length>1){
     var modifiedArr=this.state.invoiceItems;
     modifiedArr.splice(indexToRemove,1);
     this.setState({"invoiceItems":modifiedArr,
                    "total":this.calculateTotal(modifiedArr)
                    });
    }

  }

}