/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
module.exports = __webpack_require__(6);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

(function(global) {

    var charterflight = {
        'version': '0.1'
    };

    if (global.charterflight) {
        throw new Error('Charterflight has already been defined');
    } else {
        global.charterflight = charterflight;
    }

})(typeof window === 'undefined' ? this : window);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

charterflight.BarChart = function BarChart()
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
            entity: d.entity,
            value: +d.value
        };
    });

    var y = d3.scale.linear()
        .range([ height, 0]);

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1)
        .domain(d3.entries(data).map(function(d) {
            return d.value.entity;
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
            return x(d.entity);
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


/***/ }),
/* 4 */
/***/ (function(module, exports) {

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


/***/ }),
/* 5 */
/***/ (function(module, exports) {

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
      entity: d.entity,
      date: parseDate(d.date),
      value: +d.value
    };
  });

  // then we need to nest the data on entity since we want to only draw one
  // line per entity
  data = d3.nest().key(function(d) {
    return d.entity;
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
    return key == "entity";
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

  var entities = svg.selectAll(".entity")
    .data(data, function(d) {
      return d.key;
    })
    .enter().append("g")
    .attr("class", "entity");

  // DIV que funciona como tooltip
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// We need to replaceAll spaces with underscore
// to avoid issues during event handler
  entities.append("svg:path")
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
      }
    })
    .style("stroke", function(d) {
      return color(d.key);
    });

  // Append dots to display data points
  entities.append("g").selectAll("circle")
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
      return color(d.entity);
    })
    .attr("stroke", "none")
    .on("mouseover", function(d) {
      div.style("left", d3.event.pageX + "px").style("top", d3.event.pageY + "px");
      div.transition().duration(100).style("opacity", 100);
      div.html('<p>entity: ' + d.entity + '<br />Date: ' + d.date.getFullYear() + '<br/>Value: ' + d.value + '</p>');
    })
    .on("mouseout", function(d) {
      div.transition().duration(4000).style("opacity", 0);
    });

  // We give access to svg object
  this.svg = svg;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

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

  var s = this.replace(/\W+/g, "");
  return s;
};


/***/ })
/******/ ]);