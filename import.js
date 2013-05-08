var db = require('monk')('localhost/mopup'),
    async = require('async'),
    fs = require('fs'),
    _ = require('underscore'),
    filepath = 'csvs/';

var nmis_health = 'BASELINE_hospitals.csv',
  nmis_edu = 'BASELINE_schools.csv',
  lga_health = 'FACILITY_LIST_hospitals.csv',
  lga_edu = 'FACILITY_LIST_schools.csv';


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


var insert_json = function(col_name, json){
  var collection = db.get(col_name);
  for (var i=0; i<json.length; i++){
    var current_json = json[i];
    var long_id = current_json.long_id;
    var promise = collection.update({"long_id":long_id},{$set:current_json},{upsert:true});
    promise.on('success', function(b){
    });
    promise.on('error', function(e){
      console.log('error in find',e);
    });
  }
  console.log('done');
};

file2json(nmis_health, function(json){
  console.log(json, json.length);

  insert_json('nmis_list_health',json);
});

