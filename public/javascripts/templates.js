(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['instrument-controls'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <option value=\""
    + escapeExpression(((stack1 = depth0.ident),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = depth0.fullName),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\n    ";
  return buffer;
  }

  buffer += "<section id=\"controls\" class=\"clearfix\">\n  <div id=\"play-area\"></div>\n  <select id=\"instrument-selector\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.instruments, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </select>\n</section>\n\n";
  return buffer;
  });
templates['messages'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<section id=\"messages\">\n  <section id=\"display\" class=\"clearfix\"></section>\n  <textarea id=\"input\"></textarea>\n</section>\n";
  });
})();