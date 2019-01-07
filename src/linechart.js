"use strict";

import "./sanitize";
import "./array";

import * as d3 from 'd3';
import D3Legend from  "./d3legend";

export default class LineChart
{
  constructor()
  {
    this.el = null;
    this.Width = 400;
    this.Height = 400;
    this.svg = null;

    this.Margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    };

    //Title of the chart
    this.Title = "";

    // Chart div stored here
    this.DivChart = null;

    // Legend to be placed here
    this.DivLegend = null;

    // Data
    this.Data = null;

    // DataPointFormat
    this.showDataPoint = true;
    this.shapeDataPoint = "circle";
    this.sizeDataPoint = 4;

  }

  Draw()
  {
    // Necessary to keep a reference within an event handler
    const _self = this;
    
    const width = _self.Width - _self.Margin.left - _self.Margin.right;
    const height = _self.Height - _self.Margin.top - _self.Margin.bottom;

    var parseTime = d3.timeParse("%Y");

    // Coerce the data into the right format
    var data = _self.Data.map(({entity, date, value}) => ({
      entity,
      date: parseTime(date),
      value: +value
    }), this);

    // then we need to nest the data on entity since we want to only draw one
    // line per entity
    data = d3.nest().key(({entity}) => entity).entries(data);

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
      .curve(d3.curveBasis)
      .x(({date}) => x(date))
      .y(({value}) => y(value))
      .defined(({value}) => value);

      // Select the elemnt base don the chartplaceholder property
      _self.el = document.getElementById(_self.ChartPlaceHolder);

      // Check that the #Chart element exists and, on the contrary, create it
      if (d3.select(_self.el).select("#Chart").empty())
      {
        _self.DivChart = d3.select(_self.el)
          .append("div")
          .attr("id", "Chart")
          .style("margin", "50px");
        
        _self.DivLegend = d3.select(_self.el)
        .append("div")
        .attr("id", "Legend")
        .style("margin", "50px");
      }

      // First we have to remove svg
      // in case we are redrawing
      // the chart.
      d3.select(_self.el).select("#Chart").select("svg").remove();

    const svg = d3.select(_self.el).select("#Chart").append("svg")
      .style("fill", ("none"))
      .attr("width", width + _self.Margin.left + _self.Margin.right)
      .attr("height", height + _self.Margin.top + _self.Margin.bottom)
      .append("g")
      .attr("transform", 'translate('+ _self.Margin.left + ',' + _self.Margin.top + ')');

    color.domain(d3.keys(data[0]).filter(key => key == "entity"));

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
      .style("font", "14px sans-serif")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .style("font", "14px sans-serif")
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
    entities.append("svg:path")
      .attr("data-legend",
      function(d) { return d.key}
      ).attr("class", "line").attr("id", d => {

      // This function writes the legend
      //
        var l = new D3Legend();
        
        const legend = svg.append("g")
          .attr("class","legend")
          .attr("transform","translate(50,30)")
          .style("font","14px sans-serif")
          .call(l.Legend);

      return d.key.sanitize();

    }).attr("d", ({values}) => line(values))
      .on("mouseover", d => {
        let currClass = d3.select(_self.el)
        .select(`#${d.key.sanitize()}`)
        .attr("class");

        d3.select(_self.el)
        .select(`#${d.key.sanitize()}`)
        .attr("class", `${currClass} current`);
        }
      )
      .on("mouseout", ({key}) => {
        let currClass = d3.select(`#${key.sanitize()}`).attr("class");
        let prevClass = currClass.substring(0, currClass.length - 8);
        d3.select(`#${key.sanitize()}`).attr("class", prevClass);

    }).style("stroke", ({key}) => color(key));

    if (_self.showDataPoint == true)
    {
      // Append dots to display data points
      entities.append("g").selectAll("circle")
      .data(({values}) => values)
      .enter()
      .append(_self.shapeDataPoint)
      .attr("r", _self.sizeDataPoint)
      .attr("cx", ({date}) => x(date))
      .attr("cy", ({value}) => y(value))
      .style("fill", ({entity}) => color(entity))
      .attr("stroke", "none")
      .on("mouseover", ({entity, date, value}) => {
        
        div.style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY}px`)
        .style("border", "1px solid #DDDDDD")
        .style("padding", "3px 5px 3px 5px")
        .style("background-color", "#DDDDDD")
        .style("position", "absolute");
        
        div.transition().duration(100).style("opacity", 100);
        
        div.html(`<p>Entity: ${entity}<br />Date: ${date.getFullYear()}<br/>Value: ${value}</p>`);
      })
      .on("mouseout", d => {
        div.transition().duration(2000).style("opacity", 0);
      });

    }
    
    // Draw title of the chart
    if (_self.Title !== "")
    {
      svg.append("text")
        .attr("x", (_self.Width / 2))             
        .attr("y", 0 - (_self.Margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(_self.Title);
    }
  
    // We give access to svg object
    this.svg = svg;

  }
}