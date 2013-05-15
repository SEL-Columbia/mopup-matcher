var mongodb = require("mongodb"),
  mongoserver = new mongodb.Server('127.0.0.1', 27017, {}),
  client = new mongodb.Db('mopup', mongoserver, {w:1});
    
var lga_started_cb = function(cb){
  return function(err, collection){
    cur = collection.distinct('lga',{'matched':{$exists:1}}, function(err,docs){
      cb(docs);
    });
  };
};
client.open(function(e, p_client){
  client.collection('lga_list_health',lga_started_cb(function(list1){
    client.collection('lga_list_edu', lga_started_cb(function(list2){
      var unique_list = list1.concat(list2).unique().sort();
      var prev_list = day_1_lga_list.concat(day_2_lga_list).concat(day_3_5_lga_list).unique().sort();
      var diff_list = unique_list.diff(prev_list);
      //console.log(diff_list, diff_list.length);

    }));


  }));
});

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
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
};

//var list = edu.concat(health).unique().sort();
var day_1_state_list = [ 'abia', 'anambra', 'benue', 'cross_river', 'delta', 'edo', 'ekiti', 'gombe', 'jigawa', 'kaduna', 'kano', 'kebbi', 'kogi', 'kwara', 'niger', 'ogun', 'ondo', 'oyo', 'zamfara' ];

var day_2_state_list = [ 'adamawa', 'bauchi', 'borno', 'fct', 'imo', 'lagos', 'nasarawa', 'osun', 'plateau', 'taraba', 'yobe' ];

var day_3_5_state_list = [ 'bayelsa', 'enugu', 'katsina', 'sokoto' ];

var day_6_state_list = [ 'ebonyi' ];

var day_1_lga_list = [ 'aba_north', 'aba_south', 'abeokuta_north', 'agwara', 'akoko_north_east', 'akoko_south_east', 'akoko_south_west', 'anambra_east', 'anka', 'arewa_dandi', 'asa', 'augie', 'bakura', 'balanga', 'bassa', 'biriniwa', 'birnin_gwari', 'birnin_kebbi', 'birnin_kudu', 'boki', 'buji', 'bukkuyum', 'bungudu', 'bunkure', 'bunza', 'efon', 'ekiti_south_west', 'ekiti_west', 'emure', 'esan_central', 'esan_north_east', 'esan_south_east', 'gboko', 'gbonyin', 'gummi', 'gusau', 'gwandu', 'gwer_west', 'ido_osi', 'ifelodun', 'igalamela_odolu', 'igueben', 'irepo', 'jahun', 'kiyawa', 'maradun', 'ngaski', 'obanliku', 'offa', 'oke_ero', 'omala', 'ose', 'owo', 'oye', 'talata_mafara', 'udu', 'uvwie', 'wasagu_danko', 'zuru' ];

//var difff = list.diff(day_1_lga_list);
//console.log(difff, difff.length);

var day_2_lga_list = [ 'afijio', 'agege', 'ajeromi_ifelodun', 'ajingi', 'akinyele', 'akoko_north_west', 'albasu', 'apapa', 'atiba', 'bagudo', 'bali', 'bichi', 'billiri', 'birnin_magaji', 'bursari', 'buruku', 'burutu', 'bwari', 'damaturu', 'darazo', 'demsa', 'edu', 'ehime_mbano', 'epe', 'fakai', 'fufore', 'ganye', 'garun_mallam', 'gashaka', 'gubio', 'gujba', 'gulani', 'guzamala', 'hong', 'ibadan_north', 'ibarapa_north', 'ifedore', 'ijebu_east', 'ijebu_north', 'ikorodu', 'iwajowa', 'jaba', 'jega', 'kabo', 'kaga', 'kagarko', 'kalgo', 'kaltungo', 'kano_municipal', 'kaura', 'kaura_namoda', 'kibiya', 'koko_besse', 'kokona', 'kukawa', 'langtang_south', 'madagali', 'magumeri', 'maiyama', 'marte', 'mobbar', 'nganzai', 'njaba', 'nkwerre', 'nwangele', 'obokun', 'ogun_waterside', 'oguta', 'okitipupa', 'sakaba', 'sanga', 'sapele', 'sardauna', 'shanga', 'shinkafi', 'shomgom', 'suru', 'tsafe', 'yauri', 'yunusari' ];

