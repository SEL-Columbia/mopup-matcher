
/* HEALTH + EDUCATION -- INTERMEDIARY RESULTS */
db.matched_totals_tmp.drop()
var groups = db.nmis_list_edu.group({
  key:{'lga_id':1},
  initial: {total:0, matched:0, rejected:0, finished:0, left:0, education: true},
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
      if(typeof curr.lga == 'string'){
        result.lga = curr.lga;
      }
    }
  }
});
groups.forEach(function(g) {db.matched_totals_tmp.save(g)});

var groups = db.nmis_list_health.group({
  key:{'lga_id':1},
  initial: {total:0, matched:0, rejected:0, finished:0, left:0, health: true},
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
      if(typeof curr.lga == 'string'){
        result.lga = curr.lga;
      }
    }
  }
});
groups.forEach(function(g) {db.matched_totals_tmp.save(g)});

/* GROUP TMP TABLE INTO NON TMP TABLE */
var groups = db.matched_totals_tmp.group({
  key:{'lga_id':1},
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
});
/* TOTALLY RE-WRITE THE TOTALS TABLE */
db.matched_totals_tmp.drop()
db.matched_totals.drop()
db.matched_totals.drop()
groups.forEach(function(g) {db.matched_totals.save(g)});
