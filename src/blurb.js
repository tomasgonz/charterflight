charterflight.Blurb = function Blurb()
{
  this.Data = null;
  this.BlurbPlaceHolder = "";
};

charterflight.Blurb.prototype.Draw = function()
{
  //var currClass = d3.select(this).attr("class");
  //d3.select(this).attr("class", currClass + " current");
  var entityCode = this.Data.key;
  /*var entityVals = startEnd[entityCode];
  var percentChange = 100 * (entityVals['endVal'] - entityVals['startVal']) / entityVals['startVal'];*/

  /* Put years in array to calculate max and min*/
  var years = [];
  var values = [];

  this.Data.values.forEach(function(e) {

    years.push(e.date.getFullYear());
    values.push(e.value);

  });

  minValue = getMinOfArray(values);

  maxValue = getMaxOfArray(values);

  var blurb = '<h2>' + entityCode + '</h2>';

  blurb += "Min value:" + minValue + " max value: " + maxValue;

  blurb += "<p>";

  blurb += "</p>";

  $(this.BlurbPlaceHolder).html(blurb);

};