var day_3_5_lga_list = [ 'abaji',
  'abeokuta_south', 'abi', 'abuja_municipal', 'ado_ekiti', 'ado_odo_ota', 'aiyedade', 'aiyedire', 'ajaokuta', 'akko', 'akure_north', 'akwanga', 'aliero', 'alimosho', 'alkaleri', 'amuwo_odofin', 'aninri', 'ankpa', 'ardo_kola', 'argungu', 'atakunmosa_east', 'atisbo', 'auyo', 'awe', 'awgu', 'babura', 'badagry', 'bade', 'bagwai', 'barikin_ladi', 'baruten', 'batsari', 'baure', 'bayo', 'bebeji', 'bida', 'bindawa', 'biu', 'bodinga', 'boluwaduro', 'borgu', 'boripe', 'bosso', 'chibok', 'chikun', 'dala', 'damban', 'dambatta', 'dandi', 'dandume', 'dange_shuni', 'danja', 'daura', 'dawakin_kudu', 'dawakin_tofa', 'dekina', 'doguwa', 'doma', 'dukku', 'dutse', 'dutsi', 'ede_north', 'ede_south', 'egbado_north', 'egbado_south', 'egbeda', 'egbedore', 'egor', 'ejigbo', 'ekiti', 'ekiti_east', 'esan_west', 'ese_odo', 'eti_osa', 'ewekoro', 'ezeagu', 'fagge', 'faskari', 'funakaye', 'gabasawa', 'gagarawa', 'gamawa', 'ganjuwa', 'garki', 'garko', 'gezawa', 'giade', 'giwa', 'gombe', 'gumel', 'gurara', 'guri', 'guyuk', 'gwale', 'gwaram', 'gwarzo', 'hadejia', 'ibadan_north_east', 'ibadan_north_west', 'ibadan_south_east', 'ibadan_south_west', 'ibaji', 'ibarapa_central', 'ibarapa_east', 'ibeju_lekki', 'idanre', 'ido', 'ifako_ijaye', 'ife_east', 'ife_north', 'ife_south', 'ifedayo', 'ifo', 'igabi', 'ijebu_north_east', 'ijebu_ode', 'ijero', 'ikeja', 'ikenne', 'ikere', 'ikole', 'ila', 'ilejemeje', 'ilesha_east', 'ilesha_west', 'ilorin_east', 'ilorin_south', 'ilorin_west', 'imeko_afon', 'ingawa', 'ipokia', 'irepodun', 'irepodun_ifelodun', 'irewole', 'ise_orun', 'iseyin', 'isin', 'isokan', 'itesiwaju', 'iwo', 'jada', 'jakusko', 'jalingo', 'jos_south', 'kachia', 'kafin_hausa', 'kaiama', 'kajola', 'kankara', 'kanke', 'kankia', 'karasuwa', 'karim_lamido', 'karu', 'katsina_ala', 'kaugama', 'kauru', 'kazaure', 'keana', 'kebbe', 'keffi', 'kiri_kasamma', 'kiru', 'konshisha', 'kontagora', 'kosofe', 'kumbotso', 'kunchi', 'kura', 'kusada', 'kwali', 'kwami', 'kwande', 'lagelu', 'lagos_island', 'lagos_mainland', 'langtang_north', 'lau', 'lere', 'logo', 'lokoja', 'machina', 'madobi', 'magama', 'mai_adua', 'maigatari', 'makoda', 'mallam_madori', 'mangu', 'mani', 'maru', 'mashi', 'mayo_belwa', 'miga', 'mikang', 'minjibir', 'misau', 'moba', 'moro', 'mubi_north', 'mubi_south', 'mushin', 'nafada', 'nangere', 'nasarawa', 'nasarawa_eggon', 'nembe', 'nguru', 'ningi', 'numan', 'obafemi_owode', 'obi', 'odeda', 'odigbo', 'odo_otin', 'odogbolu', 'ofu', 'ogbia', 'ogbomoso_north', 'ogbomoso_south', 'ogo_oluwa', 'oji_river', 'ojo', 'okene', 'ola_oluwa', 'olamabolo', 'olorunda', 'olorunsogo', 'oluyole', 'ona_ara', 'ondo_east', 'ondo_west', 'orelope', 'oriade', 'oriire', 'orolu', 'oshimili_north', 'oshodi_isolo', 'osogbo', 'oyo_east', 'oyo_west', 'oyun', 'patigi', 'qua_an_pan', 'rafi', 'rano', 'remo_north', 'rimin_gado', 'ringim', 'rogo', 'saki_east', 'saki_west', 'sandamu', 'shagamu', 'shagari', 'shani', 'shanono', 'shelleng', 'shendam', 'shira', 'shomolu', 'soba', 'sule_tankarkar', 'suleja', 'sumaila', 'surulere', 'takai', 'takum', 'tambuwal', 'tarmuwa', 'taura', 'tofa', 'toungo', 'tsanyawa', 'tudun_wada', 'tureta', 'ughelli_north', 'ughelli_south', 'ukum', 'ungogo', 'ushongo', 'wamba', 'warji', 'warri_north', 'warri_south', 'warri_south_west', 'wase', 'wushishi', 'yabo', 'yamaltu_deba', 'yusufari', 'zango', 'zaria', 'zing', 'zurmi' ];

var dat_6_lga_list = [ 'afikpo_south', 'atakunmosa_west', 'awka_north', 'ayamelum', 'bama', 'batagarawa', 'binji', 'chanchaga', 'charanchi', 'dass', 'dikwa', 'dunukofia', 'dutsin_ma', 'ezza_north', 'gada', 'gaya', 'geidam', 'gombi', 'goronyo', 'gudu', 'gwadabawa', 'gwiwa', 'ife_central', 'igbo_etiti', 'ijumu', 'ikara', 'ile_oluji_okeigbo', 'illela', 'irele', 'isa', 'jema_a', 'jibia', 'jos_east', 'jos_north', 'kabba_bunu', 'kala_balge', 'katcha', 'kurfi', 'lafia', 'mafa', 'mopa_muro', 'nassarawa', 'ngala', 'ngor_okpala', 'nnewi_south', 'onitsha_north', 'osisioma_ngwa', 'oyi', 'patani', 'rabah', 'rijau', 'roni', 'sabon_birni', 'silame', 'tafa', 'tangaza', 'tarauni', 'udi', 'ugwunagbo', 'ukwa_east', 'ukwa_west', 'ukwuani', 'warawa', 'wudil', 'wurno', 'yankwashi', 'yorro' ];
