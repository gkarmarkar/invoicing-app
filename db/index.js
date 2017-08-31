//var MongoClient = require('mongodb').MongoClient
var Mongoose = require('mongoose');
var DBHandler = require('./schema')(Mongoose);
var logger = require("winston");
var DB;

module.exports = function(){

    //var url = 'mongodb://localhost:27017/invoice';
    var url = (process.env.NODE_ENV === 'production') ? 'mongodb://heroku_l4chw8hw:rdm68emea4iu3dkgpt1mhlvhjb@ds111204.mlab.com:11204/heroku_l4chw8hw'
              : 'mongodb://localhost:27017/invoice' ;
     logger.log('CONNECTING TO MONGO INSTANCE RUNNING AT', url);
     var  setConnection = function(letServerKnow) {
  
      if(!!DB) {
        var error = "connection already exists call getDB";
        letServerKnow(error);
      }else {
        //MongoClient.connect(url, function(err, db) {
          var promise = Mongoose.connect(url, {
                       useMongoClient: true,
                       });
  
          promise.then(function(db){
            logger.log("info","Connected mongoDB correctly");
            DB = db;
            letServerKnow(null, db);
          }).catch(function(error){
            letServerKnow(error);
          });

      }
    }
    
    var getDB = function(){
      return DBHandler;
    }

    return {
      'setConnection': setConnection,
      'getDB': getDB
    }
}

