'use strict';

import React from 'react';
import InvoiceFormList from '../../components/invoice-form-list/index.jsx';


export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      name:"",
      email:"",
      dueDate:"",
      total:0.00,
      invoiceItems:[
        {
          description:"",
          amount:0.00
        }
      ]

    }
  }
  
  doSomething(e){
    e.preventDefault();

    var requestBody=this.state;
    requestBody.dueDate=(new Date(requestBody.dueDate)).toISOString();

    $.post("http://localhost:3000/api/v1/invoice/create",requestBody)
    .done(function(data){//update the UI
    })
    .fail(function(err){
      //Update the UI
      console.log('Error ', err);
    });
  } 

  render() {
    var changeNotifierHandler = (e, index) => {
      this.onChangeHandler(e,index)
    };
   
    return(
      <div id="homeView" key="homeView">
        <form onSubmit={this.doSomething.bind(this)}>
          <div>
            <label for="customername">Name</label>
            <input type="text" id="customer-name" name="customer-name" placeholder="Name of customer" 
            value={this.state.name} onChange={(e)=>{this.onChangeHandler(e)}}/>
          </div>
          <div>
            <label for="customeremail">Email</label>
            <input type="email" id="customer-email" name="customer-email" placeholder="Email"
            value={this.state.email} onChange={(e)=>{this.onChangeHandler(e)}}/>
          </div>
          <div>
            <label for="duedate">Due Date</label>
            <input type="date" id="due-date" name="due-date"
            value={this.state.dueDate} onChange={(e)=>{this.onChangeHandler(e)}}/>
          </div>
         <InvoiceFormList list={this.state.invoiceItems} 
                          addInvoiceItem={this.addInvoiceItem.bind(this)} 
                          removeInvoiceItem={this.removeInvoiceItem.bind(this)}
                          changeNotifier={changeNotifierHandler}/>
      
          <div>
            <span>Total</span>
            <span className="currency">$</span>
            <span>{this.state.total}</span>
          </div>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }

  onChangeHandler(e,listIndex){
  
    var changedField=e.target.name;

      switch(changedField){
        case "customer-name":
          this.setState({"name":e.target.value});
          break;
        case "customer-email":
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