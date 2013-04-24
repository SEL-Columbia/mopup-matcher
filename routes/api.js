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
  var type, name, sector, db_str, collection, promise;
  type = req.params.type;
  name = req.params.name;
  sector = req.params.sector;
  db_str = type + "_list_" + sector;
  collection = db.get(db_str);
  if (type=="nmis"){
    promise = collection.find({"lga":name.toUpperCase()});
  }else{
    promise = collection.find({"mylga":name});
  }
  promise.on('success', function(b){
    res.json(b);
  });
  promise.on('error', function(e){
    res.json(e);
  });
};

