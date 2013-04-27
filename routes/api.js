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
  var sector, db_str, collection, lga_promise, nmis_promise;
  sector = req.params.sector;
  nmis = req.body.nmis;
  lga = req.body.lga;
  if(lga.matched || nmis.matched){
    console.log('rejected');
    res.json({'message':"either facility already paired"});
    return;
  }
  lga_col = db.get('lga_list_'+sector);
  nmis_col = db.get('nmis_list_'+sector);
  lga_promise = lga_col.update(
      lga, {$set:
        {'matched':nmis._id,
          'nmis':nmis}
      });
  lga_promise.on('success', function(b){
    nmis_promise =nmis_col.update(
      nmis, {$set:
        {'matched':lga._id,
          'lga':lga}
      });
      nmis_promise.on('success', function(b){
        res.json({'message':'affirmative'});
        return;
      });
      nmis_promise.on('error', function(e){
        res.json({'message':'database error','err':e});
        return;
      });

  });
  lga_promise.on('error', function(e){
    if (e.name == 'MongoError' &&
      e.err.indexOf('duplicate key error') != -1){
        res.json({'message':'duplicate'});
        return;
      }else{
        res.json({'message':'other_error','err':e});
        return;
      }
  });
};

exports.matching_delete = function (req, res) {
};
