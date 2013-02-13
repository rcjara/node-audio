define(function() {
  var keys = [];

  var isPushed = function(i) {
    return keys[i];
  };

  var push = function(i) {
    keys[i] = true;
  };

  var release = function(i) {
    keys[i] = false;
  };

  return {
    isPushed: isPushed
  , push: push
  , release: release
  };
});
