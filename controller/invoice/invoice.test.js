var proxyquire = require('proxyquire');
var Sinon = require('sinon');
var Assert = require('chai').assert;

var dbStub = function(){
                return {
                  getDB: function() {
                    return {
                      create: function(model, callback) {
                        callback(null, {})
                      }
                    }
                  }
                }
};

var successValidateStub = function(logger){
    return {
      validateCreate: (body)=>{
        return {
          status: 'success'
        }
      }
    }
};

var errorValidateStub = function(logger){
    return {
      validateCreate: (body)=>{
        return {
          status: 'error'
        }
      }
    }
};


describe('Test for Invoice controller',()=>{
  
  it('test create invoice for success', (done)=>{

    var InvoiceController = proxyquire('./index.js', {
     '../../db': dbStub,
     '../../lib/validate': successValidateStub
    })();

    var sendStub = function(data) {
                      Assert(data.status === 'success', 'Incorrect status sent');
                      Assert(data.message === 'Invoice sent successfully', 'Incorrect messsage sent');
                      done();
                    }
    
    var resStub = {
      status: function(code) {
        Assert(code === 200, 'incorrect code sent');
        return {
          send: sendStub
        }
      }      
    };

    var reqStub = {
      body: {}
    };

    InvoiceController.create(reqStub,resStub);;
  });

    it('test create invoice for failure', (done)=>{
      var logger={
                  log:function(){}
                  };

      var InvoiceController = proxyquire('./index.js', {
        '../../db': dbStub,
        '../../lib/validate': errorValidateStub
      })(logger);

    var sendStub = function(data) {
                      Assert(data.status === 'error', 'Incorrect status sent');
                      done();
                    }
    
    var resStub = {
      status: function(code) {
        Assert(code === 400, 'incorrect code sent');
        return {
          send: sendStub
        }
      }      
    };

    var reqStub = {
      body: {}
    };

    InvoiceController.create(reqStub,resStub);;
  });

})