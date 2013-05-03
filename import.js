
var db = require('monk')('localhost/mopup'),
    async = require('async'),
    fs = require('fs'),
    filepath = 'csvs/';

var read = function(filename,cb){
  // readfile takes an second option of string encoding,
  // otherwise returns buffer
  fs.readFile(filepath + filename, 'utf8', function(e, file){
    cb(file);
  });
};

/*
 *[ 'BASELINE_hospitals.csv',
  'BASELINE_schools.csv',
  'FACILITY_LIST_hospitals.csv',
  'FACILITY_LIST_schools.csv' ]

  */
var nmis_health = function(cb){
  read('BASELINE_hospitals.csv', function(file){
    var arr = file.split('\n');
    var len = arr.length;
    var header_arr = arr[0];
    var json = [];
    for (var i=1; i< len; i++) {
      var line_obj = line2json(header_arr, arr[i]);
      json.push(line_obj);
    }
    cb(json);
  });
};

var line2json = function(header_arr, line){
  var fields = line.split(',');
  var headers = header_arr.split(',');
  json = {};
  for (var i=0; i< headers.length; i++) {
    json[headers[i]] = fields[i];
  }
  return json;
};


nmis_health(function(json){
  console.log(json[8]);
});




