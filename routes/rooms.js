exports.room = function(req, res) {
  res.render('index', { title: req.params[0] });
};

