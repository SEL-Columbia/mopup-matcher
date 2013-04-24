/*
 * Serve JSON to our AngularJS client
 */
var db = require('monk')('localhost/mopup'),
  csv = require('express-csv');


exports.name = function(req, res) {
  res.json({
    name: "wat"
  });
};
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

