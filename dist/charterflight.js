(function(global) {

    var charterflight = {
        'version': '0.1'
    };

    if (global.charterflight) {
        throw new Error('Charterflight has already been defined');
    } else {
        global.charterflight = charterflight;
    };

})(typeof window === 'undefined' ? this : window);
;function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}
;charterflight.Blurb = function Blurb()
{
  this.Data = null;
  this.BlurbPlaceHolder = "";
};

charterflight.Blurb.prototype.Draw = function()
{
  var currClass = d3.select(this).attr("class");
  d3.select(this).attr("class", currClass + " current");
  var countryCode = this.Data.key;
  /*var countryVals = startEnd[countryCode];
  var percentChange = 100 * (countryVals['endVal'] - countryVals['startVal']) / countryVals['startVal'];*/

  /* Put years in array to calculate max and min*/
  years = [];
  values = [];

  this.Data.values.forEach(function(e) {

    years.push(e.date.getFullYear());

    values.push(e.value);

  });

  minValue = getMinOfArray(values);

  maxValue = getMaxOfArray(values);

  var blurb = '<h2>' + countryCode + '</h2>';

  blurb += "Min value:" + minValue + " max value: " + maxValue;

  blurb += "<p>";

  blurb += "</p>";

  $(this.BlurbPlaceHolder).html(blurb);
};
;charterflight.BarChart = function BarChart()
{
  this.ShowLegend = false;
  this.Width = 200;
  this.Height = 200;
  this.svg = null;

  this.Margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };

  this.BlurbPlaceHolder = "";
  this.ChartPlaceHolder = "";

  this.Data = null;
};

charterflight.BarChart.prototype.Draw = function() {

  this.svg = null;

      width = this.Width - this.Margin.left - this.Margin.right;
      height = this.Height - this.Margin.top - this.Margin.bottom;

// Coerce the data into the right formats
    data = data.map(function(d) {
        return {
            country: d.country,
            value: +d.value
        };
    });

    var y = d3.scale.linear()
        .range([ height, 0]);

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1)
        .domain(d3.entries(data).map(function(d) {
            return d.value.country;
        }));

    y.domain([d3.min(data, function(d) {
        return d.value;
    }), d3.max(data, function(d) {
        return d.value;
    })]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select(this.ChartPlaceHolder).append("svg")
        .attr("width", this.Width + this.Margin.left + this.Margin.right)
        .attr("height", this.Height + this.Margin.top + this.Margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.Margin.left + "," + this.Margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");
    //.text("Percent");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.country);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.value);
        })
        .attr("height", function(d) {
            return height - y(d.value);
        })
        .style("fill", "#1684ca");


        svg.selectAll(".x.axis text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-90)";
        });

    return svg;
};
;charterflight.LineChart = function LineChart()
{

  this.ShowLegend = false;
  this.Width = 200;
  this.Height = 200;
  this.svg = null;

  this.Margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };

  this.BlurbPlaceHolder = "";
  this.ChartPlaceHolder = "";

  this.Data = null;

};

