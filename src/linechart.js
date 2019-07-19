"use strict";
import "./sanitize";
import "./array";
import * as d3 from 'd3';
import D3Legend from  "./d3legend";

import LineChartStyles from "./linechart.styles";

import * as utils from "./utils";

export default class LineChart {
  
  constructor(height=400, width=400)
  {
    this.el = null;
    this.Width = width;
    this.Height = height;
    this.svg = null;

    //Title of the chart
    this.Title = ""

    //Type of curve
    this.curveType = d3.curveBasis;

    this.Margin = {
      top: 10,
      right: 50,
      bottom: 50,
      left: 50
    };

    this.Style = LineChartStyles.Conventional;

    // Style for the chart
    const color = d3.scaleOrdinal(d3.schemeAccent);

    this.ShowDataPoint = true;

    this.DivChart = null;

    // Legend to be placed here
    this.DivLegend = null;

    // Data
    this.Data = null;

    this.ShowLegend = true;

    this.entityField = 'country';
    this.pivotField = 'date';
    this.valueField = 'value';
  }

  Draw()
  {    
    // Necessary to keep a reference within an event handler
    const _self = this;

    // Create ID for the legend
    _self.LegendPlaceHolder = this.ChartPlaceHolder + "-" + "Legend";

    const width = _self.Width - _self.Margin.left - _self.Margin.right;
    const height = _self.Height - _self.Margin.top - _self.Margin.bottom;

    var parseTime = d3.timeParse("%Y");

    // Coerce the data into the right format

    var data = [];

    for (let i = 0; i < _self.Data.length; i++)
    {
      let obj = {};
      obj[_self.entityField] = _self.Data[i][_self.entityField];
      obj[_self.pivotField] = parseTime(_self.Data[i][_self.pivotField]);
      obj[_self.valueField] = parseFloat(_self.Data[i][_self.valueField]);
      data.push(obj);
    }

    // then we need to nest the data on entity since we want to only draw one
    // line per entity
    data = d3.nest().key( function(d) { return d[_self.entityField]; }).entries(data);

    // varNames and color.domain are important to link colors of lines
    // to the legend
    const varNames = [];

    data.forEach(({key}) => {
      varNames.push(key);
    });

    const x = d3.scaleTime()
      .range([0, width]);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeAccent);

    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y);

    const line = d3.line()
      .curve(this.curveType)
      .x(({date}) => x(date))
      .y(({value}) => y(value))
      .defined(({value}) => value);

      // Select the element based on the chartplaceholder property
      _self.el = document.getElementById(_self.ChartPlaceHolder);

      // Draw title of the chart
      if (_self.Title != "")
      {
        d3.select(_self.el)
          .append("div")
          .attr("id", "Title")
          .text(_self.Title)
          .style("font", utils.scale_font_size(_self.Width + _self.Height)  + " sans-serif")
          .style("text-align", "center");
      }
 
      // Check that the #Chart element exists and, on the contrary, create it
      if (d3.select(_self.el).select("#Chart-" + this.ChartPlaceHolder).empty())
      {
        _self.DivChart = d3.select(_self.el)
          .append("div")
          .attr("id", "Chart-" + this.ChartPlaceHolder)
          .style("margin", "0.1em 0.1em 0 1em")
          .style("padding", "0.1em 0.1em 0 1em");
      }

      // First we have to remove svg
      // in case we are redrawing
      // the chart.
      d3.select(_self.el).select("#Chart-" + this.ChartPlaceHolder).select("svg").remove();

    const svg = d3.select(_self.el).select("#Chart-" + this.ChartPlaceHolder).append("svg")
      .style("fill", ("none"))
      .attr("width", width + _self.Margin.left + _self.Margin.right)
      .attr("height", height + _self.Margin.top + _self.Margin.bottom)
      .append("g")
      .attr("transform", 'translate('+ _self.Margin.left + ',' + _self.Margin.top + ')');

    color.domain(d3.keys(data[0]).filter(key => key == _self.entityField));

    color.domain(varNames);

    const maxDate = d3.max(data,
      ({values}) => d3.max(values, ({date}) => date));

    const minDate = d3.min(data,
      ({values}) => d3.min(values, ({date}) => date));

    const maxValue = d3.max(data,
      ({values}) => d3.max(values, ({value}) => value));

    const minValue = d3.min(data,
      ({values}) => d3.min(values, ({value}) => value));

    var y_padding = Math.round(maxValue - minValue)*0.1;

    x.domain([minDate, maxDate]);

    y.domain([minValue, maxValue + y_padding]);

    svg.append("g")
      .attr("class", "x axis")
      .style("font", _self.Style.Axis.x.font)
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")      
      .attr("y", 0)
      .attr("x", 7)
      .attr("dy", ".01em")
      .attr("transform", "rotate(90)")
      .style("margin", "0px")
      .style("font-size", "10px")
      .style("text-anchor", "start");

    svg.append("g")
      .attr("class", " axis")
      .style("font", _self.Style.Axis.y.font)
      .call(yAxis);

    const entities = svg.selectAll(".entity")
      .data(data, ({key}) => key)
      .enter().append("g")
      .attr("class", "entity");

    // DIV que funciona como tooltip
    const div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("float", "left")
      .style("clear", "none");

  // We need to replaceAll spaces with underscore
  // to avoid issues during event handler

  // We add lines to the chart
  //
  //
  // .attr("data-legend",function(d) { return d.key})
  // allow us to generate the legend
  //
  if (_self.ShowLegend == true)
  {
  _self.DivLegend = d3.select(_self.el)
  .append("div")
  .attr("id", this.LegendPlaceHolder)
  .style("float", "left")
  .style("clear", "both")
  .style("dislpay", "relative")
  .style("width", _self.Width)   
  .style("margin", "0 5em 0.1em 5em");
  }
    
  entities.append("svg:path")
      .attr("data-legend",
      function(d) {
        return d.key
      })
      .attr("class", "line")
      .attr("id", d => {

        // This function writes the legend
      var l = new D3Legend();
      l.LegendPlaceHolder = _self.LegendPlaceHolder;

      const legend = d3.select("#" + _self.LegendPlaceHolder).append("g")
        .attr("id", "legend-label-" + _self.LegendPlaceHolder + "-" + d.key.sanitize())
        .attr("class","legend")
        .attr("data-legend-label", d.key.sanitize())
        .attr("font-legend-size", "10px")
        .attr("data-legend-label-color", color(d.key))
        .style("float", "left")
        .attr("transform", function (d, i)
          {
              return "translate(0," + i * 20 + ")"
          })
        .style("font", "10px")
        .call(l.Legend);        
        
        return ("legend-line-" + _self.LegendPlaceHolder + "-" + d.key.sanitize());

      })
      .attr("d", ({values}) => line(values))
      .on("mouseover", d => {
        d3.select(_self.el)
        .select("#legend-line-" + _self.LegendPlaceHolder + "-" + d.key.sanitize())
        .style("stroke-width", (_self.Style.StrokeWidth * 2));

        d3.select(_self.el)
        .select('#legend-label-' + _self.LegendPlaceHolder + "-" + d.key.sanitize())
        .style("color", "#fff")
        .style("background-color", color(d.key));

        d3.selectAll("#circle-" + _self.LegendPlaceHolder + "-" + d.key.sanitize())
        .attr("r", 6);

        }
      )
      .on("mouseout", ({key}) => {

        d3.select(_self.el)
        .select("#legend-line-" + _self.LegendPlaceHolder + "-" + key.sanitize())
        .style("stroke-width", (_self.Style.StrokeWidth));

        d3.select(_self.el)
        .select('#legend-label-' + _self.LegendPlaceHolder + "-" + key.sanitize())
        .style("color", color(key))
        .style("border-color", color(key))
        .style("background-color", "#fff");

        d3.selectAll("#circle-" + _self.LegendPlaceHolder + "-" + key.sanitize())
        .attr("r", 3);

    })
    .style("stroke", ({key}) => color(key))
    .style("border-width", _self.Style.StrokeWidth);
  
    // Display the tooltip when we hover over data points
    if (_self.Style.ShowDataPoint == true)
    {      
      // Append dots to display data points
      entities.append("g").selectAll("circle")
      .data(({values}) => values)
      .enter()
      .append(_self.Style.DataPoint.ShapeDataPoint)
      .attr("r", _self.Style.DataPoint.SizeDataPoint)
      .attr("cx", ({date}) => x(date))
      .attr("cy", ({value}) => y(value))
      .attr("id", (e) => "circle-" + _self.LegendPlaceHolder + "-" + _self.valueField)
      .style("stroke", (e) => color(e[this.entityField].sanitize()))
      .style("stroke-width", _self.Style.DataPoint.StrokeWidth)
      .style("fill", (e) => utils.shade_color(color(e[this.entityField].sanitize()), 0.4))
      .on("mouseover", (e) => {
        div.style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY}px`)
        .style("border", _self.Style.ToolTip.border)
        .style("font",  _self.Style.ToolTip.font)
        .style("border-radius",  _self.Style.ToolTip.border_radius)
        .style("box-shadow",  _self.Style.ToolTip.box_shadow)
        .style("padding",  _self.Style.ToolTip.padding)
        .style("background-color",  _self.Style.ToolTip.background_color)
        .style("position",  _self.Style.ToolTip.position);

        div.transition().duration(500).style("opacity", 500);

        div.html(`<p>Entity: ${e[this.entityField]}<br />Date: ${e[this.pivotField].getFullYear()}<br/>Value: ${e[this.valueField]}</p>`);
        
        d3.select(_self.el)
        .select("#legend-line-" + _self.LegendPlaceHolder + "-" + e[this.entityField].sanitize())
        .style("stroke-width", (_self.Style.StrokeWidth * 2));

        d3.select(_self.el)
        .select('#legend-label-' + e[this.entityField].sanitize())
        .style("color", "#fff")
        .style("background-color", color(e[this.entityField].sanitize()));

        d3.selectAll("#circle-" + _self.LegendPlaceHolder + "-" + e[this.entityField].sanitize())
        .attr("r", 6);
      })
      .on("mouseout", e => {
        div.transition().duration(2000).style("opacity", 0)
        d3.select(_self.el)
        .select("#legend-line-" + _self.LegendPlaceHolder + "-" + e[this.entityField].sanitize())
        .style("stroke-width", (_self.Style.StrokeWidth));
        
        d3.select(_self.el)
        .select('#legend-label-' + _self.LegendPlaceHolder + "-" + e[this.entityField].sanitize())
        .style("border-color", color(e[this.entityField].sanitize()))
        .style("color", color(e[this.entityField].sanitize()))
        .style("background-color", "#fff");

        d3.selectAll("#circle-" + _self.LegendPlaceHolder + "-" + e[this.entityField].sanitize())
        .attr("r", 3);
      });

    }

    // We give access to svg object
    this.svg = svg;
  }
}
