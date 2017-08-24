//var MongoClient = require('mongodb').MongoClient
var Mongoose = require('mongoose');
var DBHandler = require('./schema')(Mongoose);
var DB;

module.exports = function(){

    var url = 'mongodb://localhost:27017/invoice';

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
            console.log("Connected mongoDB correctly");
            DB = db;
            letServerKnow(null, db);
          }).catch(function(error){
            letServerKnow(err);
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

