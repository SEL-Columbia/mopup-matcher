var groups = db.nmis_list_edu.group({
  key:{'lga_id':1},
  initial: {sum:0, matched:0, rejected:0, finished:0, left:0},
  reduce: function(curr, result){
    result.sum+=1;
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
printjson(groups);
