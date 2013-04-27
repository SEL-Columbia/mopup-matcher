/*
 * Serve JSON to our AngularJS client
 */
var db = require('monk')('localhost/mopup'),
  csv = require('express-csv');

exports.facilities = function (req, res) {
  var type, id, sector, db_str, collection, promise;
  type = req.params.type;
  id = +req.params.id;
  sector = req.params.sector;
  db_str = type + "_list_" + sector;
  collection = db.get(db_str);
  if (type=="nmis"){
    promise = collection.find({"X_lga_id": id});
  }else{
    promise = collection.find({"lga_id": id});
  }
  promise.on('success', function(b){
    res.json(b);
  });
  promise.on('error', function(e){
    res.json(e);
  });
};

exports.matching_create = function (req, res) {
  var sector, db_str, collection, promise;
  sector = req.params.sector;
  db_str = 'paired_list_' + sector;
  collection = db.get(db_str);
  promise = collection.insert(req.body);
  promise.on('success', function(b){
    res.json({'message':'affirmative'});
  });
  promise.on('error', function(e){
    if (e.name == 'MongoError' &&
      e.err.indexOf('duplicate key error') != -1){
        res.json({'message':'duplicate'});
      }else{
        res.json({'message':'other_error','err':e});
      }
  });
};

exports.matching_delete = function (req, res) {
};
