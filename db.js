var mongodb = require("mongodb"),
  mongoserver = new mongodb.Server('127.0.0.1', 27017, {}),
  client = new mongodb.Db('mopup', mongoserver, {w:1});
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
var lga_started = function(err, collection){
    collection.distinct('lga',{'matched':{$exists:1}}, function(err, docs){
      var existing_lgas = docs;
      //console.log(existing_lgas);

      
    });
  };
    
client.open(function(e, p_client){
  client.collection('lga_list_edu',lga_started);
  client.collection('lga_list_health',lga_started);
});
  

var list = edu.concat(health).unique().sort();
console.log(list,list.length);
var state_list = [ 'abia', 'anambra', 'benue', 'cross_river', 'delta', 'edo', 'ekiti', 'gombe', 'jigawa', 'kaduna', 'kano', 'kebbi', 'kogi', 'kwara', 'niger', 'ogun', 'ondo', 'oyo', 'zamfara' ];

var lga_list = [ 'aba_north', 'aba_south', 'abeokuta_north', 'agwara', 'akoko_north_east', 'akoko_south_east', 'akoko_south_west', 'anambra_east', 'anka', 'arewa_dandi', 'asa', 'augie', 'bakura', 'balanga', 'bassa', 'biriniwa', 'birnin_gwari', 'birnin_kebbi', 'birnin_kudu', 'boki', 'buji', 'bukkuyum', 'bungudu', 'bunkure', 'bunza', 'efon', 'ekiti_south_west', 'ekiti_west', 'emure', 'esan_central', 'esan_north_east', 'esan_south_east', 'gboko', 'gbonyin', 'gummi', 'gusau', 'gwandu', 'gwer_west', 'ido_osi', 'ifelodun', 'igalamela_odolu', 'igueben', 'irepo', 'jahun', 'kiyawa', 'maradun', 'ngaski', 'obanliku', 'offa', 'oke_ero', 'omala', 'ose', 'owo', 'oye', 'talata_mafara', 'udu', 'uvwie', 'wasagu_danko', 'zuru' ];
