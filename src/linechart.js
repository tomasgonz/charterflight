charterflight.LineChart = function LineChart()
{

  this.Width = 200;
  this.Height = 200;
  this.svg = null;

  this.Margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };

  this.LegendPlaceHolder = "";
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

// We need to replaceAll spaces with underscore
// to avoid issues during event handler
  countries.append("svg:path")
    .attr("class", "line")
    .attr("id", function (d)
    {
      if (_self.LegendPlaceHolder !== "")
      {
        $(_self.LegendPlaceHolder)
        .append('<div class="legend-item" id="legend-' +
        d.key.sanitize()  + '" style="color:' + color(d.key) + '">' +
        d.key + "</div>");

        // Highlight line when hovering over legend

        d3.select("#legend-" + d.key.sanitize()).on("mouseover", function()
        {

          var currClass = d3.select("#" + d.key.sanitize()).attr("class");
          d3.select("#" + d.key.sanitize()).attr("class", currClass + " current");

          currClass = d3.select("#legend-" + d.key.sanitize()).attr("class");
          //d3.select("#legend-" + d.key.sanitize()).attr("class", currClass + " current-legend");
          d3.select("#legend-" + d.key.sanitize()).style('background-color', color(d.key));
          d3.select("#legend-" + d.key.sanitize()).style('color', "#fff");

          // Print blurb if a placeholder has been specified
          if (_self.BlurbPlaceHolder !== "")
            {
              b = new charterflight.Blurb();
              b.BlurbPlaceHolder = _self.BlurbPlaceHolder;
              b.Data = d;
              b.Draw();
            }

        });

        d3.select("#legend-" + d.key.sanitize()).on("mouseout", function()
        {
          var currClass = d3.select("#" + d.key.sanitize()).attr("class");
          var prevClass = currClass.substring(0, currClass.length - 8);
          d3.select("#" + d.key.sanitize()).attr("class", prevClass);

          currClass = d3.select("#legend-" + d.key.sanitize()).attr("class");
          prevClass = currClass.substring(0, currClass.length - 14);
          d3.select("#legend-" + d.key.sanitize()).style('background-color', "#fff" );
          d3.select("#legend-" + d.key.sanitize()).style('color', color(d.key));

        });

      }
      return d.key.sanitize();
    })
    .attr("d", function(d) {
      return line(d.values);
    })
    .on("mouseover", function(d) {
      var currClass = d3.select("#" + d.key.sanitize()).attr("class");
      d3.select("#" + d.key.sanitize()).attr("class", currClass + " current");

      if (_self.LegendPlaceHolder !== "")
      {
        currClass = d3.select("#legend-" + d.key.sanitize()).attr("class");
        //d3.select("#legend-" + d.key.sanitize()).attr("class", currClass + " current-legend");
        d3.select("#legend-" + d.key.sanitize()).style('background-color', color(d.key));
        d3.select("#legend-" + d.key.sanitize()).style('color', "#fff");

      }

      if (_self.BlurbPlaceHolder !== "")
        {
          b = new charterflight.Blurb();
          b.BlurbPlaceHolder = _self.BlurbPlaceHolder;
          b.Data = d;
          b.Draw();
        }
      }
    )
    .on("mouseout", function(d)
    {
      var currClass = d3.select("#" + d.key.sanitize()).attr("class");
      var prevClass = currClass.substring(0, currClass.length - 8);
      d3.select("#" + d.key.sanitize()).attr("class", prevClass);

      if (_self.LegendPlaceHolder !== "")
      {
        currClass = d3.select("#legend-" + d.key.sanitize()).attr("class");
        prevClass = currClass.substring(0, currClass.length - 14);
        d3.select("#legend-" + d.key.sanitize()).style('background-color', "#fff" );
        d3.select("#legend-" + d.key.sanitize()).style('color', color(d.key));
        //d3.select("#legend-" + d.key.sanitize()).attr("class", prevClass);
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

if (this.LegendPlaceHolder !== "")
{


  // Legend with country names
  /*

  var legend = svg.selectAll(".legend")
    .data(varNames.slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(55," + i * 20 + ")";
    }).on("mouseover", function(d, i) {
        // Highlight series when hover over legend
        var currClass = d3.select("#" + d.sanitize()).attr("class");
        d3.select("#" + d.sanitize()).attr("class", currClass + " current");
    })
    .on("mouseout", function(d, i) {
      var currClass = d3.select("#" + d.sanitize()).attr("class");
      var prevClass = currClass.substring(0, currClass.length - 8);
      d3.select("#" + d.sanitize()).attr("class", prevClass);
    });

    legend.append("text")
      .attr("x", width + 20)
      .attr("y", 6)
      .attr("dy", ".35em")
      .attr("id", function(d){
        console.log("legend-" + d.sanitize());
        return "legend-" + d.sanitize();
      })
      .style("text-anchor", "end")
      .style("fill", color)
      .text(function(d) {
        return d;
      })
      .on("mouseover", function(d, i)
      {
        var currClass = d3.select("#" + d.sanitize()).attr("class");
        d3.select(this).attr("class", currClass + " current-legend");
      })
      .on("mouseout", function(d, i) {
        var currClass = d3.select(this).attr("class");
        var prevClass = currClass.substring(0, currClass.length - 14);
        d3.select(this).attr("class", prevClass);
      });*/

  }

  // We give access to svg object
  this.svg = svg;
};
