
/* HEALTH + EDUCATION -- INTERMEDIARY RESULTS */
var reducing = function(type, sector){
  var ini;
  if(sector==='edu'){
    ini = {total:0, matched:0, rejected:0, finished:0, left:0, education: true};
  }else if (sector === 'health'){
    ini = {total:0, matched:0, rejected:0, finished:0, left:0, health: true};
  }
  if (type === 'state'){
    key = {'state':1};
  }else if (type === 'lga'){
    key = {'lga_id':1};
  }
  return {
    key: key,
    initial: ini,
    reduce: function(curr, result){
      result.total+=1;
      if(curr.matched){
        result.finished+=1;
        result.matched += 1;
      }else if(curr.rejected){
        result.finished += 1;
        result.rejected += 1;
      }else{
        result.left+=1;
      }
      if(!(result.state)){
        if(curr.state){
          result.state = curr.state;
        }
      }
      if(!(result.lga)){
        if(typeof curr.lga == 'string' && curr.lga !== ''){
          result.lga = curr.lga;
        }else if (typeof curr.lga === 'object'){
          result.lga = curr.lga.lga;
        }
      }
    }
  };
};

var populating = function(type){
  if (type === 'state'){
    key = {'state':1};
  }else if (type === 'lga'){
    key = {'lga_id':1};
  }
    return {
    key: key,
    initial: {total:0, matched:0, rejected:0, finished:0, left:0, full: true,
              edu_total:0, edu_matched:0, edu_rejected:0, edu_finished:0, edu_left:0,
              health_total:0, health_matched:0, health_rejected:0, health_finished:0, health_left:0},
    reduce: function(curr, result){
      if (curr.education) {
        result.edu_total += curr.total;
        result.edu_matched += curr.matched;
        result.edu_finished += curr.finished;
        result.edu_left += curr.left;
        result.edu_rejected += curr.rejected;
      } else { // curr.health
        result.health_total += curr.total;
        result.health_matched += curr.matched;
        result.health_finished += curr.finished;
        result.health_left += curr.left;
        result.health_rejected += curr.rejected;
      }
      result.total += curr.total;
      result.matched += curr.matched;
      result.finished += curr.finished;
      result.left += curr.left;
      result.rejected += curr.rejected;
      result.state = curr.state;
      result.lga = curr.lga;
    }
  };
};

function reduce_nmis(type){
  var edu_groups = db.nmis_list_edu.group(reducing(type, 'edu'));
  db.matched_totals_tmp.save(edu_groups);
  var health_groups = db.nmis_list_health.group(reducing(type, 'health'));
  db.matched_totals_tmp.save(health_groups);
  var final_nmis = db.matched_totals_tmp.group(populating(type));
  db.matched_totals_tmp.drop();
  db.matched_totals.drop();
  db.matched_totals.save(final_nmis);
}

reduce_nmis('state');


