/*
 * Serve JSON to our AngularJS client
 */
var db = require('monk')('localhost/mopup'),
  _ = require('underscore'),
  mongodb = require('mongodb'),
  mongoserver = new mongodb.Server('127.0.0.1', 27017, {}),
  client = new mongodb.Db('mopup', mongoserver, {w:1});

exports.lga_summaries = function (req, res) {
  var db_str = "matched_totals";
  var collection = db.get(db_str);
  var promise = collection.find({full:true}); // full: true => all totals
  promise.on('success', function(b) {
      res.json(b);
  });
  promise.on('error', function(e) {
    res.json(e);
  });
};

exports.state_summaries = function (req, res) {
};

exports.facilities = function (req, res) {
  var type, id, sector, db_str, collection, promise;
  type = req.params.type;
  id = +req.params.id;
  sector = req.params.sector;
  db_str = type + "_list_" + sector;
  collection = db.get(db_str);
  if (type=="nmis"){
    promise = collection.find({"lga_id": id});
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

/* Turn an array of objects into a csv */
var toCsv = function(objArr, keysToExclude) {
    var res = "";
    // First we need to find all the keys that we might need for this csv
    var allKeys = _.unique(_.flatten(_.map(objArr, function(o) {
                    return _.keys(o); })));
    allKeys = _.difference(allKeys, keysToExclude);
    res = res + allKeys.join() + "\n";
    // Now we go through each obj, but making sure to map to allKeys
    _.each(objArr, function(obj) {
        var row = _.map(allKeys, function(key) {
            return obj[key] ? obj[key] : "";
        });
        res = res + row.join() + "\n";
    });
    return res;
};

exports.download = function (req, res) {
  var type, id, sector, db_str, collection, promise;
  type = req.params.type;
  id = +req.params.id;
  sector = req.params.sector;
  db_str = type + "_list_" + sector;
  collection = db.get(db_str);
  if (type=="nmis"){
    promise = collection.find({"lga_id": id});
  }else{
    promise = collection.find({"lga_id": id});
  }
  promise.on('success', function(b){
    res.attachment(type + "_" + sector + '_data__lga_' + id + '.csv');
    var keysToExclude = (type=="nmis") ?
                        ['_id', 'lga', 'modified_date','long_id'] :
                        ['_id', 'nmis', 'modified_date','long_id'];
    res.end(toCsv(b, keysToExclude));
  });
  promise.on('error', function(e){
    res.json(e);
  });
};

exports.matching_create = function (req, res) {
  var sector, db_str, collection, timestamp, lga_col, nmis_col, lga_promise, nmis_promise;
  sector = req.params.sector;
  nmis = req.body.nmis;
  lga = req.body.lga;
  timestamp = new Date();
  if(lga.matched || nmis.matched){
    res.json({'message':"either facility already paired"});
    return;
  }
  lga_col = db.get('lga_list_'+sector);
  nmis_col = db.get('nmis_list_'+sector);
  lga_promise = lga_col.update(
      {'_id':lga._id}, {$set:
        {'matched':nmis._id,
          'modified_date': timestamp,
          'nmis':nmis}
      });
  lga_promise.on('success', function(b){
    nmis_promise = nmis_col.update(
      {'_id':nmis._id}, {$set:
        {'matched':lga._id,
          'modified_date': timestamp,
          'lga':lga}
      });
      nmis_promise.on('success', function(b){
        fin_promise = lga_col.findOne({'_id':lga._id});
        fin_promise.on('success', function(b){
          res.json({'message':'affirmative','data':b});
          return;
        });
        fin_promise.on('error', function(e){
          res.json({'message':'database error','err':e});
          return;
        });
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
  var sector = req.params.sector;
  var lga = req.body;
  var lga_id = lga._id;
  var nmis_id = lga.matched;
  var nmis = lga.nmis;
  var lga_col = db.get('lga_list_' + sector);
  var nmis_col = db.get('nmis_list_' + sector);
  var lga_promise = lga_col.update({"_id":lga_id}, {$unset: {
    'matched' : 1, 
    'modified_date' : 1, 
    'nmis' : 1}});
  lga_promise.on('success', function(b){
    var nmis_promise = nmis_col.update({"_id": nmis_id}, {$unset: {
      'matched' : 1, 
      'modified_date' : 1, 
      'lga' : 1}});
    nmis_promise.on('success', function(b){
      res.json({'message':'affirmative'});
      return;
    });
    nmis_promise.on('error', function(e){
      console.log(e);
      res.json({'message':'database error', 'error':e});
      return;
    });
  });
  lga_promise.on('error', function(e){
    res.json({'message':'database error', 'error':e});
    return;
  });
};

exports.matching_reject = function (req, res) {
  var sector, reason, timestamp, fac, db_str, nmis_col, nmis_promise;
  sector = req.params.sector;
  fac = req.body;
  nmis_id = fac._id;
  reason = fac.rejected;
  timestamp = new Date();

  nmis_col = db.get('nmis_list_'+sector);

  nmis_promise =nmis_col.update(
    {'_id':nmis_id}, {$set:
      {'rejected':reason, 
       'modified_date':timestamp}
    });
  nmis_promise.on('success', function(b){
    res.json({'message':'affirmative'});
  });
  nmis_promise.on('error', function(e){
    res.json({'message':'database error','err':e});
    return;
  });

};

exports.matching_clearreject = function (req, res) {
  var sector, reason, fac, db_str, collection, nmis_col, nmis_promise;
  sector = req.params.sector;
  fac = req.body;
  nmis_id = fac._id;

  nmis_col = db.get('nmis_list_'+sector);

  nmis_promise =nmis_col.update(
    {'_id':nmis_id}, {$unset:
      {'rejected':1,
       'modified_date':1}
    });
  nmis_promise.on('success', function(b){
    res.json({'message':'affirmative'});
  });
  nmis_promise.on('error', function(e){
    res.json({'message':'database error','err':e});
    return;
  });

};

