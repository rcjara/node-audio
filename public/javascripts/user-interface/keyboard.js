define([], function() {
  var public = {}
    , keys = []
    ;

  public.isPushed = function(i) {
    return keys[i];
  };

  public.push = function(i) {
    keys[i] = true;
  };

  public.release = function(i) {
    keys[i] = false;
  };

  return public;
});
