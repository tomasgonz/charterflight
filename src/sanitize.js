// This function is used to create return id's that do not contains
// characters that conflict with event handlers
String.prototype.replaceAll = function (find, replace) {
  return this.replace(new RegExp(find, 'g'), replace);
};

String.prototype.sanitize = function () {

  /*var s = this.replaceAll(" ", "_");
  s = s.replaceAll(",", "");
  s = s.replace("&", "");
  s = s.replace(":", "");
  s = s.replace(".", "");
  s = s.replace(/\(|\)/g,'');
  console.log(s);*/

  var s = this.replace(/\W+/g, " ");
  return s;
};
