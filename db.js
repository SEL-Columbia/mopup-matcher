var mongodb = require("mongodb"),
  mongoserver = new mongodb.Server('127.0.0.1', 27017, {}),
  client = new mongodb.Db('mopup', mongoserver, {w:1});
    
var lga_started_cb = function(cb){
  return function(err, collection){
    cur = collection.distinct('lga_id',{'matched':{$exists:1}}, function(err,docs){
      console.log(docs);
      cb(docs);
    });
  };
};
client.open(function(e, p_client){
  var callMe = function(x) { console.log('x is '); };
  client.collection('nmis_list_health',lga_started_cb(callMe));
});

//Array.prototype.unique = function() {
//    var a = this.concat();
//    for(var i=0; i<a.length; ++i) {
//        for(var j=i+1; j<a.length; ++j) {
//            if(a[i] === a[j])
//                a.splice(j--, 1);
//        }
//    }
//    return a;
//};
//Array.prototype.diff = function(a) {
//    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
//};
//
//var list = edu.concat(health).unique().sort();
//var day_1_state_list = [ 'abia', 'anambra', 'benue', 'cross_river', 'delta', 'edo', 'ekiti', 'gombe', 'jigawa', 'kaduna', 'kano', 'kebbi', 'kogi', 'kwara', 'niger', 'ogun', 'ondo', 'oyo', 'zamfara' ];

//var day_1_lga_list = [ 'aba_north', 'aba_south', 'abeokuta_north', 'agwara', 'akoko_north_east', 'akoko_south_east', 'akoko_south_west', 'anambra_east', 'anka', 'arewa_dandi', 'asa', 'augie', 'bakura', 'balanga', 'bassa', 'biriniwa', 'birnin_gwari', 'birnin_kebbi', 'birnin_kudu', 'boki', 'buji', 'bukkuyum', 'bungudu', 'bunkure', 'bunza', 'efon', 'ekiti_south_west', 'ekiti_west', 'emure', 'esan_central', 'esan_north_east', 'esan_south_east', 'gboko', 'gbonyin', 'gummi', 'gusau', 'gwandu', 'gwer_west', 'ido_osi', 'ifelodun', 'igalamela_odolu', 'igueben', 'irepo', 'jahun', 'kiyawa', 'maradun', 'ngaski', 'obanliku', 'offa', 'oke_ero', 'omala', 'ose', 'owo', 'oye', 'talata_mafara', 'udu', 'uvwie', 'wasagu_danko', 'zuru' ];

//var difff = list.diff(day_1_lga_list);
//console.log(difff, difff.length);

//var day_2_lga_list = [ 'afijio', 'agege', 'ajeromi_ifelodun', 'ajingi', 'akinyele', 'akoko_north_west', 'albasu', 'apapa', 'atiba', 'bagudo', 'bali', 'bichi', 'billiri', 'birnin_magaji', 'bursari', 'buruku', 'burutu', 'bwari', 'damaturu', 'darazo', 'demsa', 'edu', 'ehime_mbano', 'epe', 'fakai', 'fufore', 'ganye', 'garun_mallam', 'gashaka', 'gubio', 'gujba', 'gulani', 'guzamala', 'hong', 'ibadan_north', 'ibarapa_north', 'ifedore', 'ijebu_east', 'ijebu_north', 'ikorodu', 'iwajowa', 'jaba', 'jega', 'kabo', 'kaga', 'kagarko', 'kalgo', 'kaltungo', 'kano_municipal', 'kaura', 'kaura_namoda', 'kibiya', 'koko_besse', 'kokona', 'kukawa', 'langtang_south', 'madagali', 'magumeri', 'maiyama', 'marte', 'mobbar', 'nganzai', 'njaba', 'nkwerre', 'nwangele', 'obokun', 'ogun_waterside', 'oguta', 'okitipupa', 'sakaba', 'sanga', 'sapele', 'sardauna', 'shanga', 'shinkafi', 'shomgom', 'suru', 'tsafe', 'yauri', 'yunusari' ];
