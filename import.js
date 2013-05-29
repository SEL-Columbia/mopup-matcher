var db = require('monk')('localhost/mopup'),
  mongodb = require('mongodb'),
  mongoserver = new mongodb.Server('127.0.0.1', 27017, {}),
  client = new mongodb.Db('mopup', mongoserver, {w:1});
  async = require('async'),
  fs = require('fs'),
  _ = require('underscore'),
  filepath = '../nigeria_mopup_data/';

var nmis_health = 'BASELINE_hospitals.csv',
  nmis_health_col = 'nmis_list_health',
  nmis_edu = 'BASELINE_schools.csv',
  nmis_edu_col = 'nmis_list_edu',
  lga_health = 'FACILITY_LIST_hospitals.csv',
  lga_health_col = 'lga_list_health',
  lga_edu = 'FACILITY_LIST_schools.csv';
  lga_edu_col = 'lga_list_edu';

var insert_json_native = function(col_name, json, cb){
};

var read = function(filename,cb){
  // readfile takes an second option of string encoding,
  // otherwise returns buffer
  fs.readFile(filepath + filename, 'utf8', function(e, file){
    cb(file);
  });
};

var file2json = function(filename, cb){
  read(filename, function(file){
    var arr = file.split('\n');
    var len = arr.length;
    var header_arr = arr[0];
    var json = [];
    for (var i=1; i< len-1; i++) {
      var line_obj = line2json(header_arr, arr[i]);
      json.push(line_obj);
    }
    cb(json);
  });
};

var line2json = function(header_arr, line){
  var fields = line
                .replace(/\"/g,'')
                .split(',');
  var headers = header_arr
                .replace(/\"/g,'')
                .split(',');
  json = {};
  for (var i=0; i< headers.length; i++) {
    json[headers[i]] = fields[i];
  }
  return json;
};



var insert_json_bulk = function(col_name, json){
  //this is not used now
  var collection = db.get(col_name);
  //get everything into memory
  console.log(json);
  var promise = collection.insert(json);
  promise.on('success', function(b){
    console.log(b);
  });
  promise.on('error',function(e){
    console.log(e);
  });
  console.log('done');
};


var insert_json = function(col_name, json, cb){
  var collection = db.get(col_name);
  for (var i=0; i<json.length; i++){
    var current_json = json[i];
    var long_id = current_json.long_id;
    var promise = collection.update({"long_id":long_id},
        {$set:current_json},
        {upsert:true});
  }
  cb();
};

var file2db = function(file, db, cb){
  file2json(file, function(json){
    insert_json(db, json, cb);
  });
};

async.series([
  function(callback){console.log('start'),callback();},
  function(callback){file2db(nmis_health, nmis_health_col, callback);},
  function(callback){file2db(nmis_edu, nmis_edu_col, callback);},
  function(callback){file2db(lga_health, lga_health_col, callback);},
  function(callback){file2db(lga_edu, lga_edu_col, callback);},
  function(callback){console.log('done'),callback();}
]);


