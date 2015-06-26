charterflight.Blurb = function Blurb()
{
  var currClass = d3.select(this).attr("class");
  d3.select(this).attr("class", currClass + " current");
  var countryCode = d["key"];
  /*var countryVals = startEnd[countryCode];
  var percentChange = 100 * (countryVals['endVal'] - countryVals['startVal']) / countryVals['startVal'];*/

  /* Put years in array to calculate max and min*/
  years = [];
  values = [];

  d.values.forEach(function(e) {

    years.push(e.date.getFullYear());

    values.push(e.value);

  });

  minValue = getMinOfArray(values);

  maxValue = getMaxOfArray(values)

  var blurb = '<h2>' + countryCode + '</h2>';

  blurb += "Min value:" + minValue + " max value: " + maxValue;

  blurb += "<p>";

  blurb += "</p>"

  $("#blurb-content").html(blurb);
}
