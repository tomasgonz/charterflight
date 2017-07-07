// This function is used to create return id's that do not contains
// characters that conflict with event handlers
String.prototype.replaceAll = function (find, replace) {
  return this.replace(new RegExp(find, 'g'), replace);
};

String.prototype.sanitize = function () {
  
  var s = this.replace(/\W+/g, "");
  return s;
};
