//resize page to fit vertical scroll
var onResize = function(){
  var h = $(window).height() - 128;
  $('#nmis_list').css({height: h});
};
$(window).on('resize', onResize);
$(function(){
  $(window).trigger('resize');
});

