(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

class LineChart {

  constructor ()
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

  }

  Draw ()
  {
    // Necessary to keep a reference within an event handler
    const _self = this;

    width = this.Width - this.Margin.left - this.Margin.right;
    height = this.Height - this.Margin.top - this.Margin.bottom;

    const parseDate = d3.time.format("%Y").parse;

    // Coerce the data into the right formats
    data = this.Data.map(({entity, date, value}) => ({
      entity,
      date: parseDate(date),
      value: +value
    }));

    // then we need to nest the data on entity since we want to only draw one
    // line per entity
    data = d3.nest().key(({entity}) => entity).entries(data);

    // varNames and color.domain are important to link colors of lines
    // to the legend
    const varNames = [];

    data.forEach(({key}) => {
      varNames.push(key);
    });

    const x = d3.time.scale()
      .range([0, width]);

    const y = d3.scale.linear()
      .range([height, 0]);

    const color = d3.scale.category10();

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    const line = d3.svg.line()
      .interpolate("basis")
      .x(({date}) => x(date))
      .y(({value}) => y(value)).defined(({value}) => value);

    const svg = d3.select(this.ChartPlaceHolder).append("svg")
      .attr("width", width + this.Margin.left + this.Margin.right)
      .attr("height", height + this.Margin.top + this.Margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.Margin.left},${this.Margin.top})`);

    color.domain(d3.keys(data[0]).filter(key => key == "entity"));

    color.domain(varNames);

    x.domain([d3.min(data, ({values}) => d3.min(values, ({date}) => date)),
      d3.max(data, ({values}) => d3.max(values, ({date}) => date))
    ]);

    y.domain([d3.min(data, ({values}) => d3.min(values, ({value}) => value)), d3.max(data, ({values}) => d3.max(values, ({value}) => value))]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    const entities = svg.selectAll(".entity")
      .data(data, ({key}) => key)
      .enter().append("g")
      .attr("class", "entity");

    // DIV que funciona como tooltip
    const div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // We need to replaceAll spaces with underscore
  // to avoid issues during event handler
    entities.append("svg:path")
      .attr("class", "line")
      .attr("id", d => {
      if (_self.LegendPlaceHolder !== "")
      {
        $(_self.LegendPlaceHolder)
        .append(`<div class="legend-item" id="legend-${d.key.sanitize()}" style="color:${color(d.key)}">${d.key}</div>`);

        // Highlight line when hovering over legend

        d3.select(`#legend-${d.key.sanitize()}`).on("mouseover", () => {

          let currClass = d3.select(`#${d.key.sanitize()}`).attr("class");
          d3.select(`#${d.key.sanitize()}`).attr("class", `${currClass} current`);

          currClass = d3.select(`#legend-${d.key.sanitize()}`).attr("class");
          d3.select(`#legend-${d.key.sanitize()}`).style('background-color', color(d.key));
          d3.select(`#legend-${d.key.sanitize()}`).style('color', "#fff");

          // Print blurb if a placeholder has been specified
          if (_self.BlurbPlaceHolder !== "")
            {
              b = new charterflight.Blurb();
              b.BlurbPlaceHolder = _self.BlurbPlaceHolder;
              b.Data = d;
              b.Draw();
            }

        });

        d3.select(`#legend-${d.key.sanitize()}`).on("mouseout", () => {
          let currClass = d3.select(`#${d.key.sanitize()}`).attr("class");
          let prevClass = currClass.substring(0, currClass.length - 8);
          d3.select(`#${d.key.sanitize()}`).attr("class", prevClass);

          currClass = d3.select(`#legend-${d.key.sanitize()}`).attr("class");
          prevClass = currClass.substring(0, currClass.length - 14);
          d3.select(`#legend-${d.key.sanitize()}`).style('background-color', "#fff" );
          d3.select(`#legend-${d.key.sanitize()}`).style('color', color(d.key));

        });

      }
      return d.key.sanitize();
    })
      .attr("d", ({values}) => line(values))
      .on("mouseover", d => {
        let currClass = d3.select(`#${d.key.sanitize()}`).attr("class");
        d3.select(`#${d.key.sanitize()}`).attr("class", `${currClass} current`);

        if (_self.LegendPlaceHolder !== "")
        {
          currClass = d3.select(`#legend-${d.key.sanitize()}`).attr("class");
          d3.select(`#legend-${d.key.sanitize()}`).style('background-color', color(d.key));
          d3.select(`#legend-${d.key.sanitize()}`).style('color', "#fff");

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
      .on("mouseout", ({key}) => {
      let currClass = d3.select(`#${key.sanitize()}`).attr("class");
      let prevClass = currClass.substring(0, currClass.length - 8);
      d3.select(`#${key.sanitize()}`).attr("class", prevClass);

      if (_self.LegendPlaceHolder !== "")
      {
        currClass = d3.select(`#legend-${key.sanitize()}`).attr("class");
        prevClass = currClass.substring(0, currClass.length - 14);
        d3.select(`#legend-${key.sanitize()}`).style('background-color', "#fff" );
        d3.select(`#legend-${key.sanitize()}`).style('color', color(key));
      }
    })
      .style("stroke", ({key}) => color(key));

    // Append dots to display data points
    entities.append("g").selectAll("circle")
      .data(({values}) => values)
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", ({date}) => x(date))
      .attr("cy", ({value}) => y(value))
      .style("fill", ({entity}) => color(entity))
      .attr("stroke", "none")
      .on("mouseover", ({entity, date, value}) => {
        div.style("left", `${d3.event.pageX}px`).style("top", `${d3.event.pageY}px`);
        div.transition().duration(100).style("opacity", 100);
        div.html(`<p>entity: ${entity}<br />Date: ${date.getFullYear()}<br/>Value: ${value}</p>`);
      })
      .on("mouseout", d => {
        div.transition().duration(4000).style("opacity", 0);
      });

    // We give access to svg object
    this.svg = svg;
  }
}

//import * as d3 from 'd3';
var lc = new LineChart();

})));
