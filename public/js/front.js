//resize page to fit vertical scroll
var onResize = function(){
  var h = $(window).height() - 128;
  $('#nmis_list').css({height: h});
};
$(window).on('resize', onResize);
$(function(){
  $(window).trigger('resize');
});
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
