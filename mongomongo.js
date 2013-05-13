
db.matched_totals.drop()
var groups = db.nmis_list_edu.group({
  key:{'state':1, 'lga': 1, 'lga_id':1},
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
  }
});
groups.forEach(function(g) {db.matched_totals.save(g)});

var groups = db.nmis_list_health.group({
  key:{'state':1, 'lga_id':1},
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
  }
});
groups.forEach(function(g) {db.matched_totals.save(g)});
