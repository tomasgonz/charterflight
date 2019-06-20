class Blurb {
  constructor()
  {
    this.Data = null;
    this.BlurbPlaceHolder = "";
  }

  Draw()
  {
    var entityCode = this.Data.key;
    
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
  }

}

export default Blurb;
