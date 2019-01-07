import * as d3 from 'd3';

export default class D3Legend {

    Legend(g)
    {
      
      g.each(function(g) {
        var g = d3.select(this),
            items = {},
            svg = d3.select(g.property("nearestViewportElement")),
            legendPadding = g.attr("data-style-padding") || 5,
            lb = g.selectAll(".legend-box").data([true]),
            li = g.selectAll(".legend-items").data([true]);

        lb.enter().append("rect").classed("legend-box",true);
        li.enter().append("g").classed("legend-items",true);

        svg.selectAll("[data-legend]").each(function() {

            var self = d3.select(this);

            items[self.attr("data-legend")] = {
              pos : self.attr("data-legend-pos") || this.getBBox().y,
              color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke")
            }
          })

        items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos});
        li.selectAll("circle")
            .data(items,function(d) { return d.key})
            .call(function(d) { d.enter().append("circle")})
            .call(function(d) { d.exit().remove()})
            .attr("cy",function(d,i) { return i-0.25+"em"})
            .attr("cx",0)
            .attr("r","0.4em")
            .style("fill",function(d) { return d.value.color});
            
      });

    return g



  }
}
