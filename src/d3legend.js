import * as d3 from 'd3';

export default class D3Legend {

  constructor()
  {
    
  }
  
  Legend(gg)
  {

    gg.each(function(g) {
      var g = d3.select(this.LegendPlaceHolder),
          items = {},
          lb = g.selectAll(".legend-box").data([true]),
          li = g.selectAll(".legend-items").data([true]);
      
      lb.enter().append("rect").classed("legend-box",true);
      li.enter().append("g").classed("legend-items",true);

      var _legendItem = lb.enter().append("div")
      .attr("id", "legend-label-" + d3.select(this).attr("data-legend-label"))
      .style("float", "left")
      .style("position", "relative")
      .style("margin", "0.3em")
      .style("padding","0.2em")
      .style("border", "1px solid")
      .style("font",  d3.select(this).attr("font-legend-size") + " sans-serif")
      .style("border-radius", "8px")
      .style("color", d3.select(this).attr("data-legend-label-color"));
      
      _legendItem.append("text")
      .text(d3.select(this).attr("data-legend-label"));
      
    });

    return gg

  }
}