charterflight.LineChart.prototype.Draw = function()
{
  // Necessary to keep a reference within an event handler
  var _self = this;

  width = this.Width - this.Margin.left - this.Margin.right;
  height = this.Height - this.Margin.top - this.Margin.bottom;

  var parseDate = d3.time.format("%Y").parse;

  // Coerce the data into the right formats
  data = this.Data.map(function(d) {
    return {
      country: d.country,
      date: parseDate(d.date),
      value: +d.value
    };
  });

  // then we need to nest the data on country since we want to only draw one
  // line per country
  data = d3.nest().key(function(d) {
    return d.country;
  }).entries(data);

  // varNames and color.domain are important to link colors of lines
  // to the legend
  var varNames = [];

  data.forEach(function(d) {
    varNames.push(d.key);
  });

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.value);
    }).defined(function(d) {
      return d.value;
    });

  var svg = d3.select(this.ChartPlaceHolder).append("svg")
    .attr("width", width + this.Margin.left + this.Margin.right)
    .attr("height", height + this.Margin.top + this.Margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.Margin.left + "," + this.Margin.top + ")");

  color.domain(d3.keys(data[0]).filter(function(key) {
    return key == "country";
  }));

  color.domain(varNames);

  x.domain([d3.min(data, function(d) {
      return d3.min(d.values, function(d) {
        return d.date;
      });
    }),
    d3.max(data, function(d) {
      return d3.max(d.values, function(d) {
        return d.date;
      });
    })
  ]);

  y.domain([d3.min(data, function(d) {
    return d3.min(d.values, function(d) {
      return d.value;
    });
  }), d3.max(data, function(d) {
    return d3.max(d.values, function(d) {
      return d.value;
    });
  })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  var countries = svg.selectAll(".country")
    .data(data, function(d) {
      return d.key;
    })
    .enter().append("g")
    .attr("class", "country");

  // DIV que funciona como tooltip
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  countries.append("svg:path")
    .attr("class", "line")
    .attr("id", function (d)
    {
      return d.key;
    })
    .attr("d", function(d) {
      return line(d.values);
    })
    .on("mouseover", function(d) {
      var currClass = d3.select("#" + d.key).attr("class");
      d3.select("#" + d.key).attr("class", currClass + " current");

      if (_self.ShowLegend === true)
      {
        currClass = d3.select("#legend-" + d.key).attr("class");
        d3.select("#legend-" + d.key).attr("class", currClass + " current-legend");
      }

      if (_self.BlurbPlaceHolder !== "")
        {
          b = new charterflight.Blurb();
          b.BlurbPlaceHolder = this.BlurbPlaceHolder;
          b.Data = d;
          b.Draw();
        }
      }
    )
    .on("mouseout", function(d)
    {
      var currClass = d3.select("#" + d.key).attr("class");
      var prevClass = currClass.substring(0, currClass.length - 8);
      d3.select("#" + d.key).attr("class", prevClass);

      if (_self.ShowLegend === true)
      {
        currClass = d3.select("#legend-" + d.key).attr("class");
        prevClass = currClass.substring(0, currClass.length - 14);
        d3.select("#legend-" + d.key).attr("class", prevClass);
      }
    })
    .style("stroke", function(d) {
      return color(d.key);
    });

  // Append dots to display data points
  countries.append("g").selectAll("circle")
    .data(function(d) {
      return d.values;
    })
    .enter()
    .append("circle")
    .attr("r", 3)
    .attr("cx", function(dd) {
      return x(dd.date);
    })
    .attr("cy", function(dd) {
      return y(dd.value);
    })
    .style("fill", function(d) {
      return color(d.country);
    })
    .attr("stroke", "none")
    .on("mouseover", function(d) {
      div.style("left", d3.event.pageX + "px").style("top", d3.event.pageY + "px");
      div.transition().duration(100).style("opacity", 100);
      div.html('<p>Country: ' + d.country + '<br />Date: ' + d.date.getFullYear() + '<br/>Value: ' + d.value + '</p>');
    })
    .on("mouseout", function(d) {
      div.transition().duration(4000).style("opacity", 0);
    });

if (this.ShowLegend === true)
{
  // Legend with country names
  var legend = svg.selectAll(".legend")
    .data(varNames.slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(55," + i * 20 + ")";
    }).on("mouseover", function(d, i) {
        // Highlight series when hover over legend
        var currClass = d3.select("#" + d).attr("class");
        d3.select("#" + d).attr("class", currClass + " current");



    })
    .on("mouseout", function(d, i) {
      var currClass = d3.select("#" + d).attr("class");
      var prevClass = currClass.substring(0, currClass.length - 8);
      d3.select("#" + d).attr("class", prevClass);



    });

    legend.append("text")
      .attr("x", width + 20)
      .attr("y", 6)
      .attr("dy", ".35em")
      .attr("id", function(d){
        return "legend-" + d;
      })
      .style("text-anchor", "end")
      .style("fill", color)
      .text(function(d) {
        return d;
      })
      .on("mouseover", function(d, i)
      {
        var currClass = d3.select("#" + d).attr("class");
        d3.select(this).attr("class", currClass + " current-legend");
      })
      .on("mouseout", function(d, i) {
        var currClass = d3.select(this).attr("class");
        var prevClass = currClass.substring(0, currClass.length - 14);
        d3.select(this).attr("class", prevClass);
      });

  }

  // We give access to svg object
  this.svg = svg;
};
